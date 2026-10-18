// =====================================================
// OmniFlow AI - script.js
// Note: AI ka kaam server function (/api/generate) karta hai,
// isliye yahan koi API key nahi hai.
// =====================================================

let activeTool = 'merch-video';
let activeCategory = 'all';

// ---------- Daily free credits ----------
const DAILY_FREE_LIMIT = 3;

function todayStr() {
    return new Date().toISOString().slice(0, 10);
}

function getCreditsRemaining() {
    try {
        if (localStorage.getItem('omniflow_date') !== todayStr()) {
            localStorage.setItem('omniflow_date', todayStr());
            localStorage.setItem('omniflow_credits_used', '0');
            return DAILY_FREE_LIMIT;
        }
        const used = parseInt(localStorage.getItem('omniflow_credits_used') || '0', 10);
        return Math.max(0, DAILY_FREE_LIMIT - used);
    } catch (e) {
        return DAILY_FREE_LIMIT;
    }
}

function consumeCredit() {
    try {
        const used = parseInt(localStorage.getItem('omniflow_credits_used') || '0', 10);
        localStorage.setItem('omniflow_credits_used', String(used + 1));
    } catch (e) { /* ignore */ }
}

function updateCreditDisplay() {
    const badge = document.getElementById('creditBadge');
    if (badge) badge.textContent = '⚡ Credits: ' + getCreditsRemaining() + '/' + DAILY_FREE_LIMIT + ' left today';
}

// ---------- Tool configuration (UI text) ----------
const toolConfig = {
    'merch-video': {
        title: '👕 T-Shirt / Merch Video Ad Studio',
        hint: 'Creates complete video ad script, AI visual prompt, music idea, and viral tags for your apparel design.',
        label: 'Enter your T-shirt Design Theme or Title',
        placeholder: 'e.g., Japanese Cyberpunk Samurai T-Shirt, Gym Motivation Drop, Vintage Wolf Graphic...'
    },
    'reel-script': {
        title: '🎬 Viral Reel Script & Hook',
        hint: 'Generates 3-second hook, visual directions, and audio cues for viral short videos.',
        label: 'Enter your Video Topic or Concept',
        placeholder: 'e.g., 5 morning habits of successful people'
    },
    'video-prompt': {
        title: '🎥 AI Video Prompts (Kling / Luma / Runway)',
        hint: 'Generates detailed cinematic text prompts for AI video generators.',
        label: 'Enter the scene you want to visualize',
        placeholder: 'e.g., A samurai walking through neon rain in Tokyo'
    },
    'pod-seo': {
        title: '🏷️ POD Listing & Merch SEO',
        hint: 'Optimized Title, Description & 13 SEO Tags for Zazzle, Redbubble & Etsy.',
        label: 'Enter your T-shirt or Merch design title/concept',
        placeholder: 'e.g., Vintage Wolf Graphic Tee'
    },
    'slogan-ideas': {
        title: '💡 Merch Slogans & Quotes',
        hint: 'Viral punchlines and typography ideas for graphic tees and hoodies.',
        label: 'Enter your design theme (e.g., Anime, Gym, Minimalist)',
        placeholder: 'e.g., Coffee lovers, Gym motivation, Gamers'
    },
    'shopify-page': {
        title: '🛍️ Shopify & Etsy Page Studio',
        hint: 'High-converting product description, benefit bullets, sizing notes & FAQ section.',
        label: 'Enter your Product Name, Features, or Niche',
        placeholder: 'e.g., Oversized cotton hoodie, unisex, 5 colors'
    },
    'cart-recovery': {
        title: '📧 3-Stage Abandoned Cart Recovery Email Flow',
        hint: 'High-converting sequence to bring back shoppers who left their cart without buying.',
        label: 'Enter your Brand/Store Name & Main Product Category',
        placeholder: 'e.g., UrbanThread - streetwear t-shirts'
    },
    'master-launch': {
        title: '🚀 1-Click Master Launch Hub',
        hint: 'Generate Product Listing, Viral Video Ad Script, and Meta Ad Copy simultaneously.',
        label: 'Enter your Product / Design Idea for Complete Launch',
        placeholder: 'e.g., Anime streetwear hoodie for teenagers'
    },
    'viral-tags': {
        title: '#️⃣ Viral Hashtag Engine',
        hint: 'Top niche + high-reach tag batches for maximum reach.',
        label: 'Enter your niche, design, or topic',
        placeholder: 'e.g., Fitness reel for beginners'
    },
    'caption': {
        title: '📝 High-CTR Captions',
        hint: 'Engaging storytelling, bullet points, and high conversion call-to-actions.',
        label: 'Enter your product or post idea',
        placeholder: 'e.g., New t-shirt collection launching today'
    },
    'ad-copy': {
        title: '🎯 High-ROAS Ad Studio',
        hint: 'Meta & TikTok high-converting ad copy, viral hooks, targeting blueprint, and creative direction.',
        label: 'Enter your product, theme, or design idea',
        placeholder: 'e.g., Wireless earbuds with 40-hour battery'
    },
    'english-polish': {
        title: '💎 US/UK English Polisher',
        hint: 'Turn rough sentences into fluent, native-level professional English.',
        label: 'Paste your rough or broken English text here',
        placeholder: 'e.g., I want sell this product in cheap price'
    }
};

