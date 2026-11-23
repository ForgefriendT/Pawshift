const express=require('express'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const app=express();app.disable('x-powered-by');app.use(express.json({limit:'20kb'}));
app.use(express.static(path.join(__dirname,'public'),{extensions:['html']}));
const DB=process.env.DB_FILE||path.join(__dirname,'data','db.json'),ADMIN=process.env.ADMIN_KEY||'pawshift';
let db={bookings:[],scores:[],leads:[]};try{db={...db,...JSON.parse(fs.readFileSync(DB,'utf8'))}}catch(e){}
const save=()=>{fs.mkdirSync(path.dirname(DB),{recursive:true});fs.writeFileSync(DB+'.tmp',JSON.stringify(db));fs.renameSync(DB+'.tmp',DB)};
/* ---------- catalog: the single source of truth for prices ---------- */
const ANIMALS={dog:{n:'Dog',sized:1},cat:{n:'Cat',sized:1},rabbit:{n:'Rabbit'},guinea:{n:'Guinea pig'},bird:{n:'Bird'},fish:{n:'Fish'}};
const ALL=['dog','cat','rabbit','guinea','bird','fish'],SM=['rabbit','guinea','bird'];
const SV=[{id:'fg',n:'Full groom',d:'Bath, haircut, nails, ears',p:1499,sz:1,a:['dog','cat']},{id:'bb',n:'Basic bath & brush',d:'Wash, dry, brush',p:799,sz:1,a:['dog','cat']},
{id:'sp',n:'Spa add-on',d:'Teeth clean and de-shed',p:499,a:['dog','cat']},{id:'mg',n:'Nail, coat & hygiene tidy',d:'Gentle small-pet grooming at home',p:399,a:SM},
{id:'wk',n:'Walk (30 min)',d:'Leash, water, photo update',p:250,a:['dog']},{id:'di',n:'Drop-in visit (30 min)',d:'Feed, litter, play, update',p:350,a:['dog','cat']},
{id:'sv',n:'Small-pet home visit',d:'Feed, clean cage, handle, update',p:300,a:SM},{id:'tk',n:'Tank care visit',d:'Feed, water check, filter and glass clean',p:450,a:['fish']},
{id:'dc',n:'Day care (8 hours)',d:'Supervised play and rest',p:700,a:['dog','cat']},{id:'ov',n:'Overnight sitting',d:'Stay-in care at your home',p:1200,a:['dog','cat']},
{id:'so',n:'Small-pet overnight',d:'Overnight check-ins and care',p:800,a:SM},{id:'tx',n:'Pet taxi (per trip)',d:'Door to groomer or vet',p:300,a:['dog','cat','rabbit','guinea','bird']}];
const PLANS={pay:{n:'Pay as you go',off:0,min:0},plus:{n:'Plus',off:.10,min:4},pro:{n:'Pro',off:.18,min:8}},COUPONS={WELCOME10:.10,PAWS5:.05};
const MUL=[1,1.3,1.7],SLOTS=['7:00 - 9:00 am','12:00 - 2:00 pm','4:00 - 6:00 pm','7:00 - 9:00 pm'];
const STAGES=['Booking confirmed','Carer assigned','Carer on the way','Visit in progress','Photo update sent','Completed'];
const CARERS=['Meera','Rohan','Sana','Dev','Isha','Kabir'],TIERS=[['Pup',0],['Good Boy',200],['Top Dog',600],['Pack Leader',1500]];
function quote(b){const an=ANIMALS[b.animal];if(!an)throw new Error('Choose an animal');const size=an.sized?Math.min(2,Math.max(0,parseInt(b.size)||0)):0;
 const lines=[];let sub=0,n=0;for(const s of SV){const q=Math.min(20,Math.max(0,parseInt((b.items||{})[s.id])||0));if(!q||!s.a.includes(b.animal))continue;const u=s.sz?Math.round(s.p*MUL[size]):s.p;lines.push({id:s.id,n:s.n,q,u,t:q*u});sub+=q*u;n+=q}
 if(!n)throw new Error('Add at least one service');const pl=PLANS[b.plan]||PLANS.pay,po=n>=pl.min?pl.off:0,co=COUPONS[String(b.coupon||'').toUpperCase()]||0,off=Math.max(po,co);
 const note=co&&co>=po?`Coupon ${String(b.coupon).toUpperCase()} applied`:po?`${pl.n} plan applied`:pl.off?`Add ${pl.min-n} more booking(s) to unlock ${pl.n} pricing`:'';
 return{lines,subtotal:sub,discount:Math.round(sub*off),total:sub-Math.round(sub*off),note,n}}
const str=(v,min,max,name)=>{v=String(v||'').trim();if(v.length<min||v.length>max)throw new Error(`${name} must be ${min}-${max} characters`);return v};
const view=b=>({id:b.id,owner:b.owner,pet:b.pet,animal:b.animal,date:b.date,slot:b.slot,address:b.address,lines:b.lines,total:b.total,status:b.status,stage:b.stage,events:b.events,payment:b.payment,carer:b.carer,stages:STAGES});
const wrap=f=>(q,s,n)=>{try{f(q,s,n)}catch(e){s.status(400).json({error:e.message})}};
const find=id=>db.bookings.find(b=>b.id===String(id).toUpperCase());
app.get('/api/health',(q,s)=>s.json({ok:true}));
app.get('/api/catalog',(q,s)=>s.json({animals:ANIMALS,services:SV,plans:PLANS,slots:SLOTS,stages:STAGES,tiers:TIERS}));
app.post('/api/quote',wrap((q,s)=>s.json(quote(q.body))));
app.post('/api/bookings',wrap((q,s)=>{const b=q.body,qu=quote(b),date=String(b.date||''),today=new Date().toISOString().slice(0,10);
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||date<today)throw new Error('Pick a date from today onwards');if(!SLOTS.includes(b.slot))throw new Error('Pick a time slot');
 const phone=String(b.phone||'').replace(/\D/g,'').slice(-10);if(phone.length!==10)throw new Error('Enter a 10-digit phone number');
 const id='PS-'+crypto.randomBytes(3).toString('hex').toUpperCase();
 const bk={id,owner:str(b.owner,2,60,'Your name'),phone,pet:str(b.pet,1,40,"Pet's name"),animal:b.animal,address:str(b.address,5,140,'Address'),date,slot:b.slot,lines:qu.lines,total:qu.total,status:'awaiting_payment',stage:-1,events:[],payment:null,created:Date.now(),
 carer:CARERS[parseInt(id.slice(3,5),16)%CARERS.length]};db.bookings.push(bk);save();s.status(201).json(view(bk))}));
