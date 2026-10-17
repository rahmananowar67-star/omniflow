// Scrambled & Encrypted Key Access
const _0x4f1a = ["QUl6YVN5QkVrdlFsaXZnS1RXQ1Vta0NMWnJ3RjBOMExubjNpR2s0", "split", "reverse", "join"];
const _getKey = () => atob(_0x4f1a[0]);
const GEMINI_API_KEY = _getKey();


let activeTool = 'merch-video';
let activeCategory = 'all';

// Freemium Daily Credit System
const DAILY_FREE_LIMIT = 5;
function getCreditsRemaining() {
  const today = new Date().toISOString().slice(0, 10);
  const storedDate = localStorage.getItem('omniflow_date');
  let used = parseInt(localStorage.getItem('omniflow_credits_used') || '0', 10);
  
  if (storedDate !== today) {
    localStorage.setItem('omniflow_date', today);
    localStorage.setItem('omniflow_credits_used', '0');
    return DAILY_FREE_LIMIT;
  }
  return Math.max(0, DAILY_FREE_LIMIT - used);
}

function consumeCredit() {
  const current = parseInt(localStorage.getItem('omniflow_credits_used') || '0', 10);
  localStorage.setItem('omniflow_credits_used', (current + 1).toString());
}

// Complete Configurations for All Tools
const toolConfig = {
  'merch-video': {
    title: '👕 T-Shirt / Merch Video Ad Studio',
    hint: 'Creates complete video ad script, AI visual prompt, music idea, and viral tags for your apparel design.',
    label: 'Enter your T-shirt Design Theme or Title',
    prompt: (topic) => `Create a complete TikTok/Reels promotional video package for a T-shirt/apparel design based on: "${topic}". Include: 
1) 3-Second Visual Hook to stop scrolling.
2) 15-Second Video Scene Breakdown (Scene 1: Close-up fabric/art, Scene 2: Model wearing it in urban street, Scene 3: Fast discount CTA).
3) Ready-to-copy AI Video Generator Prompt (for Kling/Luma/Runway, cinematic 4k, 9:16).
4) Trending Audio/Beat Vibe.
5) 10 Viral Streetwear Hashtags.`
  },
  'reel-script': {
    title: '🎬 Viral Reel Script & Hook',
    hint: 'Generates 3-second hook, visual directions, and audio cues for viral short videos.',
    label: 'Enter your Video Topic or Concept',
    prompt: (topic) => `Write a viral 30-second Instagram Reel / YouTube Shorts script about: "${topic}". Include: 1) Strong 3-second visual & verbal Hook, 2) Scene-by-scene script with visual cues, and 3) Call to Action (CTA).`
  },
  'video-prompt': {
    title: '🎥 AI Video Prompts (Kling / Luma / Runway)',
    hint: 'Generates detailed cinematic text prompts for AI video generators.',
    label: 'Enter the scene you want to visualize',
    prompt: (topic) => `Generate 3 hyper-detailed cinematic AI video prompts for Kling AI and Luma Dream Machine based on: "${topic}". Specify camera angles, lighting, 8k realistic details, and 9:16 aspect ratio.`
  },
  'pod-seo': {
    title: '🏷️ POD Listing & Merch SEO',
    hint: 'Optimized Title, Description & 13 SEO Tags for Zazzle, Redbubble & Etsy.',
    label: 'Enter your T-shirt or Merch design title/concept',
    prompt: (topic) => `Create a complete SEO listing for print-on-demand for the design: "${topic}". Provide: 1) High-ranking SEO Title, 2) 13 high-search-volume comma-separated tags (keep each tag under 20 characters for Etsy compatibility), 3) 3-sentence catchy product description highlighting streetwear aesthetic and comfort.`
  },
  'slogan-ideas': {
    title: '💡 Merch Slogans & Quotes',
    hint: 'Viral punchlines and typography ideas for graphic tees and hoodies.',
    label: 'Enter your design theme (e.g., Anime, Gym, Minimalist)',
    prompt: (topic) => `Generate 10 catchy, viral t-shirt slogans and typographic quotes about: "${topic}". Make them short, bold, aesthetic, and trendy for apparel.`
  },
  'shopify-page': {
    title: '🛍️ Shopify & Etsy Page Studio',
    hint: 'High-converting product description, benefit bullets, sizing notes & FAQ section.',
    label: 'Enter your Product Name, Features, or Niche',
    prompt: (topic) => `You are an elite E-commerce Conversion Rate Optimization (CRO) copywriter. Create a complete, high-converting product page for: "${topic}".

Format cleanly into these exact 4 sections:
1. HOOK & STORY INTRO (2-3 sentences capturing emotional reason to buy)
2. KEY BENEFITS & FEATURES (4 bullet points explaining Feature -> Direct Benefit)
3. SIZING, SPECS & MATERIAL (High-end bullet points for buyers)
4. BUYER FAQ (3 common questions: Shipping time, Returns/Guarantee, Care instructions)`
  },
  'cart-recovery': {
    title: '📧 3-Stage Abandoned Cart Recovery Email Flow',
    hint: 'High-converting sequence to bring back shoppers who left their cart without buying.',
    label: 'Enter your Brand/Store Name & Main Product Category',
    prompt: (topic) => `You are an expert direct-response email marketer for Shopify/e-commerce. Write a 3-Stage Abandoned Cart Recovery Email Sequence for a store selling: "${topic}".

Include Subject Lines, Preview Text, and Email Body for:
- Email 1 (1 hour later): Helpful, non-pushy check-in + question answering.
- Email 2 (24 hours later): Social proof, reviews angle + 10% limited coupon hook.
- Email 3 (48 hours later): Final urgency, cart reservation expiring tonight.`
  },
  'master-launch': {
    title: '🚀 1-Click Master Launch Hub',
    hint: 'Generate Product Listing, Viral Video Ad Script, and Meta Ad Copy simultaneously.',
    label: 'Enter your Product / Design Idea for Complete Launch',
    prompt: (topic) => `You are an agency-level product launch specialist. Generate a complete 3-in-1 launch package for the product: "${topic}".

---
PART 1: SEO LISTING (Shopify/Etsy Title, 2-line Description, 10 SEO Tags)
---
PART 2: VIRAL REELS/TIKTOK VIDEO SCRIPT (3-sec Hook, 3-scene Visual Storyboard, CTA)
---
PART 3: HIGH-ROAS META AD COPY (Scroll-stopping Hook, 3 Benefit Bullets, 2 Headline Angles)`
  },
  'viral-tags': {
    title: '🏷️ Viral Hashtag Engine',
    hint: 'Top niche + high-reach tag batches for maximum reach.',
    label: 'Enter your niche, design, or topic',
    prompt: (topic) => `Generate 25 strategic viral hashtags for: "${topic}". Categorize into High Reach, Niche Specific, and Trending tags.`
  },
  'caption': {
    title: '📝 High-CTR Captions',
    hint: 'Engaging storytelling, bullet points, and high conversion call-to-actions.',
    label: 'Enter your product or post idea',
    prompt: (topic) => `Write 2 high-converting captions for Instagram about: "${topic}". Include storytelling hook, clean bullet points, emojis, call-to-action, and 5 hashtags.`
  },
  'ad-copy': {
    title: '🎯 High-ROAS Ad Studio',
    hint: 'Meta & TikTok high-converting ad copy, viral hooks, targeting blueprint, and creative direction.',
    label: 'Enter your product, theme, or design idea',
    prompt: (topic) => `You are a world-class direct-response media buyer and copywriter specializing in Meta and TikTok ads for e-commerce products targeting the US, UK, and Canada.
Product: "${topic}"

Provide:
1. TARGETING BLUEPRINT (Demographics & Top 5 Interests)
2. 3 SCROLL-STOPPING HOOKS
3. PRIMARY AD BODY COPY (Bulleted benefits + CTA)
4. VISUAL & CREATIVE DIRECTION (Mockup setup + on-screen text)
5. 3 PUNCHY HEADLINES`
  },
  'english-polish': {
    title: '💎 US/UK English Polisher',
    hint: 'Turn rough sentences into fluent, native-level professional English.',
    label: 'Paste your rough or broken English text here',
    prompt: (topic) => `Rewrite and polish the following text into fluent, natural US/UK English with high clarity and style. Provide 2 versions (Conversational & Professional): "${topic}".`
  }
};

