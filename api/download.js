function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
async function catalog(req){const base=process.env.PUBLIC_URL||('https://'+req.headers.host);const r=await fetch(base+'/catalog/catalog.json');if(!r.ok)throw new Error('Catalog unavailable');return r.json()}
export default async function handler(req,res){
 if(req.method!=='GET')return res.status(405).json({error:'Method not allowed'});
 try{
  const data=await catalog(req);
  let id=Number(req.query?.product_id||0),sessionId=String(req.query?.session_id||'');
  if(sessionId){
   if(!process.env.STRIPE_SECRET_KEY)return res.status(503).json({error:'Stripe is not configured yet'});
   if(!/^cs_/.test(sessionId))return res.status(400).json({error:'Invalid session'});
   const r=await fetch('https://api.stripe.com/v1/checkout/sessions/'+encodeURIComponent(sessionId),{headers:{Authorization:'Bearer '+process.env.STRIPE_SECRET_KEY}});
   const s=await r.json();if(!r.ok)return res.status(r.status).json({error:s.error?.message||'Stripe error'});
   if(s.payment_status!=='paid')return res.status(403).json({error:'Payment not completed'});
   id=Number(s.metadata?.product_id||0);
  }
  const p=data.products.find(x=>x.id===id);
  if(!p)return res.status(404).json({error:'Product not found'});
  if(p.pricing!=='free'&&!sessionId)return res.status(402).json({error:'Purchase required'});
  const trTitle=p.title.replace(/Starter/g,'Başlangıç').replace(/Quickstart/g,'Hızlı Başlangıç').replace(/Master Pack/g,'Master Paket').replace(/Toolkit/g,'Araç Seti').replace(/Planner/g,'Planlayıcı').replace(/Service/g,'Hizmeti').replace(/Vorlage/g,'Şablonu');
  const categoryTr=(data.categories.find(x=>x.slug===p.category)?.bilingual||p.category).split(' / ').pop();
  const html='<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(p.title)+' — AI Commerce OS</title><style>body{font-family:Inter,system-ui,sans-serif;background:#f5f6f8;color:#15171b;margin:0;padding:40px}.sheet{max-width:820px;margin:auto;background:#fff;border:1px solid #e3e6eb;border-radius:24px;padding:42px;box-shadow:0 20px 60px #1111}h1{font-size:42px;line-height:1;margin:10px 0 24px}.tag{display:inline-block;background:#111;color:#fff;border-radius:999px;padding:7px 11px;font-size:12px;font-weight:800}.lang{display:grid;grid-template-columns:1fr 1fr;gap:18px}.box{background:#f6f7f9;border-radius:16px;padding:18px}li{margin:9px 0}.foot{margin-top:30px;padding-top:20px;border-top:1px solid #e5e7eb;color:#68717c;font-size:13px}@media(max-width:650px){body{padding:14px}.sheet{padding:24px}.lang{grid-template-columns:1fr}h1{font-size:32px}}</style></head><body><main class="sheet"><span class="tag">✦ AI COMMERCE OS · #'+String(p.id).padStart(3,'0')+'</span><h1>'+esc(p.title)+'</h1><p><b>🇩🇪 '+esc(p.category)+'</b> · <b>🇹🇷 '+esc(categoryTr)+'</b></p><div class="lang"><section class="box"><h2>🇩🇪 Deutsch</h2><p>'+esc(p.description)+'</p><h3>Enthalten</h3><ul><li>Schritt-für-Schritt Anleitung</li><li>Checkliste für die direkte Anwendung</li><li>Vorlagen / Prompts / Arbeitsstruktur</li><li>DE + TR Nutzungshinweise</li></ul><h3>So nutzt du es</h3><p>Öffne das Produkt, arbeite die Schritte in Reihenfolge durch und passe die Vorlagen an deinen Fall an.</p></section><section class="box"><h2>🇹🇷 Türkçe</h2><p>'+esc(trTitle)+' — '+esc(p.description)+'</p><h3>İçerik</h3><ul><li>Adım adım kullanım rehberi</li><li>Doğrudan uygulanabilir kontrol listesi</li><li>Şablonlar / promptlar / çalışma yapısı</li><li>DE + TR kullanım notları</li></ul><h3>Nasıl kullanılır?</h3><p>Ürünü aç, adımları sırayla uygula ve şablonları kendi durumuna göre düzenle.</p></section></div><div class="foot">AI Commerce OS · Digitale Produkte für Deutschland · DE × TR · Dieses Dokument wurde für den direkten digitalen Gebrauch erstellt.</div></main></body></html>';
  res.setHeader('Content-Type','text/html; charset=utf-8');res.setHeader('Content-Disposition','attachment; filename="'+p.slug+'.html"');return res.status(200).send(html);
 }catch(e){return res.status(500).json({error:e.message||'Server error'})}
}