app.post('/api/bookings/:id/pay',wrap((q,s)=>{const b=find(q.params.id);if(!b)return s.status(404).json({error:'Booking not found'});
 if(b.payment)return s.json(view(b));const m=q.body.method;if(!['upi','card','cash'].includes(m))throw new Error('Choose a payment method');
 b.payment={txn:'TXN'+crypto.randomBytes(5).toString('hex').toUpperCase(),method:m,amount:b.total,at:Date.now(),demo:true};b.status='paid';b.stage=0;b.events.push({stage:0,at:Date.now()});save();s.json(view(b))}));
app.get('/api/bookings/:id',(q,s)=>{const b=find(q.params.id);b?s.json(view(b)):s.status(404).json({error:'No booking with that ID'})});
app.post('/api/bookings/:id/advance',(q,s)=>{const b=find(q.params.id);if(!b)return s.status(404).json({error:'Booking not found'});if(!b.payment)return s.status(400).json({error:'Pay first to start tracking'});
 if(b.stage<5){b.stage++;b.events.push({stage:b.stage,at:Date.now()});if(b.stage===5)b.status='completed';save()}s.json(view(b))});
app.get('/api/club/:phone',(q,s)=>{const p=String(q.params.phone).replace(/\D/g,'').slice(-10),L=db.bookings.filter(b=>b.phone===p&&b.payment);
 const w=L.reduce((a,b)=>a+Math.floor(b.total/10),0),i=TIERS.reduce((a,t,j)=>w>=t[1]?j:a,0);s.json({wags:w,tier:TIERS[i][0],next:TIERS[i+1]||null,bookings:L.map(b=>({id:b.id,pet:b.pet,total:b.total,date:b.date}))})});
app.get('/api/scores',(q,s)=>s.json(db.scores.sort((a,b)=>b.score-a.score).slice(0,10)));
app.post('/api/scores',wrap((q,s)=>{const sc=Math.floor(+q.body.score);if(!(sc>=0&&sc<=500))throw new Error('Invalid score');const name=str(q.body.name,1,16,'Name').replace(/[<>]/g,'');
 db.scores.push({name,score:sc,at:Date.now()});db.scores=db.scores.sort((a,b)=>b.score-a.score).slice(0,50);save();s.json({ok:true,coupon:sc>=20?'PAWS5':null})}));
app.post('/api/leads',wrap((q,s)=>{const l=q.body;db.leads.push({company:str(l.company,2,80,'Company'),contact:str(l.contact,2,60,'Contact name'),email:str(l.email,5,80,'Email'),size:String(l.size||'').slice(0,20),at:Date.now()});save();s.status(201).json({ok:true})}));
app.get('/api/admin',(q,s)=>{if(q.get('x-admin-key')!==ADMIN)return s.status(401).json({error:'Wrong admin key'});const P=db.bookings.filter(b=>b.payment);
 s.json({revenue:P.reduce((a,b)=>a+b.total,0),paid:P.length,unpaid:db.bookings.length-P.length,bookings:db.bookings.slice(-100).reverse().map(view),leads:db.leads.slice(-50).reverse()})});
app.use('/api',(q,s)=>s.status(404).json({error:'Not found'}));
app.use((e,q,s,n)=>s.status(400).json({error:'Bad request'}));
module.exports=app;if(require.main===module)app.listen(process.env.PORT||3000,()=>console.log('Pawshift running on http://localhost:'+(process.env.PORT||3000)));