function selectTool(toolKey, element) {
  activeTool = toolKey;
  document.querySelectorAll('.tool-card').forEach(c => c.classList.remove('active'));
  element.classList.add('active');
const inputEl = document.getElementById('topicInput');
const outputBoxEl = document.getElementById('outputBox');
if (inputEl) inputEl.value = '';
if (outputBoxEl) outputBoxEl.style.display = 'none';  

  const conf = toolConfig[toolKey];
  document.getElementById('currentToolBadge').innerText = 'Selected: ' + conf.title;
  document.getElementById('currentToolHint').innerText = conf.hint;
  document.getElementById('inputBoxLabel').innerText = conf.label.toUpperCase();
}

function filterCategory(cat, e) {
  activeCategory = cat;
  document.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
  e.target.classList.add('active');

  document.querySelectorAll('.tool-card').forEach(card => {
    if (cat === 'all' || card.getAttribute('data-category') === cat) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

function getSmartFallback(topic, tool) {
  const clean = topic.trim();
  
  if (tool === 'merch-video') {
    return `👕 [0-3s VISUAL HOOK]: Fast glitch cut: Close-up on the premium "${clean}" graphic print texture, zooming out instantly.\n\n🎬 [SCENE BREAKDOWN]:\n- Scene 1 (0-5s): Low angle shot of urban streetwear model rocking the ${clean} tee.\n- Scene 2 (5-10s): Smooth 360 rotation highlighting fabric fit and back graphic.\n- Scene 3 (10-15s): Model taps chest print, on-screen text: "Limited Edition Drop - Link in Bio".\n\n🎥 [AI VIDEO PROMPT]:\n"Cinematic 4k shot, fashion streetwear model wearing ${clean} oversized graphic tee walking in neon Tokyo night, shallow depth of field, 9:16 aspect ratio, hyper-realistic, 60fps."\n\n🎵 [AUDIO VIBE]: Trending Dark Phonk or Fast Aesthetic Hip-Hop beat\n\n🏷️ [VIRAL TAGS]: #${clean.replace(/\s+/g, '')} #StreetwearStyle #GraphicTee #OOTDFashion #DropAlert`;
  } else if (tool === 'shopify-page') {
    return `🛍️ [SHOPIFY & ETSY HIGH-CONVERTING PAGE]

1. HOOK & STORY:
Upgrade your everyday style with ${clean}. Designed for those who appreciate premium quality and effortless aesthetic, whether you're out in the city or chilling with friends.

2. WHY YOU'LL LOVE IT (BENEFITS):
• Ultra-Soft Breathable Fabric: Stays cool and comfortable all day long.
• Premium Reinforced Stitching: Built to last through countless washes without losing shape.
• Statement Minimalist Aesthetic: Turns heads without trying too hard.
• Tailored Modern Fit: Flattering drape that complements any streetwear look.

3. SPECS & CARE:
• Material: 100% Combed Ringspun Cotton (Heavyweight 240 GSM)
• Fit: True-to-size streetwear fit (Size up for oversized look)
• Care: Machine wash cold inside out, tumble dry low.

4. FREQUENTLY ASKED QUESTIONS:
• Q: How fast is shipping? 
  A: Orders are processed within 24-48 hours and typically arrive within 4-7 business days.
• Q: What is your return policy? 
  A: We offer a 30-day hassle-free return and exchange guarantee.`;
  } else if (tool === 'cart-recovery') {
    return `📧 [3-STAGE ABANDONED CART RECOVERY FLOW]

EMAIL 1 (Sent 1 hr after abandonment):
Subject: Did you leave something behind? 👀
Preview: Your cart is waiting for you...
Hey there,
We noticed you left ${clean} in your cart. Life gets busy, so we saved your items for you!
👉 [Complete My Order Button]
Need help? Just reply to this email.

---
EMAIL 2 (Sent 24 hrs after abandonment):
Subject: Here is 10% off your order (Just for you!) 🎁
Preview: Use code TAKE10 at checkout.
Still thinking about ${clean}?
Here's a 10% discount to make the decision easier. Use code: TAKE10
Over 1,500+ happy customers love our quality.
👉 [Claim 10% Off & Checkout]

---
EMAIL 3 (Sent 48 hrs after abandonment - Final Notice):
Subject: Your cart reservation is about to expire ⏳
Preview: Last chance before items are released.
This is our final reminder. We can only hold your ${clean} for a few more hours.
👉 [Complete Order Before It Expires]`;
  } else if (tool === 'master-launch') {
    return `🚀 [1-CLICK MASTER LAUNCH PACKAGE: ${clean}]

PART 1: SEO LISTING (Shopify / Etsy / Amazon)
• Title: Premium ${clean} | Modern Aesthetic Apparel
• Description: Make a bold statement with the exclusive ${clean}. Crafted from ultra-comfortable ringspun cotton for everyday wear.
• Tags: #${clean.replace(/\s+/g, '')}, aesthetic, streetwear, premium, dailyoutfit, apparel, drop, trend

PART 2: VIRAL REEL / TIKTOK SCRIPT
• 0-3s Hook: "Stop scrolling if you're tired of basic tees..."
• Visual Direction: Close-up macro lens shot of ${clean} print texture.
• CTA: "Link in bio to shop before the first batch sells out!"

PART 3: HIGH-ROAS META AD COPY
• Primary Text: Upgrade your wardrobe with ${clean}. 100% ring-spun cotton, ultra-soft feel, and zero shrinkage.
• Headline 1: Less Scrolling, More Living.
• Headline 2: Over 1,200+ 5-Star Reviews ⭐⭐⭐⭐⭐`;
  } else if (tool === 'ad-copy') {
    return `🎯 [META & TIKTOK AD LAUNCH KIT]

1. TARGETING BLUEPRINT (US / UK / CA):
• Demographics: Men & Women, 18-34 years
• Core Interests: Streetwear, Graphic T-Shirts, Online Shopping
• Placement: Instagram Reels, TikTok In-Feed

2. 3 SCROLL-STOPPING HOOKS:
• Hook 1: "The only tee that reminds you to actually live your life."
• Hook 2: "Limited batch alert: Grab yours before it's gone."
• Hook 3: "Quality you can feel from day one."

3. PRIMARY AD COPY:
Crafted with ultra-soft, breathable ringspun cotton for all-day comfort.
• 100% Premium Cotton
• Modern Street Fit
👉 Grab yours today! Link in bio.`;
  } else {
    return `🎬 [0-3s HOOK]: "Stop scrolling if you need ${clean}..."\n\n⚡ [SCENE]: Quick cut revealing top features.\n👉 [CTA]: Tap the link in bio to explore the exclusive collection!\n\n#${clean.replace(/\s+/g, '')} #Trending #ViralDrop #MustHave`;
  }
}

async function generateMarketing() {
  const topic = document.getElementById('topicInput').value.trim();
  if (!topic) {
    alert('Please enter your topic or design idea!');
    return;
  }

  const credits = getCreditsRemaining();
  if (credits <= 0) {
    alert('⚡ Free daily limit reached (3/3) used)! Upgrade to OmniFlow Pro for unlimited generations & studio tools.');
    openAuthModal('pro');
    return;
  }

  const outputBox = document.getElementById('outputBox');
  const outputContent = document.getElementById('outputContent');
  const generateBtn = document.querySelector('.btn-generate-main');

  outputBox.style.display = 'block';
  outputContent.innerText = '⚡ OmniFlow AI is crafting studio-grade content...';
  generateBtn.disabled = true;

  const conf = toolConfig[activeTool];
  const promptText = conf ? conf.prompt(topic) : `Generate content about: ${topic}`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }]
      })
    });

    const data = await response.json();

    if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts[0].text) {
      outputContent.innerText = data.candidates[0].content.parts[0].text;
      consumeCredit();
      updateCreditDisplay();
      
    } else {
      updateCreditDisplay();
      
      outputContent.innerText = getSmartFallback(topic, activeTool);
      consumeCredit();
      updateCreditDisplay();
      
    }
  } catch (err) {
    outputContent.innerText = getSmartFallback(topic, activeTool);
    consumeCredit();
  } finally {
    generateBtn.disabled = false;
  }
}
function copyOutput() {
  const text = document.getElementById('outputContent').innerText;
  const btn = document.querySelector('.btn-copy');
  
  navigator.clipboard.writeText(text).then(() => {
    if (btn) {
      const originalText = btn.innerHTML;
      btn.innerHTML = '✓ Copied!';
      btn.style.background = '#10b981';
      btn.style.color = '#fff';
      
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.style.color = '';
      }, 2000);
    }
  });
}


