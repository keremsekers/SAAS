import crypto from 'node:crypto';
export default async function handler(req,res){
 if(req.method!=='GET') return res.status(405).json({error:'Method not allowed'});
 if(!process.env.STRIPE_SECRET_KEY) return res.status(503).json({error:'Stripe is not configured yet'});
 const sessionId=String(req.query?.session_id||''); if(!/^cs_/.test(sessionId)) return res.status(400).json({error:'Invalid session'});
 try{
  const r=await fetch('https://api.stripe.com/v1/checkout/sessions/'+encodeURIComponent(sessionId)+'?expand[]=line_items',{headers:{Authorization:'Bearer '+process.env.STRIPE_SECRET_KEY}});
  const s=await r.json(); if(!r.ok) return res.status(r.status).json({error:s.error?.message||'Stripe error'});
  if(s.payment_status!=='paid') return res.status(403).json({error:'Payment not completed'});
  const id=Number(s.metadata?.product_id); const p=PRODUCTS[id]; if(!p) return res.status(404).json({error:'Product not found'});
  if(p.pricing==='free') return res.redirect('/downloads/'+p.slug+'.html');
  const token=crypto.createHmac('sha256',process.env.DOWNLOAD_SECRET||process.env.STRIPE_SECRET_KEY).update(sessionId+'|'+id).digest('hex');
  return res.redirect('/downloads/'+p.slug+'.html?access='+token);
 }catch(e){return res.status(500).json({error:e.message})}
}