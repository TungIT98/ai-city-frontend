/**
 * Agent Marketplace Landing Page
 * Landing page for AI Telesales Agent Marketplace
 */
import { Link } from 'react-router-dom';
import './AgentMarketplace.css';

function AgentMarketplace() {
  const handleStartTrial = () => {
    window.location.href = '/onboarding';
  };

  const handleDemo = () => {
    window.location.href = '/dashboard';
  };

  const agents = [
    {
      id: 1,
      name: 'Sales Champion Pro',
      description: 'Advanced sales agent with NLP and intent detection',
      price: '2,990,000',
      rating: 4.9,
      reviews: 127,
      icon: '🎯'
    },
    {
      id: 2,
      name: 'Customer Support Bot',
      description: '24/7 customer support with FAQ knowledge base',
      price: '1,990,000',
      rating: 4.8,
      reviews: 89,
      icon: '💬'
    },
    {
      id: 3,
      name: 'Lead Qualifier AI',
      description: 'Automated lead scoring and qualification',
      price: '2,490,000',
      rating: 4.7,
      reviews: 64,
      icon: '🔍'
    },
    {
      id: 4,
      name: 'Appointment Scheduler',
      description: 'Smart scheduling with calendar integration',
      price: '1,490,000',
      rating: 4.9,
      reviews: 156,
      icon: '📅'
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Nguyen Van A',
      company: 'TechCorp Vietnam',
      avatar: 'A',
      rating: 5,
      quote: 'AI Telesales increased our lead conversion by 45% in just 2 months. The Vietnamese language support is excellent!',
      role: 'Head of Sales'
    },
    {
      id: 2,
      name: 'Tran Thi B',
      company: 'StartupHub',
      avatar: 'T',
      rating: 5,
      quote: 'We reduced customer support costs by 60% while improving response time. Game changer!',
      role: 'CEO'
    },
    {
      id: 3,
      name: 'Le Van C',
      company: 'EcomVietnam',
      avatar: 'L',
      rating: 4,
      quote: 'The lead qualifier AI helped us identify high-quality leads faster. Our sales team is more productive now.',
      role: 'Sales Manager'
    }
  ];

  const faqs = [
    {
      question: 'How does the pay-as-you-go pricing work?',
      answer: 'You only pay for the minutes your agents are active. No monthly subscription required. Perfect for seasonal businesses.'
    },
    {
      question: 'Can I switch between plans?',
      answer: 'Yes! You can upgrade or downgrade your plan anytime. Changes take effect on the next billing cycle.'
    },
    {
      question: 'Do you offer a free trial?',
      answer: 'Yes, we offer a 14-day free trial with full access to all features. No credit card required.'
    },
    {
      question: 'Is Vietnamese language supported?',
      answer: 'Absolutely! Our AI models are optimized for Vietnamese language with >95% accuracy.'
    }
  ];

  return (
    <div className="agent-marketplace">
      {/* Navigation */}
      <nav className="marketplace-nav">
        <div className="nav-container">
          <Link to="/" className="nav-logo">🤖 AI City</Link>
          <div className="nav-links">
            <a href="#agents">Agents</a>
            <a href="#pricing">Pricing</a>
            <a href="#testimonials">Reviews</a>
            <a href="#faq">FAQ</a>
          </div>
          <div className="nav-buttons">
            <button className="btn btn-ghost" onClick={handleDemo}>Demo</button>
            <button className="btn btn-primary" onClick={handleStartTrial}>Start Free</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-telesales">
        <div className="hero-container">
          <div className="hero-text">
            <span className="hero-badge">🚀 New: AI Telesales Launch</span>
            <h1>Hire AI Agents That Sell 24/7</h1>
            <p className="hero-subtitle">
              Transform your sales with intelligent AI agents. Vietnamese-native voice,
              instant response, unlimited scalability.
            </p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-value">45%</span>
                <span className="stat-label">Avg. Conversion Lift</span>
              </div>
              <div className="stat">
                <span className="stat-value">24/7</span>
                <span className="stat-label">Active Hours</span>
              </div>
              <div className="stat">
                <span className="stat-value">95%</span>
                <span className="stat-label">Vietnamese Accuracy</span>
              </div>
            </div>
            <div className="hero-buttons">
              <button className="btn btn-primary btn-large" onClick={handleStartTrial}>
                Start Free Trial
              </button>
              <button className="btn btn-secondary btn-large" onClick={handleDemo}>
                Watch Demo →
              </button>
            </div>
            <p className="hero-note">No credit card required • 14-day free trial</p>
          </div>
          <div className="hero-video">
            <div className="video-placeholder">
              <div className="video-icon">▶</div>
              <p>Watch AI Telesales Demo (30s)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="section-container">
          <h2>Why Choose AI Telesales?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">🗣️</div>
              <h3>Native Vietnamese</h3>
              <p>AI trained specifically for Vietnamese accent and context</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">⚡</div>
              <h3>Instant Response</h3>
              <p>No wait time. Handle unlimited calls simultaneously</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🧠</div>
              <h3>Smart Qualification</h3>
              <p>AI identifies and scores leads based on buying signals</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">📊</div>
              <h3>Real-time Analytics</h3>
              <p>Track performance, conversion rates, and ROI instantly</p>
            </div>
          </div>
        </div>
      </section>

      {/* Agents Section */}
      <section className="agents-section" id="agents">
        <div className="section-container">
          <h2>Pre-built AI Agents</h2>
          <p className="section-subtitle">Choose from our curated selection of specialized agents</p>
          <div className="agents-grid">
            {agents.map(agent => (
              <div key={agent.id} className="agent-card">
                <div className="agent-icon">{agent.icon}</div>
                <h3>{agent.name}</h3>
                <p className="agent-desc">{agent.description}</p>
                <div className="agent-rating">
                  <span className="stars">{'★'.repeat(Math.floor(agent.rating))}</span>
                  <span>{agent.rating}</span>
                  <span className="reviews">({agent.reviews})</span>
                </div>
                <div className="agent-price">
                  <span className="price">{agent.price}</span>
                  <span className="currency">VND/tháng</span>
                </div>
                <button className="btn btn-primary">Hire Now</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section" id="pricing">
        <div className="section-container">
          <h2>Flexible Pricing</h2>
          <p className="section-subtitle">Choose the plan that fits your business</p>
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-header">
                <h3>Pay-as-you-go</h3>
                <div className="price">
                  <span className="price-amount">2,990,000</span>
                  <span className="price-currency">VND</span>
                </div>
                <p className="price-note">~$119/month base + usage</p>
              </div>
              <ul className="pricing-features">
                <li>✓ 1 Active Agent</li>
                <li>✓ 500 call minutes/month</li>
                <li>✓ Basic analytics</li>
                <li>✓ Email support</li>
              </ul>
              <button className="btn btn-secondary" onClick={handleStartTrial}>
                Start Free Trial
              </button>
            </div>

            <div className="pricing-card pricing-featured">
              <div className="pricing-badge">Best Value</div>
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
                <li>✓ 3 Active Agents</li>
                <li>✓ 2,000 call minutes/month</li>
                <li>✓ Advanced analytics</li>
                <li>✓ Priority support</li>
                <li>✓ CRM integration</li>
              </ul>
              <button className="btn btn-primary btn-large" onClick={handleStartTrial}>
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
                <li>✓ Unlimited Agents</li>
                <li>✓ Unlimited minutes</li>
                <li>✓ Custom training</li>
                <li>✓ 24/7 dedicated support</li>
                <li>✓ SLA guarantee</li>
              </ul>
              <button className="btn btn-secondary" onClick={handleStartTrial}>
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section" id="testimonials">
        <div className="section-container">
          <h2>What Beta Users Say</h2>
          <div className="testimonials-grid">
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="testimonial-header">
                  <div className="testimonial-avatar">{testimonial.avatar}</div>
                  <div>
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
                <div className="testimonial-rating">
                  {'★'.repeat(testimonial.rating)}
                </div>
                <p className="testimonial-quote">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo/Trial Signup Section */}
      <section className="signup-section">
        <div className="section-container">
          <div className="signup-content">
            <h2>Ready to Transform Your Sales?</h2>
            <p>Start your free trial today. No credit card required.</p>
            <div className="signup-form">
              <input type="email" placeholder="Enter your work email" />
              <button className="btn btn-primary btn-large">Get Started Free</button>
            </div>
            <p className="signup-note">14-day free trial • No credit card • Cancel anytime</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section" id="faq">
        <div className="section-container">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="marketplace-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <h4>🤖 AI City</h4>
            <p>AI Agents for Vietnamese Businesses</p>
          </div>
          <div className="footer-links">
            <div>
              <h5>Product</h5>
              <a href="#pricing">Pricing</a>
              <a href="#agents">Agents</a>
              <a href="#faq">FAQ</a>
            </div>
            <div>
              <h5>Company</h5>
              <a href="mailto:contact@ai-city.dev">Contact</a>
              <a href="#">About</a>
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

export default AgentMarketplace;