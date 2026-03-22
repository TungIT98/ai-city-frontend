/**
 * Auth Context - User authentication & multi-tenancy
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  AGENT: 'agent',
  VIEWER: 'viewer',
};

const PERMISSIONS = {
  admin: ['read', 'write', 'delete', 'manage_users', 'manage_workspace', 'view_billing'],
  manager: ['read', 'write', 'view_billing'],
  agent: ['read', 'write'],
  viewer: ['read'],
};

function decodeJWT(token) {
  try {
    const base64 = token.split('.')[1];
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [workspace, setWorkspace] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const hasPermission = useCallback((permission) => {
    if (!user) return false;
    const perms = PERMISSIONS[user.role] || [];
    return perms.includes(permission);
  }, [user]);

  const login = useCallback(async (email, password) => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'https://aicity-backend-deploy.vercel.app';
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Login failed');
      }

      const data = await response.json();
      // Backend returns { access_token, refresh_token, user }
      const token = data.access_token || data.token;
      if (!token) throw new Error('No token received');

      const userData = data.user || {};
      const decoded = decodeJWT(token);

      setToken(token);
      setUser({
        id: userData.id || decoded?.user_id,
        email: userData.email || decoded?.email,
        name: userData.name || decoded?.name || email,
        role: userData.role || decoded?.role || 'viewer',
        workspaceId: userData.workspace_id || decoded?.workspace_id,
      });
      setWorkspace({ id: userData.workspace_id || decoded?.workspace_id, name: userData.workspace_name || decoded?.workspace_name });
      localStorage.setItem('token', token);
      if (data.refresh_token) localStorage.setItem('refresh_token', data.refresh_token);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  const register = useCallback(async (name, email, password, workspaceName) => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'https://aicity-backend-deploy.vercel.app';
      const response = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, workspace_name: workspaceName }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Registration failed');
      }

      const data = await response.json();
      // Backend returns { access_token, refresh_token, user }
      const token = data.access_token || data.token;
      if (!token) throw new Error('No token received');

      const userData = data.user || {};
      const decoded = decodeJWT(token);

      setToken(token);
      setUser({
        id: userData.id || decoded?.user_id,
        email: userData.email || decoded?.email,
        name: userData.name || name,
        role: userData.role || 'admin',
        workspaceId: userData.workspace_id || decoded?.workspace_id,
      });
      setWorkspace({ id: userData.workspace_id || decoded?.workspace_id, name: workspaceName || userData.workspace_name });
      localStorage.setItem('token', token);
      if (data.refresh_token) localStorage.setItem('refresh_token', data.refresh_token);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setWorkspace(null);
    setToken(null);
    localStorage.removeItem('token');
  }, []);

  const switchWorkspace = useCallback((workspaceId) => {
    if (user) {
      setUser(prev => ({ ...prev, workspaceId }));
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      const decoded = decodeJWT(token);
      if (decoded) {
        setUser({
          id: decoded.sub || decoded.user_id,
          email: decoded.email,
          name: decoded.name,
          role: decoded.role || 'viewer',
          workspaceId: decoded.workspace_id,
        });
        setWorkspace({ id: decoded.workspace_id, name: decoded.workspace_name });
      } else {
        localStorage.removeItem('token');
        setToken(null);
      }
    }
    setLoading(false);
  }, [token]);

  const value = {
    user,
    workspace,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    hasPermission,
    switchWorkspace,
    ROLES,
    PERMISSIONS,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export { ROLES, PERMISSIONS };
export default AuthContext;
