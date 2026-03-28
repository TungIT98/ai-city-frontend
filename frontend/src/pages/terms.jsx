/**
 * Terms of Service Page
 */
import './Landing.css';

function Terms() {
  return (
    <div className="landing-container">
      <div className="landing-content" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <h1>Terms of Service</h1>
        <p><strong>Last updated:</strong> March 28, 2026</p>
        
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing and using TKP ACI ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.</p>
        
        <h2>2. Description of Service</h2>
        <p>TKP ACI provides AI-powered video content creation and automatic publishing services to social media platforms including YouTube and TikTok.</p>
        
        <h2>3. User Obligations</h2>
        <p>Users agree to:</p>
        <ul>
          <li>Use the service in compliance with applicable laws</li>
          <li>Not use the service for any illegal or unauthorized purpose</li>
          <li>Not violate any intellectual property rights</li>
        </ul>
        
        <h2>4. Content Ownership</h2>
        <p>Users retain ownership of all content created using the Service. Users are responsible for ensuring their content does not infringe on third-party rights.</p>
        
        <h2>5. Limitation of Liability</h2>
        <p>The Service is provided "as is" without warranties of any kind. We are not liable for any damages arising from the use of this Service.</p>
        
        <h2>6. Contact</h2>
        <p>For questions regarding these Terms, contact: <a href="mailto:thanhtungtran364@gmail.com">thanhtungtran364@gmail.com</a></p>
      </div>
    </div>
  );
}

export default Terms;