// ---------- Tool select + category filter ----------
function selectTool(toolKey, element) {
    const conf = toolConfig[toolKey];
    if (!conf) return;

    activeTool = toolKey;

    document.querySelectorAll('.tool-card').forEach(function (c) { c.classList.remove('active'); });
    if (element) element.classList.add('active');

    const input = document.getElementById('topicInput');
    if (input) {
        input.value = '';
        input.placeholder = conf.placeholder;
    }

    const outputBox = document.getElementById('outputBox');
    if (outputBox) outputBox.style.display = 'none';

    document.getElementById('currentToolBadge').textContent = 'Selected: ' + conf.title;
    document.getElementById('currentToolHint').textContent = conf.hint;
    document.getElementById('inputBoxLabel').textContent = conf.label;
}

function filterCategory(cat, e) {
    activeCategory = cat;

    document.querySelectorAll('.cat-pill').forEach(function (b) { b.classList.remove('active'); });
    if (e && e.currentTarget) e.currentTarget.classList.add('active');

    let firstVisible = null;
    let activeStillVisible = false;

    document.querySelectorAll('.tool-card').forEach(function (card) {
        const show = (cat === 'all' || card.getAttribute('data-category') === cat);
        card.style.display = show ? 'flex' : 'none';
        if (show && !firstVisible) firstVisible = card;
        if (show && card.classList.contains('active')) activeStillVisible = true;
    });

    // Agar chuna hua tool is category mein nahi hai, to pehla tool khud select ho jaye
    if (!activeStillVisible && firstVisible) firstVisible.click();
}

// ---------- AI generation ----------
function setOutput(text, state) {
    const box = document.getElementById('outputBox');
    const content = document.getElementById('outputContent');
    const badge = document.getElementById('outputBadge');
    box.style.display = 'block';
    content.textContent = text;
    content.classList.toggle('loading', state === 'loading');
    if (badge) {
        badge.className = 'badge-ready' + (state === 'loading' ? ' loading' : state === 'error' ? ' error' : '');
        if (state === 'demo') badge.className = 'badge-ready loading';
        badge.textContent = state === 'loading' ? 'WORKING...' : state === 'error' ? 'ERROR' : state === 'demo' ? 'DEMO' : 'READY';
    }
}

