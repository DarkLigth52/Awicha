// Arranque y dibujo de la pantalla
async function load(){for(const t in D)D[t]=await api(t)}
async function start(){try{await load()}catch{return}role=localStorage.role||'admin';document.body.classList.toggle('ro',role!=='admin');rate=+D.settings.rate||6.96;$('#login').hidden=true;$('#app').hidden=false;render()}
function render(){document.querySelectorAll('nav [data-v]').forEach(b=>b.classList.toggle('on',b.dataset.v===cur));
 $('#view').innerHTML=cur==='dash'?dash():cur==='tools'?tools():cur==='sales'?sales():cur==='purchases'?purchases():list(cur);bind()}
if(tok)start();
