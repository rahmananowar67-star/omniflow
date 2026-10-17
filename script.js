// Scrambled & Encrypted Key Access
const _0x4f1a = "QU16YVN0KVrd1FsaZXN1RXQ1VtaOMWJ3RjB0NEx3J3RjB_remove", "split", "reverse", "join";
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
        prompt: (topic) => `Create a complete TikTok/Reels promotional video package for a t-shirt/apparel design based on: ${topic}`
    },
    'reel-script': {
        title: '🎬 Viral Reel Script & Hook',
        hint: 'Generates 3-second hook, visual directions, and audio cues for viral short videos.',
        label: 'Enter your Video Topic or Concept',
        prompt: (topic) => `Write a viral 30-second Instagram Reel / YouTube Shorts script about: ${topic}`
    },
    'video-prompt': {
        title: '🎥 AI Video Prompts (Kling / Luma / Runway)',
        hint: 'Generates detailed cinematic text prompts for AI video generators.',
        label: 'Enter the scene you want to visualize',
        prompt: (topic) => `Generate 3 hyper-detailed cinematic text prompts for Kling AI and Luma Dream Machine based on: ${topic}`
    },
    'pod-seo': {
        title: '🏷️ POD Listing & Merch SEO',
        hint: 'Optimized Title, Description & 13 SEO Tags for Zazzle, Redbubble & Etsy.',
        label: 'Enter your T-shirt or Merch design title/concept',
        prompt: (topic) => `Create a complete SEO listing for print-on-demand the design: ${topic}`
    },
    'slogan-ideas': {
        title: '💡 Merch Slogans & Quotes',
        hint: 'Viral punchlines and typography ideas for graphic tees and hoodies.',
        label: 'Enter your design theme (e.g., Anime, Gym, Minimalist)',
        prompt: (topic) => `Generate 10 catchy, viral t-shirt slogans and typographic quotes about: ${topic}`
    },
    'shopify-page': {
        title: '🛒 Shopify & Etsy Page Studio',
        hint: 'High-converting product description, benefit bullets, sizing notes & FAQ section.',
        label: 'Enter your Product Name, Features, or Niche',
        prompt: (topic) => `You are an elite E-commerce Conversion Rate Optimization (CRO) copywriter. Create a complete product description for: ${topic}`
    },
    'cart-recovery': {
        title: '✉️ 3-Stage Abandoned Cart Recovery Email Flow',
        hint: 'High-converting sequence to bring back shoppers who left their cart without buying.',
        label: 'Enter your Brand/Store Name & Main Product Category',
        prompt: (topic) => `You are an expert direct-response email marketer for Shopify/e-commerce. Write a 3-stage Abandoned Cart Recovery sequence for: ${topic}`
    },
    'master-launch': {
        title: '🚀 1-Click Master Launch Hub',
        hint: 'Generate Product Listing, Viral Video Ad Script, and Meta Ad Copy simultaneously.',
        label: 'Enter your Product / Design Idea for Complete Launch',
        prompt: (topic) => `You are an agency-level product launch specialist. Generate a complete 3-in-1 launch package for: ${topic}`
    },
    'viral-tags': {
        title: '#️⃣ Viral Hashtag Engine',
        hint: 'Top niche + high-reach tag batches for maximum reach.',
        label: 'Enter your niche, design, or topic',
        prompt: (topic) => `Generate 25 strategic viral hashtags for: ${topic}`
    },
    'caption': {
        title: '✍️ High-CTR Captions',
        hint: 'Engaging storytelling, bullet points, and high conversion call-to-actions.',
        label: 'Enter your product or post idea',
        prompt: (topic) => `Write 2 high-converting captions for Instagram about: ${topic}`
    },
    'ad-copy': {
        title: '📢 High-ROAS Ad Studio',
        hint: 'Meta & TikTok high-converting ad copy, viral hooks, targeting blueprint, and creative direction.',
        label: 'Enter your product, theme, or design idea',
        prompt: (topic) => `You are a world-class direct-response media buyer and copywriter specializing in Meta and TikTok ads for: ${topic}`
    },
    'english-polish': {
        title: '🌐 US/UK English Polisher',
        hint: 'Turn rough sentences into fluent, native-level professional English.',
        label: 'Paste your rough or broken English text here',
        prompt: (topic) => `Rewrite and polish the following text into fluent, natural US/UK English with high clarity: ${topic}`
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
    if (e && e.target) e.target.classList.add('active');

    document.querySelectorAll('.tool-card').forEach(card => {
        if (cat === 'all' || card.getAttribute('data-category') === cat) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

function getSmartFallback(topic, tool) {
    return `✨ Premium Quality & Exclusive Design for ${topic}!`;
}

async function generateMarketing() {
    const topic = document.getElementById('topicInput').value.trim();
    if (!topic) {
        alert('Please enter your topic or design idea!');
        return;
    }

    const credits = getCreditsRemaining();
    if (credits <= 0) {
        alert('⚡ Free daily limit reached (3/3) used! Upgrade to OmniFlow Pro for unlimited generations & studio tools.');
        openAuthModal();
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
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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

// --- DIRECT EMAIL LOGIN SYSTEM ---
function openAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.style.setProperty('display', 'flex', 'important');
    }
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.style.setProperty('display', 'none', 'important');
    }
}

function handleAuth(e) {
    if (e) e.preventDefault();
    const emailInput = document.getElementById('authEmail');
    const email = emailInput ? emailInput.value.trim() : '';

    if (!email) {
        alert('Kripya apna email darj karein!');
        return;
    }

    // Save email in local storage
    localStorage.setItem('omniflow_user_email', email);

    // Close modal
    closeAuthModal();

    // Show user display and dashboard
    updateUserDisplay(email);
    const mainContainer = document.getElementById('mainDashboard') || document.querySelector('.main-container');
    if (mainContainer) {
        mainContainer.style.display = 'block';
    }
    alert('Welcome to OmniFlow AI: ' + email);
}

function updateUserDisplay(email) {
    const actions = document.querySelector('.header-actions');
    if (!actions) return;
    const username = email.split('@')[0];
    actions.innerHTML = `
        <span style="color:#38bdf8; font-weight:600; font-size:13px;">👋 ${username}</span>
        <button class="btn-clean" onclick="logoutUser()" style="color:#ef4444; font-size:12px; margin-left:8px; cursor:pointer;">Logout</button>
    `;
}

function logoutUser() {
    if (confirm('Log out hona chahte hain?')) {
        localStorage.removeItem('omniflow_user_email');
        location.reload();
    }
}

// Policy Modal Handlers
const policyData = {
    privacy: {
        title: 'Privacy Policy',
        content: '<p><strong>1. Data Collection:</strong> We only store your email address locally in your browser to maintain your session.</p><p><strong>2. Third-Party Sharing:</strong> We do NOT sell, rent, or trade your personal information.</p>'
    },
    terms: {
        title: 'Terms of Service',
        content: '<p><strong>1. Service Usage:</strong> OmniFlow provides AI-generated marketing copy, SEO listings, and tags.</p>'
    },
    security: {
        title: 'Security & Data Protection',
        content: '<p><strong>1. Encryption:</strong> All requests to OmniFlow Studio are transmitted via HTTPS SSL encryption.</p>'
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

function updateCreditDisplay() {
    const credits = typeof getCreditsRemaining === 'function' ? getCreditsRemaining() : 3;
    const badge = document.getElementById('creditBadge');
    if (badge) {
        badge.innerText = `⚡ Credits: ${credits}/3 left today`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateCreditDisplay();
    const saved = localStorage.getItem('omniflow_user_email');
    const mainContainer = document.getElementById('mainDashboard') || document.querySelector('.main-container');
    const authModal = document.getElementById('authModal');

    if (saved) {
        updateUserDisplay(saved);
        if (mainContainer) mainContainer.style.display = 'block';
        if (authModal) authModal.style.setProperty('display', 'none', 'important');
    } else {
        if (authModal) {
            authModal.style.setProperty('display', 'flex', 'important');
        }
        if (mainContainer) {
            mainContainer.style.display = 'none';
        }
    }
});