// ---------- Demo mode (jab tak AI / Gemini API connect nahi hai) ----------
function demoOutput(tool, t) {
    const T = {
        'merch-video': 'HOOK (0-3s): "Ye tee sirf kapda nahi, ek statement hai."\n\nSCENES:\n- Scene 1: Close-up of the ' + t + ' design on the fabric\n- Scene 2: Model wearing it in an urban street, slow-motion walk\n- Scene 3: Detail shots of print quality and fit\n\nVIDEO PROMPT: Cinematic street-style shot of a model wearing a t-shirt with "' + t + '" graphic, golden hour, shallow depth of field.\n\nMUSIC: Upbeat lo-fi beat with a punchy drop at 3 seconds.\n\nTAGS: #tshirt #streetwear #graphictee #ootd #fashion',
        'reel-script': 'HOOK (0-3s): "Nobody tells you this about ' + t + '..."\n\nSCENES:\n- 0-3s: Bold text on screen + quick zoom\n- 3-15s: Three fast points about ' + t + '\n- 15-27s: One real example or proof\n- 27-30s: Call to action\n\nVOICEOVER: Keep each line under 8 words.\nCTA: Follow for more.',
        'video-prompt': 'PROMPT 1: Cinematic wide shot, ' + t + ', soft volumetric light, slow dolly-in, 24fps film look, 5 seconds.\n\nPROMPT 2: Close-up macro detail of ' + t + ', shallow depth of field, moody lighting, slow pan right.\n\nPROMPT 3: Aerial drone shot revealing ' + t + ', sunrise colour grade, smooth motion, 8 seconds.',
        'pod-seo': 'TITLE: ' + t + ' Graphic Tee - Unique Gift Idea\n\nDESCRIPTION: A standout design inspired by ' + t + '. Soft, comfortable and made for everyday wear. A great gift for friends and family.\n\nTAGS: ' + t.toLowerCase() + ', graphic tee, gift idea, trendy shirt, streetwear, unisex tee, funny shirt, birthday gift, casual wear, cool design, printed tee, aesthetic shirt, custom tee',
        'slogan-ideas': '1. "Born for ' + t + '"\n2. "Less talk, more ' + t + '"\n3. "Powered by ' + t + '"\n4. "Keep calm and ' + t + '"\n5. "' + t + ' is my love language"\n6. "Just add ' + t + '"\n7. "Made for ' + t + '"\n8. "Where there\'s ' + t + ', there\'s joy"\n9. "No days off from ' + t + '"\n10. "Living the ' + t + ' life"',
        'shopify-page': 'HEADLINE: Meet your new favourite: ' + t + '\n\nDESCRIPTION: Designed for comfort and made to last. ' + t + ' fits right into your everyday life.\n\nBENEFITS:\n- Premium, long-lasting quality\n- Comfortable all-day fit\n- Easy to care for\n- Great as a gift\n- Fast delivery\n\nSIZING: True to size. Check the size chart before ordering.\n\nFAQ:\n- How long is delivery? 4-7 working days.\n- Can I return it? Yes, within 7 days.',
        'cart-recovery': 'EMAIL 1 (after 1 hour)\nSubject: You left something behind\nBody: Your ' + t + ' is waiting in your cart. Complete your order in one click.\n\nEMAIL 2 (after 24 hours)\nSubject: Still thinking it over?\nBody: Here are 3 reasons customers love ' + t + '. Your cart is saved.\n\nEMAIL 3 (after 72 hours)\nSubject: Last chance - 10% off inside\nBody: Use code COMEBACK10 today only.',
        'master-launch': 'PART 1 - LISTING\nTitle: ' + t + ' - Limited Edition\nTags: ' + t.toLowerCase() + ', trending, gift, new arrival, bestseller\n\nPART 2 - VIDEO AD\nHook: "Wait till you see this ' + t + '."\nScenes: product reveal, lifestyle shot, offer, call to action.\n\nPART 3 - META AD COPY\nVariation 1: Meet ' + t + '. Made for people who stand out. Shop now.\nVariation 2: Everyone is asking about ' + t + '. Get yours today.',
        'viral-tags': 'HIGH REACH: #viral #trending #fyp #reels #explore #instagood\n\nMID REACH: #' + t.replace(/\s+/g, '').toLowerCase() + ' #smallbusiness #shoplocal #newdrop #creator #contentcreator\n\nNICHE: #' + t.replace(/\s+/g, '').toLowerCase() + 'lovers #' + t.replace(/\s+/g, '').toLowerCase() + 'style #' + t.replace(/\s+/g, '').toLowerCase() + 'community #madewithlove',
        'caption': 'CAPTION 1:\nSome things just feel right. ' + t + ' is one of them. Tap the link in bio to see more.\n\nCAPTION 2:\nWe made ' + t + ' for people who care about the details. Save this post and share it with someone who needs it.',
        'ad-copy': 'AUDIENCE: Ages 18-34, interested in ' + t + ', online shoppers.\n\nHOOKS:\n1. "Stop scrolling - this is for ' + t + ' fans."\n2. "The one thing about ' + t + ' nobody tells you."\n3. "We tried ' + t + ' so you do not have to."\n\nAD COPY: Discover ' + t + '. Quality you can feel, price you will love. Order today.\n\nCREATIVE: Short 15-second video, bold text in the first 2 seconds.',
        'english-polish': 'POLISHED VERSION:\n' + t.charAt(0).toUpperCase() + t.slice(1) + (/[.!?]$/.test(t) ? '' : '.') + '\n\n(Demo mode mein sirf basic safai hoti hai. AI connect hone ke baad poora grammar aur natural English sudhaar milega.)'
    };
    return T[tool] || ('Demo output for: ' + t);
}

