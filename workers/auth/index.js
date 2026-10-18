// POSAVER yönetici paneli için GitHub OAuth aracısı (Sveltia/Decap CMS uyumlu).
// /auth       -> GitHub giriş sayfasına yönlendirir
// /callback   -> GitHub'dan dönen kodu token'a çevirip panele (açılır pencere) iletir

const SCOPE = 'public_repo';

const page = (body, status = 200, extra = {}) =>
  new Response(body, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'Referrer-Policy': 'no-referrer',
      ...extra,
    },
  });

const safeJson = (v) => JSON.stringify(v).replace(/</g, '\\u003c');

function reply(env, payload) {
  const origins = (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
  return page(`<!doctype html><meta charset="utf-8"><title>POSAVER giriş</title>
<p style="font-family:system-ui;padding:2rem">Giriş tamamlanıyor, bu pencere kapanacak…</p>
<script>
  (function () {
    var origins = ${safeJson(origins)};
    var message = ${safeJson(payload)};
    window.addEventListener('message', function (e) {
      if (origins.indexOf(e.origin) === -1) return;
      window.opener.postMessage(message, e.origin);
      setTimeout(function () { window.close(); }, 300);
    });
    if (window.opener) window.opener.postMessage('authorizing:github', '*');
  })();
</script>`);
}

function fail(env, text) {
  return reply(env, 'authorization:github:error:' + JSON.stringify({ message: text }));
}

function auth(url, env) {
  const state = crypto.randomUUID();
  const params = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID,
    redirect_uri: `${url.origin}/callback`,
    scope: SCOPE,
    state,
  });
  return new Response(null, {
    status: 302,
    headers: {
      Location: `https://github.com/login/oauth/authorize?${params}`,
      'Set-Cookie': `oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`,
      'Cache-Control': 'no-store',
    },
  });
}

async function callback(request, url, env) {
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const cookie = (request.headers.get('Cookie') || '').match(/(?:^|;\s*)oauth_state=([^;]+)/);

  if (url.searchParams.get('error')) return fail(env, 'GitHub girişi iptal edildi.');
  if (!code || !state || !cookie || cookie[1] !== state) return fail(env, 'Giriş doğrulanamadı, lütfen tekrar deneyin.');

  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'User-Agent': 'posaver-auth' },
    body: JSON.stringify({ client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET, code }),
  });
  const data = await res.json().catch(() => ({}));
  if (!data.access_token) return fail(env, 'GitHub token vermedi: ' + (data.error_description || data.error || res.status));

  return reply(env, 'authorization:github:success:' + JSON.stringify({ token: data.access_token, provider: 'github' }));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method !== 'GET') return new Response('Method not allowed', { status: 405 });
    if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) return new Response('Kurulum eksik', { status: 500 });
    if (url.pathname === '/auth') return auth(url, env);
    if (url.pathname === '/callback') return callback(request, url, env);
    return new Response('POSAVER auth', { status: 404 });
  },
};