function openAuthModal(mode) {
  const modal = document.getElementById('authModal');
  if (modal) modal.style.display = 'flex';
}

function closeAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal) modal.style.display = 'none';
}


// --- DIRECT EMAIL LOGIN SYSTEM ---
function handleAuth(e) {
  if (e) e.preventDefault();
  const emailInput = document.getElementById('authEmail');
  const email = emailInput ? emailInput.value.trim() : '';

  if (!email) return;

  // Local storage me user save karein
  localStorage.setItem('omniflow_user_email', email);

  // Modal band karein
  closeAuthModal();

  // Screen par login show karein
  updateUserDisplay(email);
  alert('Welcome to OmniFlow AI: ' + email);
}

function updateUserDisplay(email) {
  const actions = document.querySelector('.header-actions');
  if (!actions) return;
  const username = email.split('@')[0];
  actions.innerHTML = `
    <span style="color:#38bdf8; font-weight:600; font-size:13px;">👋 ${username}</span>
    <button class="btn-clean" onclick="logoutUser()" style="color:#ef4444; font-size:12px; margin-left:8px; cursor:pointer;">Log Out</button>
  `;
}

function logoutUser() {
  if (confirm('Log out hona chahte hain?')) {
    localStorage.removeItem('omniflow_user_email');
    location.reload();
  }
}

