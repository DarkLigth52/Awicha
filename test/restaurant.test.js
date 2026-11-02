process.env.DB_PATH = ':memory:';
const test = require('node:test'), assert = require('node:assert/strict');
const db = require('../src/db'), svc = require('../src/services/restaurant');
const stock = id => db.prepare('SELECT stock FROM products WHERE id=?').get(id).stock;

test.beforeEach(() => {
  for (const t of ['movements', 'debts', 'sales', 'dishes', 'products']) db.exec(`DELETE FROM ${t}`);
  db.prepare("INSERT INTO products(id,name,unit,stock,min,buy) VALUES(1,'Arroz','kg',10,2,8)").run();
  db.prepare("INSERT INTO dishes(id,name,category,price,recipe) VALUES(1,'Arroz con pollo','Plato principal',30,?)").run(JSON.stringify([{ id: 1, qty: 0.2 }]));
});
test('vender un plato descuenta insumos y registra el ingreso', () => {
  const r = svc.sellDish({ dish: 1, qty: 3, account: 'caja', date: '2026-10-15' });
  assert.equal(r.total, 90);
  assert.ok(Math.abs(stock(1) - 9.4) < 1e-9);
  assert.equal(db.prepare("SELECT SUM(amount) a FROM movements WHERE type='ingreso'").get().a, 90);
});
test('una venta a crédito crea cuenta por cobrar y no toca la caja', () => {
  svc.sellDish({ dish: 1, qty: 1, account: 'credito', party: 'Ana', date: '2026-10-15' });
  assert.equal(db.prepare("SELECT COUNT(*) n FROM debts WHERE kind='cobrar'").get().n, 1);
  assert.equal(db.prepare('SELECT COUNT(*) n FROM movements').get().n, 0);
});
test('avisa los insumos que quedan con stock bajo', () => {
  assert.deepEqual(svc.sellDish({ dish: 1, qty: 40, account: 'caja' }).low, ['Arroz']);
});
test('comprar un insumo suma stock, actualiza el costo y registra el egreso', () => {
  svc.buyProduct({ product: 1, qty: 5, cost: 9, account: 'banco' });
  assert.equal(stock(1), 15);
  assert.equal(db.prepare('SELECT buy FROM products WHERE id=1').get().buy, 9);
  assert.equal(db.prepare("SELECT SUM(amount) a FROM movements WHERE type='egreso'").get().a, 45);
});
test('rechaza cantidades y pagos inválidos', () => {
  assert.throws(() => svc.sellDish({ dish: 1, qty: 0, account: 'caja' }), /Cantidad/);
  assert.throws(() => svc.sellDish({ dish: 1, qty: 1, account: 'otro' }), /pago/);
});
