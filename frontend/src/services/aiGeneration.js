/**
 * AI Generation Service
 * Client-side AI text generation using Hugging Face Inference API
 * Falls back to template-based generation when API is unavailable
 */

const HF_API_URL = 'https://api-inference.huggingface.co/models/gpt2';
const HF_TOKEN = import.meta.env.VITE_HF_TOKEN || '';

// Templates for when API is unavailable
const CONTENT_TEMPLATES = {
  'blog-post': `## Bài Viết Blog: Tự Động Hóa AI Cho Doanh Nghiệp Việt Nam 2026

*Thời gian đọc: 5 phút*

### Giới Thiệu

Trong bối cảnh chuyển đổi số đang diễn ra mạnh mẽ tại Việt Nam, AI automation không còn là khái niệm xa lạ. Các doanh nghiệp từ startup đến tập đoàn lớn đang áp dụng AI agent để tăng năng suất và giảm chi phí vận hành.

### 3 Lợi Ích Chính Của AI Agent

**1. Tiết Kiệm Thời Gian**
AI agent có thể xử lý các tác vụ lặp đi lặp lại 24/7. Ví dụ: trả lời khách hàng, nhập liệu, tạo báo cáo — tất cả đều được tự động hóa.

**2. Giảm Chi Phí Vận Hành**
Theo nghiên cứu của McKinsey, doanh nghiệp áp dụng AI automation giảm 40% chi phí vận hành trong năm đầu tiên.

**3. Tăng Độ Chính Xác**
Tỷ lệ lỗi nhân sự có thể lên đến 3-5%. AI agent giảm con số này xuống dưới 0.5%.

### Kết Luận

AI workforce platform như AI City giúp doanh nghiệp Việt Nam nhanh chóng bắt kịp xu hướng toàn cầu. Đăng ký demo hôm nay để trải nghiệm.

---
*#AIAutomation #DigitalTransformation #Vietnam*`,

  'ad-copy': `## 3 Biến Thể Quảng Cáo Facebook

**Biến thể 1 - Tập trung vào ROI:**
🤖 AI Agent làm việc 24/7 — bạn không cần!
Tiết kiệm 40 giờ/tháng. Dùng thử miễn phí 14 ngày.
👉 aicity.com

**Biến thể 2 - Pain Point:**
Nhân viên của bạn đang làm những việc lặp đi lặp lại?
AI City tự động hóa quy trình, giúp team tập trung vào công việc quan trọng.
🔗 Đăng ký demo: aicity.com

**Biến thể 3 - Social Proof:**
500+ doanh nghiệp Việt đang dùng AI City.
Giảm 40% chi phí vận hành — Bạn là người tiếp theo?
✅ Dùng thử miễn phí tại: aicity.com`,

  'email-template': `## Mẫu Email Follow-up Bán Hàng

**Subject:** Thảo luận về AI Automation cho doanh nghiệp của bạn

Xin chào Anh/Chị,

Em là [Tên] từ AI City. Em liên hệ để follow up về giải pháp AI Workforce Platform.

**Giá trị cốt lõi:**
- ✅ Tiết kiệm 40 giờ/tháng nhờ tự động hóa
- ✅ 500+ doanh nghiệp Việt đang sử dụng
- ✅ Không cần đội ngũ kỹ thuật — setup trong 15 phút

**Bước tiếp theo:**
Chúng em muốn hẹn 15 phút để demo cá nhân hóa theo ngành của anh/chị. Tuần này bạn tiện lúc nào ạ?

Thân mến,
[Tên] | AI City
📞 0901.XXX.XXX`,

  'social-post': `🚀 5 xu hướng AI Agent thay đổi doanh nghiệp Việt 2026

1️⃣ **Customer Support Agent** — Trả lời 24/7, không cần nhân viên trực đêm
2️⃣ **Content Agent** — Tạo bài viết, quảng cáo tự động
3️⃣ **Data Entry Agent** — Nhập liệu chính xác 99.9%, không cần overtime
4️⃣ **Sales Agent** — Lead scoring, follow-up tự động
5️⃣ **Report Agent** — Tạo báo cáo hàng ngày trong 30 giây

Câu hỏi: Doanh nghiệp của bạn đang dùng AI agent nào?

👇 Comment để mình tư vấn riêng!`,

  'engagement-response': `## Mẫu Trả Lời Comment Mạng Xã Hội

**Khi khách hàng hỏi về giá:**
"Cảm ơn bạn đã quan tâm! AI City có 3 gói: Starter (990K/tháng), Professional (2.99M/tháng), Enterprise (9.99M/tháng). Mình có thể tư vấn gói phù hợp nếu bạn chia sẻ thêm về quy mô team ạ!"

**Khi nhận review tích cực:**
"Cảm ơn bạn rất nhiều! 🥰 Feedback của bạn là động lực để team chúng mình cải thiện mỗi ngày. Nếu cần hỗ trợ gì thêm, cứ nhắn cho mình nhé!"

**Khi nhận phản hồi tiêu cực:**
"Cảm ơn bạn đã phản hồi. Chúng mình rất tiếc về trải nghiệm này. Để mình chuyển case này cho đội ngũ support để giải quyết trong 24h. Bạn có thể nhắn tin riêng cho mình thông tin chi tiết không ạ?"`,

  'faq-response': `## Câu Hỏi Thường Gặp (FAQ)

**Q: AI City có miễn phí không?**
A: Có! Chúng tôi cung cấp gói Starter miễn phí với 50 credits/tháng. Các gói trả phí từ 990K VND/tháng với nhiều tính năng nâng cao.

**Q: Dữ liệu của tôi có bảo mật không?**
A: Tuyệt đối. Dữ liệu được mã hóa AES-256, lưu trữ tại Việt Nam, tuân thủ GDPR và các quy định bảo mật Việt Nam.

**Q: Tích hợp với công cụ hiện có được không?**
A: Có. AI City tích hợp sẵn với Slack, HubSpot, Zapier, và hơn 50+ ứng dụng phổ biến.

**Q: Làm sao hủy?**
A: Không có cam kết ràng buộc. Bạn có thể hủy bất kỳ lúc nào từ dashboard.`,

  'data-extraction': `## Data Extraction Report - Sample

**Invoice #INV-2024-001**
| Field | Value |
|-------|-------|
| Vendor | Công Ty ABC |
| Amount | 15,500,000 VND |
| Date | 2024-03-15 |
| Tax Code | 0123456789 |

**Extracted Fields:**
- vendor_name: "Công Ty TNHH ABC"
- invoice_number: "INV-2024-001"
- total_amount: 15500000
- currency: "VND"
- date: "2024-03-15"
- tax_code: "0123456789"
- line_items: [
    { description: "Dịch vụ tư vấn", quantity: 1, unit_price: 15500000 }
  ]

**Confidence Score:** 98.5%
**Processing Time:** 2.3s`,

  'form-auto': `## Form Auto-fill Report

**Target Form:** Lead Capture Form

**Field Mappings:**
| Form Field | Data Source | Value |
|------------|--------------|-------|
| Full Name | CRM Contact | "Nguyễn Văn Minh" |
| Email | CRM Contact | "minh.nguyen@company.vn" |
| Phone | CRM Contact | "0901234567" |
| Company | CRM Account | "Công Ty TNHH Minh Corp" |
| Industry | CRM Account | "Technology" |
| Employee Count | CRM Account | "51-200" |
| Interest | Lead Source | "AI Automation" |
| Budget | Qualifying Question | "2-5M VND/tháng" |

**Auto-fill Status:** ✅ 8/8 fields filled
**Review Required:** 0 fields`,

};

