/**
 * Privacy Policy Page
 */
import './Landing.css';

function Privacy() {
  return (
    <div className="landing-container">
      <div className="landing-content" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <h1>Privacy Policy</h1>
        <p><strong>Last updated:</strong> March 28, 2026</p>
        
        <h2>1. Information We Collect</h2>
        <p>We may collect the following information:</p>
        <ul>
          <li>Account information (email, username)</li>
          <li>Video content created using our Service</li>
          <li>Usage data and analytics</li>
        </ul>
        
        <h2>2. How We Use Information</h2>
        <p>We use collected information to:</p>
        <ul>
          <li>Provide and maintain our Service</li>
          <li>Generate and publish video content on your behalf</li>
          <li>Improve our services</li>
        </ul>
        
        <h2>3. Data Sharing</h2>
        <p>We share your content with third-party platforms (YouTube, TikTok) only as necessary to provide the publishing services you request.</p>
        
        <h2>4. Data Security</h2>
        <p>We implement reasonable security measures to protect your personal information.</p>
        
        <h2>5. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Request deletion of your account data</li>
          <li>Opt out of certain data collection</li>
        </ul>
        
        <h2>6. Contact</h2>
        <p>For privacy-related questions, contact: <a href="mailto:thanhtungtran364@gmail.com">thanhtungtran364@gmail.com</a></p>
      </div>
    </div>
  );
}

export default Privacy;
