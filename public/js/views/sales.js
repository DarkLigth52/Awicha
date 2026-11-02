// Ventas de platos: descuentan los insumos de la receta y registran el ingreso
function sales(){const pay='<option value="caja">Caja</option><option value="banco">Banco / QR</option><option value="credito">A crédito</option>';
 return `<h2>Ventas</h2><p style="color:var(--mute)">Al registrar una venta se descuentan los insumos de la receta y se anota el ingreso.</p>
 <form id="sf" class="w"><div><label>Plato</label><select name="dish">${D.dishes.map(d=>`<option value="${d.id}">${esc(d.name)} — ${Bs(d.price)}</option>`).join('')}</select></div>
 <div><label>Porciones</label><input name="qty" type="number" step="any" value="1" required></div><div><label>Pago</label><select name="account">${pay}</select></div>
 <div><label>Cliente</label><input name="party" list="pl"></div><datalist id="pl">${D.parties.map(p=>`<option>${esc(p.name)}</option>`).join('')}</datalist>
 <div><label>Fecha</label><input name="date" type="date" value="${hoy()}"></div><div><label>Vence (si es a crédito)</label><input name="due" type="date"></div><button class="go">Registrar venta</button></form>
 <h2>Últimas ventas</h2><div class="tw"><table><tr><th>Fecha</th><th>Plato</th><th>Porciones</th><th>Total</th><th>Pago</th></tr>${D.sales.slice(0,15).map(s=>`<tr><td>${esc(s.date)}</td><td>${esc(s.dish)}</td><td class="n">${s.qty}</td><td class="n">${Bs(s.total)}</td><td>${esc(s.account)}</td></tr>`).join('')||'<tr><td colspan="5">Aún no hay ventas.</td></tr>'}</table></div>`}