// Call HuggingFace API with fetch
async function callHuggingFace(prompt, maxTokens = 300) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  const headers = {
    'Content-Type': 'application/json',
  };
  if (HF_TOKEN) {
    headers['Authorization'] = `Bearer ${HF_TOKEN}`;
  }

  try {
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: maxTokens,
          temperature: 0.8,
          top_p: 0.9,
          return_full_text: false,
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`HF API error: ${response.status}`);
    }

    const data = await response.json();

    if (Array.isArray(data) && data[0]?.generated_text) {
      return data[0].generated_text;
    } else if (data.generated_text) {
      return data.generated_text;
    }

    throw new Error('Unexpected response format');
  } catch (err) {
    clearTimeout(timeout);
    if (err.name === 'AbortError') {
      throw new Error('Generation timed out');
    }
    throw err;
  }
}

// Main generation function
export async function generateContent(type, options = {}) {
  const { topic, tone, length } = options;

  // Build prompt from options
  let prompt;
  if (topic) {
    const toneText = tone ? `${tone} tone` : 'professional tone';
    const lengthText = length === 'long' ? 'Be detailed and comprehensive. Write at least 500 words.' :
                        length === 'short' ? 'Keep it brief and concise.' : '';
    prompt = `Write a ${toneText} ${type.replace('-', ' ')} in Vietnamese about: "${topic}". ${lengthText}

Write it now:`;
  } else {
    // Use default prompts based on type
    const defaultPrompts = {
      'blog-post': 'Write a professional blog post in Vietnamese about AI automation for Vietnamese businesses. Include introduction, 3 main sections, and conclusion. At least 400 words:',
      'ad-copy': 'Write 3 short Facebook ad copy variations in Vietnamese for an AI SaaS product. Each under 50 words with a CTA:',
      'email-template': 'Write a follow-up email template in Vietnamese for sales outreach. Professional tone, include intro, value proposition, and CTA. 200 words:',
      'social-post': 'Write an engaging LinkedIn post in Vietnamese about AI trends in 2026 for tech companies. Include hook and call-to-action. Under 300 words:',
      'engagement-response': 'Write 3 social media response templates in Vietnamese: 1) Thank positive comment, 2) Answer pricing question, 3) Handle negative feedback:',
      'faq-response': 'Write FAQ responses in Vietnamese for an AI SaaS product covering: pricing, free trial, data security, and cancellation policy:',
      'data-extraction': 'Describe a data extraction workflow for automating invoice processing with AI agents:',
      'form-auto': 'Write a form auto-fill workflow description for lead capture forms using AI agents in Vietnamese:',
    };
    prompt = defaultPrompts[type] || `Generate content for ${type} in Vietnamese:`;
  }

  try {
    const result = await callHuggingFace(prompt, length === 'long' ? 500 : 300);
    if (result && result.trim().length > 50) {
      return result.trim();
    }
  } catch (err) {
    console.warn('HuggingFace API unavailable, using template:', err.message);
  }

  // Fallback to template-based generation
  return CONTENT_TEMPLATES[type] || `Generated content for ${type}. ${topic || ''}`;
}

// Agent capabilities metadata
export const AGENT_CAPABILITIES = {
  'content-writer': {
    name: 'Content Writer',
    types: [
      { id: 'blog-post', label: 'Blog Post', icon: '📝' },
      { id: 'ad-copy', label: 'Ad Copy', icon: '📢' },
      { id: 'email-template', label: 'Email Template', icon: '📧' },
    ],
  },
  'social-media': {
    name: 'Social Media Manager',
    types: [
      { id: 'social-post', label: 'Social Post', icon: '📱' },
      { id: 'engagement-response', label: 'Response Templates', icon: '💬' },
    ],
  },
  'customer-support': {
    name: 'Customer Support',
    types: [
      { id: 'faq-response', label: 'FAQ Response', icon: '❓' },
    ],
  },
  'data-entry': {
    name: 'Data Entry Automation',
    types: [
      { id: 'data-extraction', label: 'Data Extraction', icon: '📊' },
      { id: 'form-auto', label: 'Form Auto-fill', icon: '📋' },
    ],
  },
};

export default {
  generateContent,
  AGENT_CAPABILITIES,
};