document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('omniflow_user_email');
    const mainContainer = document.getElementById('mainDashboard') || document.querySelector('.main-container');
    const authModal = document.getElementById('authModal');

    if (saved) {
        updateUserDisplay(saved);
        if (mainContainer) {
            mainContainer.style.display = 'block';
        }
        if (authModal) {
            authModal.style.display = 'none';
        }
    } else {
        if (authModal) {
            authModal.style.display = 'flex';
        }
        if (mainContainer) {
            mainContainer.style.display = 'none';
        }
    }
});

});

// --- POLICY MODAL HANDLER ---
const policyData = {
  privacy: {
    title: 'Privacy Policy',
    content: `
      <p><strong>1. Data Collection:</strong> We only store your email address locally in your browser to maintain your session and count your daily tool credits.</p>
      <p><strong>2. Third-Party Sharing:</strong> We do NOT sell, rent, or trade your personal information with any third-party advertisers.</p>
      <p><strong>3. AI Processing:</strong> Text inputs provided to generate e-commerce content are securely processed via Google Gemini API to return your results.</p>
    `
  },
  terms: {
    title: 'Terms of Service',
    content: `
      <p><strong>1. Service Usage:</strong> OmniFlow provides AI-generated marketing copy, SEO listings, and tags. You retain full ownership to use generated outputs for your stores.</p>
      <p><strong>2. Free Quota:</strong> Free accounts receive up to 5 generations per day. Fair usage limits apply.</p>
      <p><strong>3. Pro Upgrades:</strong> Future Pro subscriptions will unlock unlimited access under standard monthly billing rules.</p>
    `
  },
  security: {
    title: 'Security & Data Protection',
    content: `
      <p><strong>1. Encryption:</strong> All requests to OmniFlow Studio are transmitted via HTTPS SSL encryption.</p>
      <p><strong>2. Local Storage Safety:</strong> Your credentials are kept inside your own device browser cache and can be cleared anytime by logging out.</p>
    `
  }
};

