/**
 * AI City Landing Page
 * Main marketing page with product info, features, and pricing
 */
import { Link } from 'react-router-dom';
import './Landing.css';

function Landing() {
  const handleGetStarted = () => {
    window.location.href = '/onboarding';
  };

  const handleContactSales = () => {
    window.location.href = 'mailto:contact@ai-city.dev';
  };

  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>AI City - Self-Hosted AI Platform for Vietnamese Businesses</h1>
          <p className="hero-subtitle">
            Enterprise-grade AI infrastructure. Complete data sovereignty. Local deployment.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary btn-large" onClick={handleGetStarted}>
              Get Started Free
            </button>
            <button className="btn btn-secondary btn-large" onClick={handleContactSales}>
              Contact Sales
            </button>
          </div>
          <p className="hero-note">No credit card required • 14-day free trial</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Powerful AI Infrastructure</h2>
        <p className="section-subtitle">
          Everything you need to deploy and manage AI agents in your own infrastructure
        </p>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Model Serving</h3>
            <p>Deploy and run LLMs locally with Ollama. Full control over your AI models and data.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Vector Database</h3>
            <p>Store and search embeddings with Qdrant. Build RAG applications with ease.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Workflow Automation</h3>
            <p>Automate business processes with n8n. Connect AI to your existing tools.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Analytics</h3>
            <p>Privacy-first analytics with Matomo. Understand your users without compromising privacy.</p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits">
        <h2>Why Choose AI City?</h2>
        <div className="benefits-list">
          <div className="benefit-item">
            <span className="benefit-check">✓</span>
            <div>
              <h3>Data Sovereignty</h3>
              <p>All data stays in Vietnam. Full compliance with local data protection regulations.</p>
            </div>
          </div>
          <div className="benefit-item">
            <span className="benefit-check">✓</span>
            <div>
              <h3>Cost Effective</h3>
              <p>40-60% cheaper than cloud alternatives. Pay for what you use.</p>
            </div>
          </div>
          <div className="benefit-item">
            <span className="benefit-check">✓</span>
            <div>
              <h3>Local Support</h3>
              <p>Vietnamese-language support. Understanding of local business needs.</p>
            </div>
          </div>
          <div className="benefit-item">
            <span className="benefit-check">✓</span>
            <div>
              <h3>Easy Integration</h3>
              <p>Connect to existing systems via API. Minimal setup time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing" id="pricing">
        <h2>Simple, Transparent Pricing</h2>
        <p className="section-subtitle">Choose the plan that fits your needs</p>
        <div className="pricing-grid">
          <div className="pricing-card">
            <div className="pricing-header">
              <h3>Starter</h3>
              <div className="price">
                <span className="price-amount">2,990,000</span>
                <span className="price-currency">VND</span>
                <span className="price-period">/month</span>
              </div>
              <p className="price-note">~$119/month</p>
            </div>
            <ul className="pricing-features">
              <li>✓ 1 AI model instance</li>
              <li>✓ 10GB vector storage</li>
              <li>✓ 5 automated workflows</li>
              <li>✓ 50K analytics events</li>
              <li>✓ Community support</li>
            </ul>
            <button className="btn btn-primary" onClick={handleGetStarted}>
              Start Free Trial
            </button>
          </div>

          <div className="pricing-card pricing-featured">
            <div className="pricing-badge">Most Popular</div>
            <div className="pricing-header">
              <h3>Professional</h3>
              <div className="price">
                <span className="price-amount">7,990,000</span>
                <span className="price-currency">VND</span>
                <span className="price-period">/month</span>
              </div>
              <p className="price-note">~$319/month</p>
            </div>
            <ul className="pricing-features">
              <li>✓ 3 AI model instances</li>
              <li>✓ 50GB vector storage</li>
              <li>✓ 25 automated workflows</li>
              <li>✓ 500K analytics events</li>
              <li>✓ Priority support</li>
              <li>✓ API access</li>
            </ul>
            <button className="btn btn-primary btn-large" onClick={handleGetStarted}>
              Start Free Trial
            </button>
          </div>

          <div className="pricing-card">
            <div className="pricing-header">
              <h3>Enterprise</h3>
              <div className="price">
                <span className="price-amount">19,990,000</span>
                <span className="price-currency">VND</span>
                <span className="price-period">/month</span>
              </div>
              <p className="price-note">~$799/month</p>
            </div>
            <ul className="pricing-features">
              <li>✓ Unlimited AI instances</li>
              <li>✓ 200GB vector storage</li>
              <li>✓ Unlimited workflows</li>
              <li>✓ Unlimited analytics</li>
              <li>✓ 24/7 dedicated support</li>
              <li>✓ Custom integrations</li>
              <li>✓ SLA guarantee</li>
            </ul>
            <button className="btn btn-secondary" onClick={handleContactSales}>
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <h2>Ready to Get Started?</h2>
        <p>Join Vietnamese businesses already using AI City to power their AI infrastructure.</p>
        <div className="cta-buttons">
          <button className="btn btn-primary btn-large" onClick={handleGetStarted}>
            Start Your Free Trial
          </button>
          <Link to="/dashboard" className="btn btn-link">
            View Demo Dashboard →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h4>AI City</h4>
            <p>Self-hosted AI platform for Vietnamese businesses.</p>
          </div>
          <div className="footer-links">
            <div>
              <h5>Product</h5>
              <a href="#pricing">Pricing</a>
              <a href="/dashboard">Dashboard Demo</a>
              <a href="/onboarding">Get Started</a>
            </div>
            <div>
              <h5>Company</h5>
              <a href="mailto:contact@ai-city.dev">Contact</a>
              <a href="#">About Us</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 AI City. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