function showDemo(topic) {
    setOutput('🧪 DEMO MODE - ye sample output hai. AI (Gemini) connect hone ke baad asli, behtar content milega.\n\n' + demoOutput(activeTool, topic), 'demo');
}

async function generateMarketing() {
    const input = document.getElementById('topicInput');
    const topic = input.value.trim();
    const btn = document.getElementById('generateBtn');

    if (!topic) {
        alert('Please enter your topic or design idea!');
        input.focus();
        return;
    }

    // Login zaroori hai
    if (!localStorage.getItem('omniflow_user_email')) {
        openAuthModal();
        return;
    }

    if (getCreditsRemaining() <= 0) {
        alert('⚡ Aaj ke ' + DAILY_FREE_LIMIT + ' free credits khatam ho gaye. Kal phir aayein ya OmniFlow Pro ka wait karein!');
        return;
    }

    setOutput('⚡ OmniFlow AI is crafting studio-grade content...', 'loading');
    btn.disabled = true;

    const controller = new AbortController();
    const timer = setTimeout(function () { controller.abort(); }, 60000);

    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tool: activeTool, topic: topic }),
            signal: controller.signal
        });

        let data = {};
        try { data = await response.json(); } catch (e) { /* non-JSON response */ }

        const apiMissing = response.status === 404 || response.status === 405 ||
            (data.error && data.error.indexOf('API key') !== -1);
        if (apiMissing) {
            showDemo(topic);
            return;
        }

        if (!response.ok || !data.text) {
            setOutput('⚠️ ' + (data.error || 'Content generate nahi ho paya. Thodi der baad dobara try karein.') + '\n\n(Is baar aapka credit use nahi hua.)', 'error');
            return;
        }

        setOutput(data.text, 'ready');
        consumeCredit();
        updateCreditDisplay();
    } catch (err) {
        if (location.protocol === 'file:') {
            showDemo(topic);
            return;
        }
        const msg = err && err.name === 'AbortError'
            ? 'Request bahut der le rahi hai. Dobara try karein.'
            : 'Internet ya server ki dikkat hai. Dobara try karein.';
        setOutput('⚠️ ' + msg + '\n\n(Is baar aapka credit use nahi hua.)', 'error');
    } finally {
        clearTimeout(timer);
        btn.disabled = false;
    }
}

function copyOutput() {
    const text = document.getElementById('outputContent').textContent;
    const btn = document.querySelector('.btn-copy');

    function showCopied() {
        if (!btn) return;
        const original = btn.innerHTML;
        btn.innerHTML = '✓ Copied!';
        btn.style.background = '#10b981';
        btn.style.color = '#fff';
        setTimeout(function () {
            btn.innerHTML = original;
            btn.style.background = '';
            btn.style.color = '';
        }, 2000);
    }

    function fallbackCopy() {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); showCopied(); } catch (e) { alert('Copy nahi ho paya, text ko manually select karein.'); }
        document.body.removeChild(ta);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(showCopied).catch(fallbackCopy);
    } else {
        fallbackCopy();
    }
}
// ---------- Login / Logout ----------
let memoryEmail = null; // agar browser storage band ho to yahan yaad rakhega

