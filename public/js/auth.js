// Inicio de sesión y navegación
$('#lb').onclick=async()=>{try{const j=await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({user:$('#lu').value,pass:$('#lp').value})});const d=await j.json();if(!j.ok)throw d.error;tok=d.token;localStorage.tok=tok;localStorage.role=d.role;start()}catch(e){$('#msg').textContent=e}};
['#lu','#lp'].forEach(id=>$(id).addEventListener('keydown',e=>{if(e.key==='Enter')$('#lb').click()}));$('#out').onclick=logout;
document.querySelectorAll('nav [data-v]').forEach(b=>b.onclick=()=>{cur=b.dataset.v;edit=null;draft=[];qv='';render()});
