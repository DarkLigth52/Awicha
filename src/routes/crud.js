// CRUD genérico con validación para movimientos, cuentas, insumos, platos y contactos
const router = require('express').Router(), db = require('../db'), { T, NUM, validate } = require('../schema');
const clean = (c, o) => {
  const x = Object.fromEntries(c.map(k => [k, NUM.includes(k) ? Number(o[k]) || 0 : String(o[k] ?? '')]));
  if ('currency' in x && !x.currency) x.currency = 'Bs';
  if ('recipe' in x && !x.recipe) x.recipe = '[]';
  if ('unit' in x && !x.unit) x.unit = 'unid';
  return x;
};
for (const [t, { cols: c }] of Object.entries(T)) {
  router.get(`/${t}`, (q, r) => r.json(db.prepare(`SELECT * FROM ${t} ORDER BY id DESC`).all()));
  router.post(`/${t}`, (q, r) => {
    const rows = Array.isArray(q.body) ? q.body : [q.body];
    rows.forEach(o => validate(t, o));
    const st = db.prepare(`INSERT INTO ${t}(${c}) VALUES(${c.map(x => '@' + x)})`);
    db.transaction(() => rows.forEach(o => st.run(clean(c, o))))();
    r.json({ ok: rows.length });
  });
  router.put(`/${t}/:id`, (q, r) => {
    validate(t, q.body);
    db.prepare(`UPDATE ${t} SET ${c.map(x => `${x}=@${x}`)} WHERE id=@id`).run({ ...clean(c, q.body), id: q.params.id });
    r.json({ ok: 1 });
  });
  router.delete(`/${t}/:id`, (q, r) => { db.prepare(`DELETE FROM ${t} WHERE id=?`).run(q.params.id); r.json({ ok: 1 }); });
}
module.exports = router;
