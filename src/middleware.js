// Cabeceras de seguridad, límite de intentos de login y manejo de errores
exports.headers = (q, r, n) => { r.set({ 'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY', 'Referrer-Policy': 'no-referrer' }); n(); };
const hits = new Map();
exports.loginLimit = (q, r, n) => {
  const h = hits.get(q.ip) || { n: 0, t: Date.now() };
  if (Date.now() - h.t > 9e5) { h.n = 0; h.t = Date.now(); }
  hits.set(q.ip, h);
  if (h.n >= 10) return r.status(429).json({ error: 'Demasiados intentos. Espera 15 minutos.' });
  r.on('finish', () => { if (r.statusCode === 401) h.n++; });
  n();
};
exports.errorHandler = (e, q, r, n) => {
  if (!e.status) console.error(e);
  r.status(e.status || 500).json({ error: e.status ? e.message : 'Error interno del servidor' });
};
