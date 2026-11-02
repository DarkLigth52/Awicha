// Compras de insumos: suman stock, actualizan el costo y registran el gasto
function purchases(){
 return `<h2>Compras de insumos</h2><p style="color:var(--mute)">Cada compra suma al stock, actualiza el costo por unidad y registra el gasto (o la cuenta por pagar).</p>
 <form id="pf" class="w"><div><label>Insumo</label><select name="product">${D.products.map(p=>`<option value="${p.id}">${esc(p.name)} (${esc(p.unit)}) — stock ${p.stock}</option>`).join('')}</select></div>
 <div><label>Cantidad</label><input name="qty" type="number" step="any" required></div><div><label>Costo por unidad (Bs)</label><input name="cost" type="number" step="any" required></div>
 <div><label>Pago</label><select name="account"><option value="caja">Caja</option><option value="banco">Banco</option><option value="credito">A crédito</option></select></div>
 <div><label>Proveedor</label><input name="party" list="pv"></div><datalist id="pv">${D.parties.filter(p=>p.type==='proveedor').map(p=>`<option>${esc(p.name)}</option>`).join('')}</datalist>
 <div><label>Fecha</label><input name="date" type="date" value="${hoy()}"></div><div><label>Vence (si es a crédito)</label><input name="due" type="date"></div><button class="go">Registrar compra</button></form>`}
