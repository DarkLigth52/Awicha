// Utilidades y estado global
const $=s=>document.querySelector(s),Bs=n=>'Bs '+(+n||0).toLocaleString('es-BO',{minimumFractionDigits:2,maximumFractionDigits:2});
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const hoy=()=>{const d=new Date();return new Date(d-d.getTimezoneOffset()*6e4).toISOString().slice(0,10)};
let tok=localStorage.tok,cur='dash',edit=null,qv='',draft=[],day=hoy(),role,rate=6.96,mon=hoy().slice(0,7),D={movements:[],debts:[],products:[],parties:[],dishes:[],sales:[],audit:[],settings:{}};