function getUserEmail() {
    try { return localStorage.getItem('omniflow_user_email') || memoryEmail; } catch (err) { return memoryEmail; }
}

function saveUserEmail(email) {
    memoryEmail = email;
    try { localStorage.setItem('omniflow_user_email', email); } catch (err) { /* ignore */ }
}

function clearUserEmail() {
    memoryEmail = null;
    try { localStorage.removeItem('omniflow_user_email'); } catch (err) { /* ignore */ }
}

function openAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) modal.classList.add('open');
    const email = document.getElementById('authEmail');
    if (email) setTimeout(function () { email.focus(); }, 50);
}

function closeAuthModal() {
    // Login ke bina login page band nahi hoga
    if (!getUserEmail()) return;
    const modal = document.getElementById('authModal');
    if (modal) modal.classList.remove('open');
}

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function handleAuth(e) {
    if (e) e.preventDefault();
    const input = document.getElementById('authEmail');
    const email = input ? input.value.trim() : '';

    if (!isValidEmail(email)) {
        alert('Kripya sahi email darj karein! (jaise name@example.com)');
        return;
    }

    saveUserEmail(email);
    if (input) input.value = '';
    closeAuthModal();
    renderHeader();
    window.scrollTo(0, 0);
}

function logoutUser() {
    if (!confirm('Log out hona chahte hain?')) return;
    clearUserEmail();

    const box = document.getElementById('outputBox');
    if (box) box.style.display = 'none';
    const topicEl = document.getElementById('topicInput');
    if (topicEl) topicEl.value = '';

    renderHeader();
}

// Login status ke hisaab se poora page badalta hai
function renderHeader() {
    const actions = document.getElementById('headerActions');
    if (!actions) return;

    const email = getUserEmail();

    // Login gate: login nahi hai to dashboard chhupa rahega, sirf login page dikhega
    document.body.classList.toggle('logged-out', !email);
    if (!email) openAuthModal();

    actions.innerHTML = '';

    if (email) {
        const name = email.split('@')[0];

        const chip = document.createElement('span');
        chip.className = 'user-chip';

        const avatar = document.createElement('span');
        avatar.className = 'user-avatar';
        avatar.textContent = name.charAt(0);

        const label = document.createElement('span');
        label.className = 'user-name';
        label.textContent = name;

        chip.appendChild(avatar);
        chip.appendChild(label);

        const out = document.createElement('button');
        out.type = 'button';
        out.className = 'btn-logout';
        out.textContent = 'Log Out';
        out.onclick = logoutUser;

        actions.appendChild(chip);
        actions.appendChild(out);
    } else {
        const login = document.createElement('button');
        login.type = 'button';
        login.className = 'btn-clean';
        login.textContent = 'Log In';
        login.onclick = openAuthModal;

        const free = document.createElement('button');
        free.type = 'button';
        free.className = 'btn-primary';
        free.textContent = 'Free Access';
        free.onclick = openAuthModal;

        actions.appendChild(login);
        actions.appendChild(free);
    }
}

// ---------- Policy popups ----------
const policyData = {
    privacy: {
        title: 'Privacy Policy',
        content: '<p><strong>1. Data Collection:</strong> We only store your email address locally in your browser to maintain your session.</p>' +
                 '<p><strong>2. Your Inputs:</strong> The text you enter is sent to our AI provider only to generate your result.</p>' +
                 '<p><strong>3. Third-Party Sharing:</strong> We do NOT sell, rent, or trade your personal information.</p>'
    },
    terms: {
        title: 'Terms of Service',
        content: '<p><strong>1. Service Usage:</strong> OmniFlow provides AI-generated marketing copy, SEO listings, and tags.</p>' +
                 '<
