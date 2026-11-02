// Eventos de formularios y botones
function bindRB(){const ra=$('#ra');if(!ra)return;const paint=()=>{$('#rb').innerHTML=RBin();bindRB()};
 ra.onclick=()=>{const q=parseFloat($('#rq').value);if(q>0){draft.push({id:+$('#ri').value,qty:q});paint()}};
 document.querySelectorAll('[data-rm]').forEach(b=>b.onclick=()=>{draft.splice(+b.dataset.rm,1);paint()})}
function bind(){const f=$('#f');
 if(f)f.onsubmit=async e=>{e.preventDefault();try{const b=Object.fromEntries(new FormData(f));if(cur==='dishes')b.recipe=JSON.stringify(draft);if(edit)await api(`${cur}/${edit.r.id}`,'PUT',b);else await api(cur,'POST',b);edit=null;draft=[];await load();render()}catch(x){alert(x)}};
 const cx=$('#cx');if(cx)cx.onclick=()=>{edit=null;draft=[];render()};
 const q=$('#q');if(q)q.oninput=()=>{qv=q.value;render();const n=$('#q');n.focus();n.setSelectionRange(qv.length,qv.length)};
 document.querySelectorAll('[data-ed]').forEach(b=>b.onclick=()=>{edit={t:cur,r:D[cur].find(x=>x.id==b.dataset.ed)};if(cur==='dishes')draft=recipeOf(edit.r.recipe);scrollTo(0,0);render()});
 const post=(id,p,fn)=>{const x=$(id);if(x)x.onsubmit=async e=>{e.preventDefault();try{const j=await api(p,'POST',Object.fromEntries(new FormData(x)));await load();fn?fn(j):render()}catch(m){alert(m)}}};
 const pf=$('#pf');if(pf){const fill=()=>{const p=D.products.find(x=>x.id==pf.product.value);if(p)pf.cost.value=p.buy};pf.product.onchange=fill;fill()}
 bindRB();
 post('#tr','transfer');post('#sf','sales',j=>{alert('Venta registrada: '+Bs(j.total)+(j.low.length?'\nInsumos con stock bajo: '+j.low.join(', '):''));render()});post('#pf','purchases',()=>{alert('Compra registrada');render()});post('#rf','settings',()=>{rate=+D.settings.rate||6.96;render()});
 document.querySelectorAll('[data-del]').forEach(b=>b.onclick=async()=>{if(confirm('¿Borrar este registro?')){await api(`${cur}/${b.dataset.del}`,'DELETE');await load();render()}});
 document.querySelectorAll('[data-pay]').forEach(b=>b.onclick=async()=>{const r=D.debts.find(x=>x.id==b.dataset.pay),v=parseFloat(prompt(`Saldo ${Bs(r.amount-r.paid)}. ¿Cuánto se abona?`));
  if(v>0){await api('debts/'+r.id,'PUT',{...r,paid:r.paid+v});await load();render()}});
 document.querySelectorAll('[data-st]').forEach(b=>b.onclick=async()=>{const r=D.products.find(x=>x.id==b.dataset.st),v=parseFloat(prompt(`Stock actual ${r.stock}. Escribe + para entrada o − para salida (ej: 5 o -2)`));
  if(!isNaN(v)){await api('products/'+r.id,'PUT',{...r,stock:r.stock+v});await load();render()}});
 const bk=$('#bk');if(bk)bk.onclick=async()=>{const d=await api('backup'),a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(d,null,1)],{type:'application/json'}));a.download='respaldo-'+hoy()+'.json';a.click()};
 const im=$('#imp');if(im)im.onsubmit=async e=>{e.preventDefault();const fd=new FormData(im);try{const rows=csv(await fd.get('file').text());await api(fd.get('t'),'POST',rows);await load();alert(rows.length+' registros importados');cur=fd.get('t');render()}catch(x){alert('No se pudo importar: '+x)}};
 const pw=$('#pw');if(pw)pw.onsubmit=async e=>{e.preventDefault();try{await api('password','POST',Object.fromEntries(new FormData(pw)));alert('Contraseña guardada');pw.reset()}catch(x){alert(x)}}}
