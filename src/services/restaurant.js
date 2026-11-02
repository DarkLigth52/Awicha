// Lógica de negocio del restaurante: ventas de platos (descuentan insumos) y compras de insumos
const db = require('../db'), { HttpError } = require('../errors');
const today = () => new Date().toLocaleDateString('sv');
const parse = s => { try { const a = JSON.parse(s || '[]'); return Array.isArray(a) ? a : []; } catch { return []; } };
const MOV = 'INSERT INTO movements(date,type,account,category,description,amount,currency) VALUES(?,?,?,?,?,?,?)';
const DEBT = 'INSERT INTO debts(kind,party,description,amount,paid,due) VALUES(?,?,?,?,0,?)';
const PAY = ['caja', 'banco', 'credito'];

function sellDish({ dish, qty, account, party, date, due }) {
  const n = Number(qty), d = db.prepare('SELECT * FROM dishes WHERE id=?').get(dish);
  if (!d) throw new HttpError(400, 'Plato no encontrado');
  if (!(n > 0)) throw new HttpError(400, 'Cantidad inválida');
  if (!PAY.includes(account)) throw new HttpError(400, 'Forma de pago inválida');
  const recipe = parse(d.recipe), when = date || today(), total = d.price * n, desc = `Venta ${n} x ${d.name}`;
  const buy = new Map(db.prepare('SELECT id,buy FROM products').all().map(p => [p.id, p.buy]));
  const cost = recipe.reduce((s, r) => s + r.qty * (buy.get(r.id) || 0), 0) * n;
  db.transaction(() => {
    const dec = db.prepare('UPDATE products SET stock=stock-? WHERE id=?');
    recipe.forEach(r => dec.run(r.qty * n, r.id));
    db.prepare('INSERT INTO sales(date,dish,qty,total,cost,account) VALUES(?,?,?,?,?,?)').run(when, d.name, n, total, cost, account);
    if (account === 'credito') db.prepare(DEBT).run('cobrar', party || '', desc, total, due || '');
    else db.prepare(MOV).run(when, 'ingreso', account, 'Ventas', desc, total, 'Bs');
  })();
  const ids = recipe.map(r => r.id);
  const low = ids.length ? db.prepare(`SELECT name FROM products WHERE stock<=min AND id IN (${ids.map(() => '?')})`).all(...ids).map(p => p.name) : [];
  return { total, cost, low };
}

function buyProduct({ product, qty, cost, account, party, date, due }) {
  const n = Number(qty), c = Number(cost), p = db.prepare('SELECT * FROM products WHERE id=?').get(product);
  if (!p) throw new HttpError(400, 'Insumo no encontrado');
  if (!(n > 0) || !(c >= 0)) throw new HttpError(400, 'Revisa cantidad y costo');
  if (!PAY.includes(account)) throw new HttpError(400, 'Forma de pago inválida');
  const when = date || today(), total = n * c, desc = `Compra ${n} ${p.unit} de ${p.name}`;
  db.transaction(() => {
    db.prepare('UPDATE products SET stock=stock+?, buy=? WHERE id=?').run(n, c, p.id);
    if (account === 'credito') db.prepare(DEBT).run('pagar', party || '', desc, total, due || '');
    else db.prepare(MOV).run(when, 'egreso', account, 'Insumos', desc, total, 'Bs');
  })();
  return { total };
}
module.exports = { sellDish, buyProduct };
