// OmniFlow AI - VERCEL: /api/delete-account
// Login kiye hue user ka account aur uska saara data (daily_usage) hamesha ke liye hata deta hai.
// Env: SUPABASE_SECRET_KEY (required), SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY (optional)

const SUPABASE_URL = (process.env.SUPABASE_URL || 'https://mxptmqdxrbayvyerwerb.supabase.co').replace(/\/+$/, '');
const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_c1cCSvJZMn4xtg3uIRyFZg_uizzIsMO';
const hits = new Map();

function fetchWithTimeout(url, options, ms) {
  const controller = new AbortController();
  const timer = setTimeout(function () { controller.abort(); }, ms);
  return fetch(url, Object.assign({}, options, { signal: controller.signal }))
    .finally(function () { clearTimeout(timer); });
}

function send(res, status, obj) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(obj));
}

function bearerToken(req) {
  const h = req.headers || {};
  const m = /^Bearer\s+(\S+)$/i.exec(String(h.authorization || '').trim());
  return m ? m[1] : '';
}

function limited(ip) {
  const now = Date.now();
  const fresh = (hits.get(ip) || []).filter(function (t) { return now - t < 3600000; });
  if (fresh.length >= 10) { hits.set(ip, fresh); return true; }
  fresh.push(now);
  hits.set(ip, fresh);
  if (hits.size > 5000) hits.clear();
  return false;
}

module.exports = async function (req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return send(res, 405, { error: 'Only POST is allowed.' });
  }
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!secret) return send(res, 500, { error: 'Server is not configured.', code: 'not_configured' });

  const token = bearerToken(req);
  if (!token) return send(res, 401, { error: 'Please log in first.', code: 'login_required' });

  const ip = String((req.headers['x-forwarded-for'] || 'unknown')).split(',')[0].trim();
  if (limited(ip)) return send(res, 429, { error: 'Too many requests. Please try again later.' });

  try {
    // 1) token asli hai? user kaun hai?
    const ur = await fetchWithTimeout(SUPABASE_URL + '/auth/v1/user', {
      method: 'GET',
      headers: { apikey: SUPABASE_PUBLISHABLE_KEY, Authorization: 'Bearer ' + token }
    }, 6000);
    if (!ur.ok) return send(res, 401, { error: 'Your login has expired. Please log in again.', code: 'login_required' });
    const user = await ur.json().catch(function () { return null; });
    if (!user || typeof user.id !== 'string') {
      return send(res, 401, { error: 'Your login has expired. Please log in again.', code: 'login_required' });
    }

    // 2) account hatao (daily_usage ki rows apne aap hat jaati hain: on delete cascade)
    const headers = { apikey: secret, 'Content-Type': 'application/json' };
    if (secret.indexOf('eyJ') === 0) headers.Authorization = 'Bearer ' + secret;
    const dr = await fetchWithTimeout(SUPABASE_URL + '/auth/v1/admin/users/' + encodeURIComponent(user.id), {
      method: 'DELETE',
      headers: headers,
      body: JSON.stringify({ should_soft_delete: false })
    }, 10000);
    if (!dr.ok) {
      const d = await dr.json().catch(function () { return {}; });
      console.error('delete user failed', dr.status, JSON.stringify(d));
      return send(res, 502, { error: 'Could not delete the account right now. Please email rahmananowar67@gmail.com and we will delete it.' });
    }
    return send(res, 200, { deleted: true });
  } catch (e) {
    console.error('delete-account error', e && e.message);
    return send(res, 502, { error: 'Server is busy. Please try again in a moment.' });
  }
};
        
