// Login y protección de rutas (JWT + roles)
const router = require('express').Router(), bcrypt = require('bcryptjs'), jwt = require('jsonwebtoken'), db = require('./db');
const { secret: SECRET } = require('./config');
if (!process.env.SECRET) console.warn('Aviso: define la variable SECRET antes de publicar el sitio en internet.');

router.post('/login', (q, r) => {
  const u = db.prepare('SELECT * FROM users WHERE user=? COLLATE NOCASE').get(String(q.body.user || '').trim());
  if (!u || !bcrypt.compareSync(q.body.pass || '', u.hash)) return r.status(401).json({ error: 'Usuario o contraseña incorrectos' });
  const role = u.role || 'admin';
  r.json({ token: jwt.sign({ id: u.id, user: u.user, role }, SECRET, { expiresIn: '12h' }), user: u.user, role });
});

function guard(q, r, n) {
  try {
    q.u = jwt.verify((q.headers.authorization || '').replace('Bearer ', ''), SECRET);
    if (q.method !== 'GET') {
      if (q.u.role !== 'admin') return r.status(403).json({ error: 'Tu usuario es de solo lectura' });
      db.prepare('INSERT INTO audit(at,user,action) VALUES(?,?,?)').run(new Date().toISOString(), q.u.user, q.method + ' ' + q.originalUrl);
    }
    n();
  } catch { r.status(401).json({ error: 'Sesión vencida' }); }
}
module.exports = { login: router, guard };
