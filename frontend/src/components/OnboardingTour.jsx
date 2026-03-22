/**
 * Onboarding Tour Component
 * Phase 8: AIC-804 - Interactive onboarding walkthrough
 */
import { useState, useEffect, useCallback } from 'react';
import './OnboardingTour.css';

const TOUR_STEPS = [
  {
    target: '[href="/dashboard"]',
    title: 'Welcome to AI City!',
    content: 'Start here to see your key metrics and business overview at a glance.',
    position: 'right',
  },
  {
    target: '[href="/leads"]',
    title: 'Manage Your Leads',
    content: 'Track and score leads, manage pipeline, and monitor conversion rates.',
    position: 'right',
  },
  {
    target: '[href="/agents"]',
    title: 'AI Agents Dashboard',
    content: 'Monitor and configure your AI agents. Track usage, logs, and run history.',
    position: 'right',
  },
  {
    target: '[href="/globe"]',
    title: 'Global Agent Visualization',
    content: 'See your AI agents, task flows, and revenue data on an interactive globe.',
    position: 'left',
  },
  {
    target: '[href="/settings"]',
    title: 'Customize Your Experience',
    content: 'Set your preferences, theme, notifications, and API keys.',
    position: 'left',
  },
];

function OnboardingTour({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });

  const hasSeenTour = sessionStorage.getItem('aicity-tour-seen');

  const calculatePosition = useCallback((targetSelector) => {
    const el = document.querySelector(targetSelector);
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return {
      top: rect.top + rect.height / 2 + window.scrollY,
      left: rect.right + window.scrollX + 16,
      rect,
    };
  }, []);

  useEffect(() => {
    if (hasSeenTour) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [hasSeenTour]);

  useEffect(() => {
    if (!isVisible) return;

    const step = TOUR_STEPS[currentStep];
    if (!step) return;

    const updatePos = () => {
      const pos = calculatePosition(step.target);
      if (pos) setTooltipPos(pos);
    };

    updatePos();
    window.addEventListener('resize', updatePos);
    window.addEventListener('scroll', updatePos);

    return () => {
      window.removeEventListener('resize', updatePos);
      window.removeEventListener('scroll', updatePos);
    };
  }, [isVisible, currentStep, calculatePosition]);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    sessionStorage.setItem('aicity-tour-seen', 'true');
    setIsVisible(false);
    if (onComplete) onComplete();
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (!isVisible) return null;

  const step = TOUR_STEPS[currentStep];
  const progress = ((currentStep + 1) / TOUR_STEPS.length) * 100;

  return (
    <>
      {/* Spotlight overlay */}
      <div className="tour-overlay" onClick={handleSkip} />

      {/* Tooltip */}
      <div
        className={`tour-tooltip tour-${step?.position || 'right'}`}
        style={{
          top: tooltipPos.top,
          left: step?.position === 'left' ? tooltipPos.rect?.left + window.scrollX - 360 : tooltipPos.left,
        }}
        role="dialog"
        aria-label={`Onboarding step ${currentStep + 1} of ${TOUR_STEPS.length}`}
      >
        <div className="tour-header">
          <span className="tour-step">Step {currentStep + 1} of {TOUR_STEPS.length}</span>
          <button className="tour-close" onClick={handleSkip} aria-label="Skip tour">✕</button>
        </div>

        <div className="tour-progress">
          <div className="tour-progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <h3 className="tour-title">{step?.title}</h3>
        <p className="tour-content">{step?.content}</p>

        <div className="tour-dots">
          {TOUR_STEPS.map((_, i) => (
            <span key={i} className={`tour-dot ${i === currentStep ? 'active' : ''}`} />
          ))}
        </div>

        <div className="tour-actions">
          {currentStep > 0 && (
            <button className="tour-btn tour-btn-secondary" onClick={handlePrev}>
              Previous
            </button>
          )}
          <button className="tour-btn tour-btn-primary" onClick={handleNext}>
            {currentStep < TOUR_STEPS.length - 1 ? 'Next' : 'Get Started'}
          </button>
        </div>
      </div>
    </>
  );
}

export { OnboardingTour };
