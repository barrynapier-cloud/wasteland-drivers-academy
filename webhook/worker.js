// ============================================================
// Permit Legends — Stripe → Firebase entitlement webhook
// Cloudflare Worker. On a verified paid checkout, marks the buyer's
// Firebase account unlocked (Admin write, bypasses Firestore rules).
//
// Secrets (set via the CF API, never in this file):
//   STRIPE_WEBHOOK_SECRET  whsec_... signing secret for this endpoint
//   FIREBASE_SA            the service-account JSON (full text)
//   PROJECT_ID             "permitlegends"
//
// Security: verifies the Stripe signature (HMAC-SHA256 over
// `${t}.${body}`) with a constant-time compare and a 5-minute freshness
// window before trusting anything. The entitlement is keyed to
// client_reference_id (the Firebase UID), never a spoofable email.
// ============================================================

export default {
  async fetch(request, env) {
    if (request.method !== 'POST') return new Response('ok', { status: 200 });

    const body = await request.text();
    const sig = request.headers.get('stripe-signature') || '';

    const verified = await verifyStripe(body, sig, env.STRIPE_WEBHOOK_SECRET);
    if (!verified) return new Response('bad signature', { status: 400 });

    let event;
    try { event = JSON.parse(body); } catch (e) { return new Response('bad json', { status: 400 }); }

    // Only paid checkouts grant entitlement.
    if (event.type === 'checkout.session.completed') {
      const s = event.data && event.data.object;
      const paid = s && (s.payment_status === 'paid' || s.status === 'complete');
      const uid = s && s.client_reference_id;
      if (paid && uid) {
        try {
          await grantUnlock(uid, s, env);
        } catch (e) {
          // 500 tells Stripe to retry; the write is idempotent.
          return new Response('grant failed: ' + (e && e.message), { status: 500 });
        }
      }
    }
    return new Response('ok', { status: 200 });
  }
};

// ---- Stripe signature verification (Web Crypto) ----
async function verifyStripe(payload, header, secret) {
  if (!secret || !header) return false;
  const parts = Object.fromEntries(header.split(',').map(kv => kv.split('=')));
  const t = parts.t, v1 = parts.v1;
  if (!t || !v1) return false;
  // freshness: within 5 minutes
  if (Math.abs(Date.now() / 1000 - Number(t)) > 300) return false;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${t}.${payload}`));
  const expected = [...new Uint8Array(mac)].map(b => b.toString(16).padStart(2, '0')).join('');
  return timingSafeEqual(expected, v1);
}
function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

// ---- Firebase Admin write via a service-account access token ----
async function grantUnlock(uid, session, env) {
  const sa = JSON.parse(env.FIREBASE_SA);
  const token = await googleToken(sa);
  const project = env.PROJECT_ID || sa.project_id;
  const url = `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/profiles/${encodeURIComponent(uid)}`
    + `?updateMask.fieldPaths=unlocked&updateMask.fieldPaths=updatedAt&updateMask.fieldPaths=stripeSession`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: {
      unlocked: { booleanValue: true },
      updatedAt: { timestampValue: new Date().toISOString() },
      stripeSession: { stringValue: (session && session.id) || '' }
    } })
  });
  if (!res.ok) throw new Error('firestore ' + res.status + ' ' + (await res.text()).slice(0, 120));
}

async function googleToken(sa) {
  const enc = (o) => btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify(o))))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const now = Math.floor(Date.now() / 1000);
  const claim = enc({ iss: sa.client_email, scope: 'https://www.googleapis.com/auth/datastore',
    aud: sa.token_uri, iat: now, exp: now + 3600 });
  const header = enc({ alg: 'RS256', typ: 'JWT' });
  const signingInput = `${header}.${claim}`;
  const key = await crypto.subtle.importKey('pkcs8', pemToDer(sa.private_key),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
  const sigBuf = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(signingInput));
  const sig = btoa(String.fromCharCode(...new Uint8Array(sigBuf)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const res = await fetch(sa.token_uri, {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${signingInput}.${sig}`
  });
  const d = await res.json();
  if (!d.access_token) throw new Error('token: ' + JSON.stringify(d));
  return d.access_token;
}
function pemToDer(pem) {
  const b64 = pem.replace(/-----BEGIN PRIVATE KEY-----/, '').replace(/-----END PRIVATE KEY-----/, '').replace(/\s+/g, '');
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}
