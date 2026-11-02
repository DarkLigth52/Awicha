// Ventas, compras, transferencias, configuración, auditoría y respaldo
const router = require('express').Router(), db = require('../db'), { T } = require('../schema'), svc = require('../services/restaurant'), { HttpError } = require('../errors');
const addMov = db.prepare('INSERT INTO movements(date,type,account,category,description,amount,currency) VALUES(?,?,?,?,?,?,?)');

router.get('/audit', (q, r) => r.json(db.prepare('SELECT * FROM audit ORDER BY id DESC LIMIT 60').all()));
router.get('/sales', (q, r) => r.json(db.prepare('SELECT * FROM sales ORDER BY id DESC LIMIT 3000').all()));
router.get('/settings', (q, r) => r.json(Object.fromEntries(db.prepare('SELECT * FROM settings').all().map(x => [x.k, x.v]))));
router.post('/settings', (q, r) => {
  for (const [k, v] of Object.entries(q.body)) db.prepare('INSERT INTO settings VALUES(?,?) ON CONFLICT(k) DO UPDATE SET v=excluded.v').run(k, String(v));
  r.json({ ok: 1 });
});
router.post('/sales', (q, r) => r.json(svc.sellDish(q.body)));
router.post('/purchases', (q, r) => r.json(svc.buyProduct(q.body)));
router.post('/transfer', (q, r) => {
  const { from, to, amount, date } = q.body, a = Number(amount);
  if (!(a > 0) || from === to) throw new HttpError(400, 'Revisa el monto y las cuentas');
  db.transaction(() => { addMov.run(date, 'egreso', from, 'Transferencia', 'A ' + to, a, 'Bs'); addMov.run(date, 'ingreso', to, 'Transferencia', 'De ' + from, a, 'Bs'); })();
  r.json({ ok: 1 });
});
router.get('/backup', (q, r) => r.json(Object.fromEntries([...Object.keys(T), 'sales'].map(t => [t, db.prepare(`SELECT * FROM ${t}`).all()]))));
module.exports = router;