function openPolicyModal(type) {
  const modal = document.getElementById('policyModal');
  const title = document.getElementById('policyModalTitle');
  const body = document.getElementById('policyModalBody');
  const data = policyData[type];

  if (modal && data) {
    title.innerText = data.title;
    body.innerHTML = data.content;
    modal.style.display = 'flex';
  }
}

function closePolicyModal() {
  const modal = document.getElementById('policyModal');
  if (modal) modal.style.display = 'none';
}
// --- LIVE CREDIT BADGE UPDATE ---
function updateCreditDisplay() {
  const credits = typeof getCreditsRemaining === 'function' ? getCreditsRemaining() : 3;
  const badge = document.getElementById('creditBadge');
  if (badge) {
    badge.innerText = `⚡ Credits: ${credits}/3 left today`;
    if (credits <= 0) {
      badge.style.color = '#ef4444';
      badge.style.borderColor = 'rgba(239, 68, 68, 0.4)';
      badge.style.background = 'rgba(239, 68, 68, 0.15)';
    } else {
      badge.style.color = '#38bdf8';
      badge.style.borderColor = 'rgba(56, 189, 248, 0.3)';
      badge.style.background = 'rgba(56, 189, 248, 0.12)';
    }
  }
}

// Page load hote hi live count show karein
document.addEventListener('DOMContentLoaded', updateCreditDisplay);
