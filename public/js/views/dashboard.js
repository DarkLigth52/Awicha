// Balance, gráfico y estado de resultados
function bal(acc){return D.movements.filter(m=>m.account===acc).reduce((s,m)=>s+(m.type==='ingreso'?1:-1)*toBs(m),0)}
const toBs=m=>m.currency==='USD'?m.amount*rate:m.amount;
function mt(ym,t,c){return D.movements.filter(m=>m.date.startsWith(ym)&&m.type===t&&m.category!=='Transferencia'&&(!c||m.category===c)).reduce((s,m)=>s+toBs(m),0)}
function dash(){const caja=bal('caja'),banco=bal('banco'),pend=k=>D.debts.filter(d=>d.kind===k).reduce((s,d)=>s+d.amount-d.paid,0);
 const inv=D.products.reduce((s,p)=>s+p.stock*p.buy,0),low=D.products.filter(p=>p.stock<=p.min).length,cc=pend('cobrar'),cp=pend('pagar'),k=(l,v,c='')=>`<div class="kpi ${c}"><small>${l}</small><b>${v}</b></div>`;
 const ms=[...Array(6)].map((_,i)=>{const d=new Date();d.setDate(1);d.setMonth(d.getMonth()-5+i);return d.toISOString().slice(0,7)}),mx=Math.max(1,...ms.flatMap(m=>[mt(m,'ingreso'),mt(m,'egreso')]));
 const bars=ms.map((m,i)=>{const a=mt(m,'ingreso')/mx*130,b=mt(m,'egreso')/mx*130,x=20+i*95;return `<rect x="${x}" y="${150-a}" width="32" height="${a}" fill="var(--ok)"/><rect x="${x+36}" y="${150-b}" width="32" height="${b}" fill="var(--bad)"/><text x="${x+34}" y="170" text-anchor="middle" font-size="12" fill="var(--mute)">${m.slice(5)}/${m.slice(2,4)}</text>`}).join('');
 const cats=[...new Set(D.movements.filter(m=>m.date.startsWith(mon)&&m.category!=='Transferencia').map(m=>m.category))],
 crow=cats.map(c=>`<tr><td>${esc(c)||'Sin categoría'}</td><td class="n">${Bs(mt(mon,'ingreso',c))}</td><td class="n">${Bs(mt(mon,'egreso',c))}</td></tr>`).join('')||'<tr><td colspan="3">Sin movimientos en este mes.</td></tr>';
 const ds=D.sales.filter(s=>s.date===day),sv=a=>ds.filter(s=>!a||s.account===a).reduce((x,s)=>x+s.total,0),dc=ds.reduce((x,s)=>x+s.cost,0),dg=D.movements.filter(m=>m.date===day&&m.type==='egreso'&&m.category!=='Transferencia').reduce((x,m)=>x+toBs(m),0);
 const tops=Object.entries(D.sales.filter(s=>s.date.startsWith(mon)).reduce((o,s)=>(o[s.dish]=(o[s.dish]||0)+s.qty,o),{})).sort((a,b)=>b[1]-a[1]).slice(0,5);
 const dayBlock=`<div class="row"><h2>Cierre del día</h2><input type="date" value="${day}" onchange="day=this.value;render()" style="max-width:170px"></div><div class="grid">${k('Ventas del día',Bs(sv()))}${k('Cobrado en caja',Bs(sv('caja')))}${k('Cobrado en banco',Bs(sv('banco')))}${k('Ventas a crédito',Bs(sv('credito')))}${k('Gastos del día',Bs(dg))}${k('Costo de insumos vendidos',Bs(dc))}${k('Margen bruto',sv()?Math.round((1-dc/sv())*100)+'%':'—')}</div>`;
 const topBlock=`<h2 style="margin-top:20px">Platos más vendidos del mes</h2><div class="tw"><table><tr><th>Plato</th><th>Porciones</th></tr>${tops.map(t=>`<tr><td>${esc(t[0])}</td><td class="n">${t[1]}</td></tr>`).join('')||'<tr><td colspan="2">Aún no hay ventas este mes.</td></tr>'}</table></div>`;
 return `<div class="row"><h2>Balance general</h2><button class="act" onclick="print()" style="margin-left:auto">Imprimir PDF</button></div>
 <div class="grid">${k('Total disponible (caja + banco)',Bs(caja+banco),'big')}${k('En caja',Bs(caja))}${k('En banco',Bs(banco))}</div>
 <div class="grid">${k('Por cobrar',Bs(cc))}${k('Por pagar',Bs(cp))}${k('Valor de insumos',Bs(inv))}${k('Insumos con stock bajo',low)}${k('Patrimonio neto',Bs(caja+banco+cc+inv-cp))}</div>
 <p style="color:var(--mute)">Patrimonio neto = caja + banco + por cobrar + inventario − por pagar. Dólares convertidos a Bs ${rate}.</p>
 ${dayBlock}${topBlock}<h2 style="margin-top:20px">Últimos 6 meses</h2><div class="tw"><svg viewBox="0 0 600 180" width="100%"><line x1="10" x2="590" y1="150" y2="150" stroke="var(--line)"/>${bars}</svg></div>
 <p style="color:var(--mute)"><b class="pos">■</b> Ingresos <b class="neg">■</b> Egresos (sin transferencias)</p>
 <div class="row"><h2>Estado de resultados</h2><input type="month" value="${mon}" onchange="mon=this.value;render()" style="max-width:170px"></div>
 <div class="grid">${k('Ingresos',Bs(mt(mon,'ingreso')))}${k('Egresos',Bs(mt(mon,'egreso')))}${k('Resultado del mes',Bs(mt(mon,'ingreso')-mt(mon,'egreso')))}</div>
 <div class="tw"><table><tr><th>Categoría</th><th>Ingresos</th><th>Egresos</th></tr>${crow}</table></div>`}
