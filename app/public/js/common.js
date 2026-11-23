const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)],inr=n=>'₹'+Math.round(n).toLocaleString('en-IN');
async function api(p,o={}){const r=await fetch('/api'+p,{method:o.method||(o.body?'POST':'GET'),headers:{'content-type':'application/json',...(o.headers||{})},body:o.body?JSON.stringify(o.body):undefined});
 const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.error||'Something went wrong. Please try again.');return j}
function toast(m){let t=$('#toast');if(!t){t=document.createElement('div');t.id='toast';t.setAttribute('role','status');document.body.append(t)}t.textContent=m;t.style.display='block';clearTimeout(t._t);t._t=setTimeout(()=>t.style.display='none',3600)}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let _cat;const catalog=()=>_cat||(_cat=api('/catalog'));
(function(){const L=[['/','Home'],['/book','Book'],['/track','Track'],['/play','Play'],['/club','Wag Club']],p=location.pathname.replace(/\.html$/,'').replace(/\/$/,'')||'/';
 const h=document.createElement('header');h.className='pill';h.innerHTML=`<a class="logo" href="/"><img src="/assets/logo.svg" alt="">Pawshift</a><nav aria-label="Main">${L.map(l=>`<a href="${l[0]}" ${l[0]===p?'aria-current="page"':''}>${l[1]}</a>`).join('')}</nav><a class="cta" href="/book">Book a visit</a>`;document.body.prepend(h)})();
