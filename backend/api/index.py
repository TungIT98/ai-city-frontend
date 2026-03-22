"""
AI City Backend - FastAPI with JWT Authentication & Rate Limiting
Secured endpoints with Bearer token verification
Protected against DDoS with rate limiting
"""
import os
import json
import time
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime, timedelta
from collections import defaultdict
from functools import wraps

from fastapi import FastAPI, HTTPException, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import jwt
from jwt.exceptions import InvalidTokenError

# Configuration
DATABASE_URL = os.environ.get('DATABASE_URL')
JWT_SECRET = os.environ.get('JWT_SECRET', '7d00ca1435d339b18a4b5358bef9427befd09342bffef65a3f44049664a53141')

app = FastAPI(title="AI City API", version="2.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# Rate Limiting Configuration & Storage
# ============================================================

# Rate limit storage: {ip: [(timestamp, endpoint), ...]}
rate_limit_storage = defaultdict(list)

# Rate limits (requests per minute)
RATE_LIMITS = {
    'auth': 10,      # /auth/* endpoints - stricter (prevent brute force)
    'public': 120,   # /health, /leads - moderate
    'protected': 200,  # authenticated endpoints - higher
}

# Cleanup interval (seconds) - remove old entries
CLEANUP_INTERVAL = 60

def get_client_ip(request: Request) -> str:
    """Extract client IP from request, handling proxies"""
    # Check X-Forwarded-For header first (for proxied requests)
    forwarded = request.headers.get('x-forwarded-for')
    if forwarded:
        return forwarded.split(',')[0].strip()

    # Check X-Real-IP header
    real_ip = request.headers.get('x-real-ip')
    if real_ip:
        return real_ip

    # Fallback to direct client
    if request.client:
        return request.client.host

    return 'unknown'

def is_rate_limited(ip: str, endpoint: str) -> tuple[bool, dict]:
    """
    Check if IP is rate limited for this endpoint.
    Returns (is_limited, headers_dict)
    """
    current_time = time.time()
    window_start = current_time - CLEANUP_INTERVAL

    # Determine rate limit category
    if endpoint.startswith('/auth'):
        limit = RATE_LIMITS['auth']
    elif endpoint in ['/', '/health', '/leads']:
        limit = RATE_LIMITS['public']
    else:
        limit = RATE_LIMITS['protected']

    # Clean old entries and count recent requests
    ip_requests = rate_limit_storage[ip]
    ip_requests[:] = [(ts, ep) for ts, ep in ip_requests if ts > window_start]

    # Count requests to this endpoint in window
    endpoint_requests = sum(1 for ts, ep in ip_requests if ep == endpoint)

    if endpoint_requests >= limit:
        # Calculate reset time
        if ip_requests:
            oldest = min(ts for ts, ep in ip_requests if ep == endpoint)
            reset_time = int(oldest + CLEANUP_INTERVAL - current_time)
        else:
            reset_time = CLEANUP_INTERVAL

        headers = {
            'X-RateLimit-Limit': str(limit),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': str(reset_time),
            'Retry-After': str(max(1, reset_time)),
        }
        return True, headers

    # Add this request
    ip_requests.append((current_time, endpoint))

    remaining = limit - endpoint_requests - 1
    headers = {
        'X-RateLimit-Limit': str(limit),
        'X-RateLimit-Remaining': str(max(0, remaining)),
        'X-RateLimit-Reset': str(CLEANUP_INTERVAL),
    }
    return False, headers

def rate_limit_middleware(request: Request, call_next):
    """Middleware to apply rate limiting"""
    # Skip rate limiting for OPTIONS requests (CORS preflight)
    if request.method == 'OPTIONS':
        return call_next(request)

    ip = get_client_ip(request)
    endpoint = request.url.path

    is_limited, headers = is_rate_limited(ip, endpoint)

    if is_limited:
        return JSONResponse(
            status_code=429,
            content={
                "error": "Too Many Requests",
                "message": f"Rate limit exceeded. Try again in {headers.get('Retry-After', 60)} seconds.",
                "code": "RATE_LIMIT_EXCEEDED"
            },
            headers=headers
        )

    response = call_next(request)

    # Add rate limit headers to response
    for key, value in headers.items():
        response.headers[key] = value

    return response

# Database connection
def get_db():
    return psycopg2.connect(
        DATABASE_URL,
        cursor_factory=RealDictCursor,
        sslmode='require'
    )

# ============================================================
# JWT Authentication Middleware
# ============================================================

PUBLIC_ENDPOINTS = {'/', '/health', '/leads'}

def verify_token(authorization: str = Header(None)):
    """Verify JWT token from Authorization header"""
    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Authorization header missing",
            headers={"WWW-Authenticate": "Bearer"}
        )

    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Invalid authorization format. Use: Bearer <token>",
            headers={"WWW-Authenticate": "Bearer"}
        )

    token = authorization[7:]  # Remove "Bearer " prefix

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload
    except InvalidTokenError as e:
        raise HTTPException(
            status_code=401,
            detail=f"Invalid or expired token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"}
        )

def require_auth(authorization: str = Header(None)):
    """Dependency for routes that require authentication"""
    return verify_token(authorization)

# ============================================================
# Rate Limit Dependency
# ============================================================

def check_rate_limit(request: Request):
    """Dependency to check rate limit for an endpoint"""
    ip = get_client_ip(request)
    endpoint = request.url.path

    is_limited, headers = is_rate_limited(ip, endpoint)
    if is_limited:
        raise HTTPException(
            status_code=429,
            detail=f"Rate limit exceeded. Try again in {headers.get('Retry-After', 60)} seconds.",
            headers=headers
        )

    return headers

