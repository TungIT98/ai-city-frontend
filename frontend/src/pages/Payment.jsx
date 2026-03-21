/**
 * Payment Page - VietQR Payment
 * Phase 12: VietQR payment integration for AI City
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, Copy, Clock, AlertCircle } from 'lucide-react';
import './Payment.css';

const BANK_ID = 'TCB'; // Techcombank
const ACCOUNT_NO = '1903777779';
const ACCOUNT_NAME = 'TRAN THANH TUNG';
const AMOUNT_DEFAULT = 990000; // VND - 990K/month subscription

const QR_IMAGE_URL = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact.png?amount=${AMOUNT_DEFAULT}&addInfo=AI+City+Subscription&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

export default function Payment() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('starter');
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [amount, setAmount] = useState(AMOUNT_DEFAULT);

  const plans = [
    { id: 'starter', name: 'Starter', price: '990,000', features: ['5 leads/month', 'Basic analytics', 'Email support'] },
    { id: 'pro', name: 'Pro', price: '2,990,000', features: ['50 leads/month', 'Advanced analytics', 'Priority support', 'API access'] },
    { id: 'enterprise', name: 'Enterprise', price: '9,990,000', features: ['Unlimited leads', 'Custom analytics', '24/7 support', 'API access', 'Dedicated manager'] },
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedPlanData = plans.find(p => p.id === selectedPlan) || plans[0];
  const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact.png?amount=${amount}&addInfo=AI+City+Subscription&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

  const handleConfirmPayment = () => {
    setPaymentConfirmed(true);
  };

  const handleContinue = () => {
    navigate('/dashboard');
  };

  if (paymentConfirmed) {
    return (
      <div className="payment-page">
        <div className="payment-success-card">
          <div className="success-icon">
            <CheckCircle size={64} color="#10b981" />
          </div>
          <h2>Payment Submitted!</h2>
          <p>Thank you for your payment. We will verify your transaction within 24 hours.</p>
          <div className="success-details">
            <div className="detail-row">
              <span>Amount:</span>
              <strong>{amount.toLocaleString('vi-VN')} VND</strong>
            </div>
            <div className="detail-row">
              <span>Plan:</span>
              <strong>{selectedPlanData.name}</strong>
            </div>
            <div className="detail-row">
              <span>Account:</span>
              <strong>{ACCOUNT_NO}</strong>
            </div>
            <div className="detail-row">
              <span>Reference:</span>
              <strong>AI City Subscription</strong>
            </div>
          </div>
          <div className="success-note">
            <Clock size={16} />
            <span>Verification typically takes 1-24 hours. You will receive an email confirmation.</span>
          </div>
          <button className="btn-primary" onClick={handleContinue}>
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-header">
        <h2>Subscribe to AI City</h2>
        <p>Choose your plan and pay with VietQR</p>
      </div>

      <div className="payment-content">
        {/* Plan selection */}
        <div className="plans-section">
          <h3>Select Plan</h3>
          <div className="plans-grid">
            {plans.map(plan => (
              <div
                key={plan.id}
                className={`plan-card ${selectedPlan === plan.id ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedPlan(plan.id);
                  setAmount(parseInt(plan.price.replace(/,/g, '')));
                }}
              >
                <div className="plan-header">
                  <h4>{plan.name}</h4>
                  <div className="plan-price">
                    <span className="currency">₫</span>
                    <span className="amount">{plan.price}</span>
                    <span className="period">/tháng</span>
                  </div>
                </div>
                <ul className="plan-features">
                  {plan.features.map((f, i) => (
                    <li key={i}>✓ {f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* QR Code */}
        <div className="qr-section">
          <div className="qr-card">
            <h3>Scan to Pay</h3>
            <div className="qr-amount">
              <span className="qr-label">Amount</span>
              <span className="qr-value">{amount.toLocaleString('vi-VN')} VND</span>
            </div>
            <div className="qr-image-wrapper">
              <img
                src={qrUrl}
                alt={`VietQR payment for ${amount.toLocaleString('vi-VN')} VND`}
                className="qr-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="qr-fallback" style={{ display: 'none' }}>
                <AlertCircle size={32} color="#ef4444" />
                <p>QR code unavailable</p>
                <p className="qr-fallback-hint">Use bank details below</p>
              </div>
            </div>
            <div className="qr-note">
              <Clock size={14} />
              <span>Open with any banking app to scan</span>
            </div>
          </div>

          {/* Bank details */}
          <div className="bank-card">
            <h3>Bank Transfer Details</h3>
            <div className="bank-detail-grid">
              <div className="bank-detail-row">
                <span className="label">Bank</span>
                <span className="value">Techcombank</span>
              </div>
              <div className="bank-detail-row">
                <span className="label">Account No.</span>
                <div className="copy-value">
                  <span className="value mono">{ACCOUNT_NO}</span>
                  <button className="copy-btn" onClick={() => copyToClipboard(ACCOUNT_NO)} title="Copy">
                    <Copy size={14} />
                    {copied && <span className="copied-badge">Copied!</span>}
                  </button>
                </div>
              </div>
              <div className="bank-detail-row">
                <span className="label">Account Name</span>
                <span className="value">{ACCOUNT_NAME}</span>
              </div>
              <div className="bank-detail-row">
                <span className="label">Amount</span>
                <div className="copy-value">
                  <span className="value mono">{amount.toLocaleString('vi-VN')} VND</span>
                  <button className="copy-btn" onClick={() => copyToClipboard(amount.toString())} title="Copy">
                    <Copy size={14} />
                  </button>
                </div>
              </div>
              <div className="bank-detail-row">
                <span className="label">Reference</span>
                <span className="value">AI City Subscription</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <button className="btn-primary confirm-btn" onClick={handleConfirmPayment}>
            I've Made the Payment
          </button>
          <p className="confirm-note">
            By clicking above, you confirm that you have completed the bank transfer.
            Our team will verify your payment within 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
}
