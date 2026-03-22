import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, CreditCard, Shield, Zap, Users, TrendingUp, ArrowLeft } from 'lucide-react';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: '990,000',
    period: '/tháng',
    description: 'Dành cho cá nhân hoặc startup nhỏ',
    features: [
      'Dashboard cơ bản',
      '5 Agent AI',
      '100 leads/tháng',
      'Báo cáo cơ bản',
      'Hỗ trợ qua email',
    ],
    color: '#6366f1',
    popular: false,
  },
  {
    id: 'professional',
    name: 'Professional',
    price: '2,990,000',
    period: '/tháng',
    description: 'Dành cho doanh nghiệp vừa',
    features: [
      'Dashboard đầy đủ',
      '20 Agent AI',
      '500 leads/tháng',
      'Báo cáo nâng cao',
      'API access',
      'Hỗ trợ 24/7',
      'Tích hợp CRM',
    ],
    color: '#8b5cf6',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '9,990,000',
    period: '/tháng',
    description: 'Dành cho tập đoàn lớn',
    features: [
      'Tất cả tính năng Professional',
      'Không giới hạn Agent AI',
      'Không giới hạn leads',
      'Dashboard tùy chỉnh',
      'SSO & SAML',
      'Dedicated support',
      'SLA 99.9%',
      'Custom integrations',
    ],
    color: '#f59e0b',
    popular: false,
  },
];

const banks = [
  { id: 'tcb', name: 'Techcombank', logo: '🏦', account: '19071234567890', name_acc: 'AI CITY CORP' },
];

function QRCode({ amount, bank }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      textAlign: 'center',
      border: '2px solid #e5e7eb',
    }}>
      <div style={{
        width: '200px',
        height: '200px',
        margin: '0 auto 16px',
        background: '#f9fafb',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}>
        <span style={{ fontSize: '64px' }}>{bank.logo}</span>
        <span style={{ color: '#6b7280', fontSize: '12px', marginTop: '8px' }}>Quét QR</span>
      </div>
      <p style={{ color: '#374151', fontSize: '14px', marginBottom: '8px' }}>
        <strong>{bank.name}</strong>
      </p>
      <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px' }}>
        STK: <strong>{bank.account}</strong>
      </p>
      <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px' }}>
        TK: <strong>{bank.name_acc}</strong>
      </p>
      <p style={{ color: '#059669', fontSize: '20px', fontWeight: '700', marginTop: '12px' }}>
        {Number(amount).toLocaleString('vi-VN')} VND
      </p>
    </div>
  );
}

export default function Payment() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  const plan = plans.find(p => p.id === selectedPlan);
  const amount = plan ? parseInt(plan.price.replace(/,/g, '')) : 0;

  const copyAccount = () => {
    navigator.clipboard.writeText(banks[0].account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = () => {
    setShowQR(true);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'none',
              border: 'none',
              color: '#6b7280',
              cursor: 'pointer',
              fontSize: '14px',
              marginBottom: '16px',
            }}
          >
            <ArrowLeft size={16} /> Quay lại
          </button>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
            Chọn gói dịch vụ
          </h1>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>
            Chọn gói phù hợp với nhu cầu của bạn. Thanh toán qua QR VietQR.
          </p>
        </div>

        {/* Plan Cards */}
        {!showQR && (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
              marginBottom: '40px',
            }}>
              {plans.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPlan(p.id)}
                  style={{
                    background: selectedPlan === p.id ? '#fff' : '#fff',
                    border: selectedPlan === p.id ? `2px solid ${p.color}` : '2px solid #e5e7eb',
                    borderRadius: '16px',
                    padding: '24px',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.2s',
                    transform: selectedPlan === p.id ? 'scale(1.02)' : 'scale(1)',
                    boxShadow: selectedPlan === p.id ? `0 8px 30px ${p.color}20` : '0 2px 8px rgba(0,0,0,0.05)',
                  }}
                >
                  {p.popular && (
                    <div style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: p.color,
                      color: 'white',
                      padding: '4px 16px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}>
                      Phổ biến nhất
                    </div>
                  )}
                  <div style={{ marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
                      {p.name}
                    </h3>
                    <p style={{ color: '#6b7280', fontSize: '13px' }}>{p.description}</p>
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <span style={{ fontSize: '32px', fontWeight: '800', color: p.color }}>
                      {p.price}
                    </span>
                    <span style={{ color: '#6b7280', fontSize: '14px' }}>{p.period}</span>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {p.features.map((f, i) => (
                      <li key={i} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#374151',
                        fontSize: '13px',
                        marginBottom: '8px',
                      }}>
                        <Check size={14} style={{ color: p.color, flexShrink: 0 }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div style={{
                    marginTop: '16px',
                    paddingTop: '16px',
                    borderTop: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: `2px solid ${p.color}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: selectedPlan === p.id ? p.color : 'transparent',
                    }}>
                      {selectedPlan === p.id && (
                        <Check size={12} style={{ color: 'white' }} />
                      )}
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: selectedPlan === p.id ? p.color : '#6b7280' }}>
                      {selectedPlan === p.id ? 'Đã chọn' : 'Chọn gói này'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                  {plan?.name} - {Number(amount).toLocaleString('vi-VN')} VND/tháng
                </h3>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>
                  Thanh toán một lần mỗi tháng qua QR VietQR
                </p>
              </div>
              <button
                onClick={handleConfirm}
                style={{
                  background: plan?.color || '#6366f1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '14px 32px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <CreditCard size={18} />
                Thanh toán ngay
              </button>
            </div>
          </>
        )}

        {/* QR Payment */}
        {showQR && (
          <div>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '480px',
              margin: '0 auto',
              border: '1px solid #e5e7eb',
            }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: '#dbeafe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  <CreditCard size={28} style={{ color: '#3b82f6' }} />
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
                  Thanh toán qua QR
                </h2>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>
                  Quét mã QR bằng ứng dụng ngân hàng để thanh toán
                </p>
              </div>

              <QRCode amount={amount} bank={banks[0]} />

              <div style={{ marginTop: '20px' }}>
                <div style={{
                  background: '#fef3c7',
                  border: '1px solid #fcd34d',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  fontSize: '13px',
                  color: '#92400e',
                }}>
                  ⚠️ Vui lòng chuyển khoản đúng số tiền <strong>{Number(amount).toLocaleString('vi-VN')} VND</strong> để hệ thống tự động kích hoạt.
                </div>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setShowQR(false)}
                  style={{
                    flex: 1,
                    background: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                  }}
                >
                  ← Chọn gói khác
                </button>
                <button
                  onClick={copyAccount}
                  style={{
                    flex: 1,
                    background: copied ? '#10b981' : '#f3f4f6',
                    color: copied ? 'white' : '#374151',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                  }}
                >
                  {copied ? '✓ Đã copy!' : '📋 Copy số tài khoản'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Trust badges */}
        {!showQR && (
          <div style={{
            display: 'flex',
            gap: '32px',
            justifyContent: 'center',
            marginTop: '48px',
            flexWrap: 'wrap',
          }}>
            {[
              { icon: Shield, text: 'Thanh toán bảo mật 100%' },
              { icon: Zap, text: 'Kích hoạt tức thì' },
              { icon: Users, text: 'Hỗ trợ 24/7' },
              { icon: TrendingUp, text: 'Hoàn tiền trong 7 ngày' },
            ].map(({ icon: Icon, text }, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '14px' }}>
                <Icon size={16} />
                {text}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
