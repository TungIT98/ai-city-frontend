/**
 * AI City Landing Page
 * Main marketing page with product info, features, and pricing
 */
import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Landing.css';

function Landing() {
  const handleGetStarted = () => {
    window.location.href = '/onboarding';
  };

  const handleContactSales = () => {
    window.location.href = 'mailto:contact@ai-city.dev';
  };

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    employees: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState('idle'); // idle | submitting | success | error

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    try {
      const res = await fetch('https://formspree.io/f/xwpkzvgj', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormStatus('success');
        setFormData({ name: '', company: '', email: '', phone: '', employees: '', message: '' });
      } else {
        setFormStatus('error');
      }
    } catch {
      setFormStatus('error');
    }
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(`Hi AI City, I would like to book a demo.\n\nName: ${formData.name}\nCompany: ${formData.company}\nEmail: ${formData.email}\nPhone: ${formData.phone}`);
    window.open(`https://wa.me/84912345678?text=${msg}`, '_blank');
  };

  return (
    <div className="landing">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-brand">
          <h1>AI City</h1>
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#book-demo">Book Demo</a>
          <Link to="/login" className="nav-btn nav-btn-secondary">Login</Link>
          <Link to="/signup" className="nav-btn nav-btn-primary">Register</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>AI City - Self-Hosted AI Platform for Vietnamese Businesses</h1>
          <p className="hero-subtitle">
            Enterprise-grade AI infrastructure. Complete data sovereignty. Local deployment.
          </p>
          <div className="hero-buttons">
            <Link to="/signup" className="btn btn-primary btn-large">
              Get Started Free
            </Link>
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

      {/* Book a Demo Section */}
      <section className="book-demo" id="book-demo">
        <div className="book-demo-container">
          <div className="book-demo-info">
            <h2>Book a Free Demo</h2>
            <p className="section-subtitle">
              See AI City in action. Our team will set up a personalized demo tailored to your business needs.
            </p>
            <ul className="book-demo-benefits">
              <li>✓ Personalized 30-minute walkthrough</li>
              <li>✓ Custom integration consultation</li>
              <li>✓ ROI analysis for your use case</li>
              <li>✓ No commitment required</li>
            </ul>
          </div>
          <div className="book-demo-form-wrapper">
            {formStatus === 'success' ? (
              <div className="form-success">
                <div className="success-icon">✓</div>
                <h3>Thank you!</h3>
                <p>We've received your demo request. Our team will contact you within 24 hours.</p>
                <button className="btn btn-primary" onClick={() => setFormStatus('idle')}>
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form className="book-demo-form" onSubmit={handleFormSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      placeholder="Nguyễn Văn A"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="company">Company *</label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleFormChange}
                      placeholder="Công ty ABC"
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      placeholder="contact@company.com"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      placeholder="0xx xxx xxxx"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="employees">Number of Employees</label>
                  <select
                    id="employees"
                    name="employees"
                    value={formData.employees}
                    onChange={handleFormChange}
                  >
                    <option value="">Select range</option>
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-200">51-200</option>
                    <option value="201-500">201-500</option>
                    <option value="500+">500+</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message (optional)</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    placeholder="Tell us about your AI needs..."
                    rows={3}
                  />
                </div>
                {formStatus === 'error' && (
                  <p className="form-error">Something went wrong. Please try again or contact us directly.</p>
                )}
                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn btn-primary btn-large"
                    disabled={formStatus === 'submitting'}
                  >
                    {formStatus === 'submitting' ? 'Sending...' : 'Book Demo'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-whatsapp"
                    onClick={handleWhatsApp}
                  >
                    <span>📱</span> Chat on WhatsApp
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <h2>Ready to Get Started?</h2>
        <p>Join Vietnamese businesses already using AI City to power their AI infrastructure.</p>
        <div className="cta-buttons">
          <Link to="/signup" className="btn btn-primary btn-large">
            Get Started Free
          </Link>
          <Link to="/login" className="btn btn-link">
            Already have an account? Login →
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
              <a href="#book-demo">Book Demo</a>
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
