const router = require('express').Router(), bcrypt = require('bcryptjs'), db = require('../db');
router.post('/password', (q, r) => {
  const { user, pass, role } = q.body;
  if (!user || !pass || pass.length < 6) return r.status(400).json({ error: 'Mínimo 6 caracteres' });
  db.prepare('INSERT INTO users(user,hash,role) VALUES(?,?,?) ON CONFLICT(user) DO UPDATE SET hash=excluded.hash, role=excluded.role')
    .run(user, bcrypt.hashSync(pass, 10), role === 'lectura' ? 'lectura' : 'admin');
  r.json({ ok: 1 });
});
module.exports = router;
