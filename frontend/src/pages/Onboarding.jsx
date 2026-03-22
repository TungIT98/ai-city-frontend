/**
 * Onboarding Page
 * Multi-step onboarding wizard for new customers
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    teamSize: '',
    primaryGoal: '',
    milestones: []
  });

  const steps = [
    {
      title: 'Welcome to AI City',
      description: 'Let\'s get you set up for success'
    },
    {
      title: 'Company Profile',
      description: 'Tell us about your business'
    },
    {
      title: 'Set Your Goals',
      description: 'Define your success metrics'
    },
    {
      title: 'Quick Tour',
      description: 'Learn the dashboard features'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMilestoneToggle = (milestone) => {
    setFormData(prev => {
      const milestones = prev.milestones.includes(milestone)
        ? prev.milestones.filter(m => m !== milestone)
        : [...prev.milestones, milestone];
      return { ...prev, milestones };
    });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = () => {
    // Store onboarding data (in real app, would save to backend)
    localStorage.setItem('onboardingComplete', 'true');
    localStorage.setItem('companyProfile', JSON.stringify(formData));
    navigate('/dashboard');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Welcome
        return (
          <div className="step-content welcome-step">
            <div className="welcome-icon">🚀</div>
            <h2>Welcome to AI City!</h2>
            <p>Your journey to AI-powered business growth starts here. We'll guide you through a quick setup to get you ready.</p>
            <ul className="welcome-list">
              <li>✓ Set up your company profile</li>
              <li>✓ Define your success goals</li>
              <li>✓ Learn the dashboard features</li>
            </ul>
            <button className="btn-primary" onClick={nextStep}>
              Get Started →
            </button>
          </div>
        );

      case 1: // Company Profile
        return (
          <div className="step-content profile-step">
            <h2>Company Profile</h2>
            <p>Help us understand your business better</p>

            <div className="form-group">
              <label htmlFor="companyName">Company Name</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                placeholder="Enter your company name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="industry">Industry</label>
              <select
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
              >
                <option value="">Select industry</option>
                <option value="tech">Technology</option>
                <option value="retail">Retail & E-commerce</option>
                <option value="services">Professional Services</option>
                <option value="finance">Finance & Banking</option>
                <option value="healthcare">Healthcare</option>
                <option value="education">Education</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="teamSize">Team Size</label>
              <select
                id="teamSize"
                name="teamSize"
                value={formData.teamSize}
                onChange={handleInputChange}
              >
                <option value="">Select team size</option>
                <option value="1-5">1-5 employees</option>
                <option value="6-20">6-20 employees</option>
                <option value="21-50">21-50 employees</option>
                <option value="51-100">51-100 employees</option>
                <option value="100+">100+ employees</option>
              </select>
            </div>

            <div className="button-group">
              <button className="btn-secondary" onClick={prevStep}>← Back</button>
              <button className="btn-primary" onClick={nextStep} disabled={!formData.companyName || !formData.industry}>
                Next →
              </button>
            </div>
          </div>
        );

      case 2: // Goals
        return (
          <div className="step-content goals-step">
            <h2>Set Your Goals</h2>
            <p>What do you want to achieve with AI City?</p>

            <div className="form-group">
              <label htmlFor="primaryGoal">Primary Goal</label>
              <select
                id="primaryGoal"
                name="primaryGoal"
                value={formData.primaryGoal}
                onChange={handleInputChange}
              >
                <option value="">Select your main goal</option>
                <option value="leads">Generate More Leads</option>
                <option value="conversion">Improve Conversion Rate</option>
                <option value="revenue">Increase Revenue</option>
                <option value="customers">Acquire Customers</option>
                <option value="analytics">Better Analytics</option>
              </select>
            </div>

            <div className="milestones-section">
              <label>Success Milestones (select at least one)</label>
              <div className="milestones-grid">
                {[
                  { id: 'first-lead', label: 'First Lead', icon: '🎯' },
                  { id: 'first-customer', label: 'First Customer', icon: '👤' },
                  { id: '10-customers', label: '10 Customers', icon: '🏆' },
                  { id: 'revenue-1m', label: 'VND 1M Revenue', icon: '💰' },
                  { id: '50-leads', label: '50 Leads', icon: '📊' },
                  { id: 'analytics-set', label: 'Analytics Setup', icon: '📈' }
                ].map(milestone => (
                  <button
                    key={milestone.id}
                    className={`milestone-card ${formData.milestones.includes(milestone.id) ? 'selected' : ''}`}
                    onClick={() => handleMilestoneToggle(milestone.id)}
                  >
                    <span className="milestone-icon">{milestone.icon}</span>
                    <span className="milestone-label">{milestone.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="button-group">
              <button className="btn-secondary" onClick={prevStep}>← Back</button>
              <button className="btn-primary" onClick={nextStep} disabled={!formData.primaryGoal || formData.milestones.length === 0}>
                Next →
              </button>
            </div>
          </div>
        );

      case 3: // Tutorial
        return (
          <div className="step-content tutorial-step">
            <h2>Quick Tour</h2>
            <p>Here's what you can do with AI City</p>

            <div className="tutorial-cards">
              <div className="tutorial-card">
                <div className="tutorial-icon">📊</div>
                <h3>Dashboard</h3>
                <p>View your key metrics, trends, and performance at a glance.</p>
              </div>
              <div className="tutorial-card">
                <div className="tutorial-icon">👥</div>
                <h3>Leads</h3>
                <p>Manage and track your potential customers through the sales funnel.</p>
              </div>
              <div className="tutorial-card">
                <div className="tutorial-icon">📈</div>
                <h3>Analytics</h3>
                <p>Dive deep into your data with detailed reports and insights.</p>
              </div>
              <div className="tutorial-card">
                <div className="tutorial-icon">📋</div>
                <h3>Reports</h3>
                <p>Generate weekly and monthly reports to track progress.</p>
              </div>
            </div>

            <div className="button-group">
              <button className="btn-secondary" onClick={prevStep}>← Back</button>
              <button className="btn-primary" onClick={completeOnboarding}>
                Complete Setup ✓
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <div className="progress-bar">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`progress-step ${index <= currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
            >
              <div className="step-number">{index < currentStep ? '✓' : index + 1}</div>
              <div className="step-title">{step.title}</div>
            </div>
          ))}
        </div>

        <div className="step-header">
          <h2>{steps[currentStep].title}</h2>
          <p>{steps[currentStep].description}</p>
        </div>

        {renderStepContent()}

        <div className="step-indicator">
          Step {currentStep + 1} of {steps.length}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;