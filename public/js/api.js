// Comunicación con el servidor
async function api(p,m='GET',b){const r=await fetch('/api/'+p,{method:m,headers:{'Content-Type':'application/json',Authorization:'Bearer '+tok},body:b&&JSON.stringify(b)});
 if(r.status===401&&p!=='login'){logout();throw 0}const j=await r.json();if(!r.ok)throw j.error;return j}
function logout(){localStorage.removeItem('tok');location.reload()}
