// Tablas editables, columnas permitidas y reglas de validación
const { HttpError } = require('./errors');
const T = {
  movements: { cols: ['date', 'type', 'account', 'category', 'description', 'amount', 'currency'], req: ['date', 'type', 'account', 'amount'], pos: ['amount'],
    enums: { type: ['ingreso', 'egreso'], account: ['caja', 'banco'], currency: ['Bs', 'USD'] } },
  debts: { cols: ['kind', 'party', 'description', 'amount', 'paid', 'due'], req: ['kind', 'amount'], pos: ['amount', 'paid'], enums: { kind: ['cobrar', 'pagar'] } },
  products: { cols: ['name', 'unit', 'stock', 'min', 'buy'], req: ['name'], pos: ['min', 'buy'] },
  dishes: { cols: ['name', 'category', 'price', 'recipe'], req: ['name', 'price'], pos: ['price'], json: ['recipe'] },
  parties: { cols: ['name', 'type', 'phone', 'email'], req: ['name'], enums: { type: ['cliente', 'proveedor', 'empleado'] } }
};
const NUM = ['amount', 'paid', 'stock', 'min', 'buy', 'price'];
function validate(t, o) {
  const d = T[t], e = [];
  for (const k of d.req || []) if (o[k] === undefined || String(o[k]).trim() === '') e.push(`Falta el campo ${k}`);
  for (const [k, v] of Object.entries(d.enums || {})) if (o[k] && !v.includes(o[k])) e.push(`Valor inválido en ${k}`);
  for (const k of d.pos || []) if (o[k] !== undefined && !(Number(o[k]) >= 0)) e.push(`${k} debe ser un número positivo`);
  for (const k of d.json || []) if (o[k]) try { if (!Array.isArray(JSON.parse(o[k]))) throw 0; } catch { e.push(`${k} no es válido`); }
  if (e.length) throw new HttpError(400, e.join('. '));
}
module.exports = { T, NUM, validate };