def rate_limit_response(response, headers):
    """Add rate limit headers to response"""
    for key, value in headers.items():
        response.headers[key] = value
    return response

# ============================================================
# Database Helpers
# ============================================================

def get_leads_from_db(status=None, limit=50):
    conn = get_db()
    try:
        cur = conn.cursor()
        if status:
            cur.execute(
                "SELECT * FROM leads WHERE status = %s ORDER BY created_at DESC LIMIT %s",
                (status, limit)
            )
        else:
            cur.execute("SELECT * FROM leads ORDER BY created_at DESC LIMIT %s", (limit,))
        return cur.fetchall()
    finally:
        conn.close()

def get_analytics_from_db():
    conn = get_db()
    try:
        cur = conn.cursor()

        # Lead counts by status
        cur.execute("""
            SELECT status, COUNT(*) as count
            FROM leads
            GROUP BY status
        """)
        status_counts = {row['status']: row['count'] for row in cur.fetchall()}

        return {
            "qualified": status_counts.get('qualified', 0),
            "contacted": status_counts.get('contacted', 0),
            "new": status_counts.get('new', 0)
        }
    finally:
        conn.close()

# ============================================================
# Public Endpoints (No Auth Required)
# ============================================================

@app.get("/")
async def root(request: Request):
    """Public root endpoint"""
    headers = check_rate_limit(request)
    return {"status": "running", "service": "AI City API", "version": "2.0.0"}

@app.get("/health")
async def health(request: Request):
    """Public health check"""
    headers = check_rate_limit(request)

    matomo = "unavailable"
    qdrant = "unavailable"
    postgresql = "unavailable"

    # Check PostgreSQL
    try:
        conn = get_db()
        conn.close()
        postgresql = "ok"
    except:
        pass

    return {
        "matomo": matomo,
        "qdrant": qdrant,
        "postgresql": postgresql
    }

@app.get("/leads")
async def get_leads(request: Request, status: str = None, limit: int = 50):
    """Public endpoint - returns lead data"""
    headers = check_rate_limit(request)

    try:
        leads = get_leads_from_db(status, limit)
        return list(leads)
    except Exception as e:
        # Return mock data if DB fails
        return [
            {"id": 1, "name": "FPT Software", "email": "contact@fpt.com.vn", "status": "qualified"},
            {"id": 2, "name": "Viettel Group", "email": "contact@viettel.vn", "status": "contacted"}
        ]

# ============================================================
# Protected Endpoints (Auth Required)
# ============================================================

@app.get("/analytics/overview")
async def analytics_overview(request: Request, authorization: str = Header(None)):
    """Protected - requires valid JWT token"""
    headers = check_rate_limit(request)
    verify_token(authorization)  # Will raise 401 if invalid

    try:
        data = get_analytics_from_db()
        return {
            **data,
            "period": "today"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/agents")
async def get_agents(request: Request, authorization: str = Header(None)):
    """Protected - requires valid JWT token"""
    headers = check_rate_limit(request)
    verify_token(authorization)

    return [
        {"id": 1, "name": "Social Media Manager", "status": "active", "category": "Marketing"},
        {"id": 2, "name": "Content Writer", "status": "active", "category": "Content"},
        {"id": 3, "name": "Customer Support", "status": "paused", "category": "Support"}
    ]

@app.get("/notifications")
async def get_notifications(request: Request, authorization: str = Header(None)):
    """Protected - requires valid JWT token"""
    headers = check_rate_limit(request)
    verify_token(authorization)

    return [
        {"id": 1, "type": "info", "title": "New lead assigned", "message": "FPT Software was assigned to you", "time": "2 min ago", "read": False}
    ]

@app.get("/users")
async def get_users(request: Request, authorization: str = Header(None)):
    """Protected - requires valid JWT token"""
    headers = check_rate_limit(request)
    verify_token(authorization)

    return [
        {"id": 1, "name": "Admin", "email": "admin@ai-city.dev", "role": "admin"},
        {"id": 2, "name": "User", "email": "user@ai-city.dev", "role": "user"}
    ]

# ============================================================
# Auth Endpoints (For Token Generation)
# ============================================================

@app.post("/auth/login")
async def login(request: Request):
    """Generate JWT token for valid credentials"""
    headers = check_rate_limit(request)
    body = await request.json()
    email = body.get('email')
    password = body.get('password')

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password required")

    # Simple check - in production, verify against database with hashed password
    if email == "admin@ai-city.dev" and password == "admin123":
        token = jwt.encode(
            {
                "sub": email,
                "role": "admin",
                "exp": datetime.utcnow() + timedelta(hours=24)
            },
            JWT_SECRET,
            algorithm="HS256"
        )
        return {"access_token": token, "token_type": "bearer", "refresh_token": token}

    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/auth/refresh")
async def refresh_token(request: Request):
    """Refresh access token using refresh token"""
    headers = check_rate_limit(request)
    body = await request.json()
    refresh_token = body.get('refresh_token')

    if not refresh_token:
        raise HTTPException(status_code=400, detail="Refresh token required")

    try:
        payload = jwt.decode(refresh_token, JWT_SECRET, algorithms=["HS256"])
        new_token = jwt.encode(
            {
                "sub": payload.get('sub'),
                "role": payload.get('role', 'admin'),
                "exp": datetime.utcnow() + timedelta(hours=24)
            },
            JWT_SECRET,
            algorithm="HS256"
        )
        return {"access_token": new_token, "token_type": "bearer"}
    except InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

# ============================================================
# Error Handlers
# ============================================================

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail}
    )

# For Vercel serverless
handler = app
