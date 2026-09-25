export default async function handler(req,res){
 if(req.method!=='GET')return res.status(405).json({error:'Method not allowed'});
 if(!process.env.STRIPE_SECRET_KEY||!process.env.ADMIN_KEY)return res.status(503).json({error:'Admin is not configured'});
 if(req.query?.key!==process.env.ADMIN_KEY)return res.status(401).json({error:'Unauthorized'});
 try{
  const qs=new URLSearchParams({limit:'100'}); const r=await fetch('https://api.stripe.com/v1/checkout/sessions?'+qs,{headers:{Authorization:'Bearer '+process.env.STRIPE_SECRET_KEY}}); const j=await r.json();
  if(!r.ok)return res.status(r.status).json({error:j.error?.message||'Stripe error'});
  const rows=(j.data||[]).map(s=>({id:s.id,email:s.customer_details?.email||'',amount:(s.amount_total||0)/100,currency:s.currency,paid:s.payment_status,created:new Date(s.created*1000).toISOString(),product:s.metadata?.product_id||s.metadata?.kind||'support'}));
  return res.status(200).json({count:rows.length,total:rows.filter(x=>x.paid==='paid').reduce((a,x)=>a+x.amount,0),sales:rows});
 }catch(e){return res.status(500).json({error:e.message})}
}