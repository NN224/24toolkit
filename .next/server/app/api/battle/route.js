"use strict";(()=>{var e={};e.id=1156,e.ids=[1156],e.modules={72934:e=>{e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},92048:e=>{e.exports=require("fs")},32615:e=>{e.exports=require("http")},35240:e=>{e.exports=require("https")},55315:e=>{e.exports=require("path")},68621:e=>{e.exports=require("punycode")},76162:e=>{e.exports=require("stream")},17360:e=>{e.exports=require("url")},21764:e=>{e.exports=require("util")},6162:e=>{e.exports=require("worker_threads")},71568:e=>{e.exports=require("zlib")},87561:e=>{e.exports=require("node:fs")},84492:e=>{e.exports=require("node:stream")},72477:e=>{e.exports=require("node:stream/web")},26028:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>w,patchFetch:()=>h,requestAsyncStorage:()=>m,routeModule:()=>l,serverHooks:()=>f,staticGenerationAsyncStorage:()=>_});var o={};r.r(o),r.d(o,{POST:()=>d,dynamic:()=>u});var s=r(49303),a=r(88716),n=r(60670),i=r(87070),c=r(67972),p=r(11112);let u="force-dynamic";async function d(e){try{let{productA:t,productB:r}=await e.json();if(!t||!r)return i.NextResponse.json({error:"Both products are required"},{status:400});let o=await (0,c.Y)(t.trim(),r.trim()),s=!1,a="";try{let e={summary:o.summary,product_a_score:0,product_b_score:0,product_a_strengths:o.pros_cons.product1.pros,product_b_strengths:o.pros_cons.product2.pros,product_a_weaknesses:o.pros_cons.product1.cons,product_b_weaknesses:o.pros_cons.product2.cons,winner:"pending",recommendation:o.verdict.overall};await (0,p.JG)(o.product1.name,o.product2.name,o.category||"AI Generated",e),s=!0,a="Your comparison has been submitted for review and will be published after approval."}catch(e){console.error("[v0] Failed to save comparison to database:",e),s=!1,a="Database is not configured yet. Please contact admin to enable the moderation system. (See SUPABASE_MIGRATION_INSTRUCTIONS.md)"}let n={productA:o.product1.name,productB:o.product2.name,summary:o.summary,strengthsA:o.pros_cons.product1.pros,weaknessesA:o.pros_cons.product1.cons,strengthsB:o.pros_cons.product2.pros,weaknessesB:o.pros_cons.product2.cons,recommendation:o.verdict.overall,saved:s,message:a,fullComparison:o};return i.NextResponse.json(n)}catch(t){console.error("[v0] Error in battle API:",t);let e=t instanceof Error?t.message:"Failed to generate comparison";return i.NextResponse.json({error:e,fallback:"Our AI service is temporarily unavailable. Please try again in a moment."},{status:500})}}let l=new s.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/battle/route",pathname:"/api/battle",filename:"route",bundlePath:"app/api/battle/route"},resolvedPagePath:"/Users/nnh-ai-studio/Documents/ProductsVS/app/api/battle/route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:m,staticGenerationAsyncStorage:_,serverHooks:f}=l,w="/api/battle/route";function h(){return(0,n.patchFetch)({serverHooks:f,staticGenerationAsyncStorage:_})}},11112:(e,t,r)=>{r.d(t,{i:()=>i,Vj:()=>u,A3:()=>n,Yh:()=>d,MS:()=>c,JG:()=>p});var o=r(19692),s=r(43974);function a(){let e="https://opsesbjwcqxpcbpjgejw.supabase.co",t=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!e||!t)throw Error("Missing Supabase environment variables");return(0,s.eI)(e,t,{auth:{autoRefreshToken:!1,persistSession:!1}})}async function n(){let e=a(),{data:t,error:r}=await e.from("comparisons_dynamic").select("*").eq("status","pending").order("created_at",{ascending:!1});if(r)throw r;return t}async function i(e,t){let r=a(),{data:o,error:s}=await r.from("comparisons_dynamic").update({status:"approved",reviewed_by:t,approved_at:new Date().toISOString()}).eq("id",e).select().single();if(s)throw s;return o}async function c(e,t,r){let o=a(),{data:s,error:n}=await o.from("comparisons_dynamic").update({status:"rejected",reviewed_by:t,rejection_reason:r}).eq("id",e).select().single();if(n)throw n;return s}async function p(e,t,r,o,s){let n=a(),{data:i,error:c}=await n.from("comparisons_dynamic").insert({product_a:e,product_b:t,category:r,comparison_data:o,status:"pending",notification_email:s||null,views:0}).select().single();if(c)throw c;return i}async function u(e,t=["approved"]){let r=await (0,o.e)(),{data:s,error:a}=await r.from("comparisons_dynamic").select("*").in("status",t).order("created_at",{ascending:!1});if(a)return console.error("[v0] Error fetching comparison by slug:",a),null;let n=s?.find(t=>`${t.product_a.toLowerCase().replace(/\s+/g,"-")}-vs-${t.product_b.toLowerCase().replace(/\s+/g,"-")}`===e);if(!n)return null;let i=n.comparison_data.sections?n.comparison_data.sections.map(e=>({title:e.title,content:`${n.product_a}: ${e.product1_points.join(", ")}. ${n.product_b}: ${e.product2_points.join(", ")}.${"tie"!==e.winner?` Winner: ${"product1"===e.winner?n.product_a:n.product_b}.`:""}`})):[{title:"Overview",content:n.comparison_data.summary},{title:"Strengths & Weaknesses",content:`${n.product_a} excels in: ${n.comparison_data.product_a_strengths.join(", ")}. However, it has weaknesses in: ${n.comparison_data.product_a_weaknesses.join(", ")}. On the other hand, ${n.product_b} is strong in: ${n.comparison_data.product_b_strengths.join(", ")}, but struggles with: ${n.comparison_data.product_b_weaknesses.join(", ")}.`}];return{slug:e,title:`${n.product_a} vs ${n.product_b}`,description:n.comparison_data.summary,category:n.category,views:n.views?.toString()||"0",lastUpdated:new Date(n.updated_at).toLocaleDateString(),status:n.status,optionA:{name:n.product_a,pros:n.comparison_data.product_a_strengths},optionB:{name:n.product_b,pros:n.comparison_data.product_b_strengths},sections:i,verdict:n.comparison_data.recommendation,faqs:n.comparison_data.faqs}}async function d(e){let t=await (0,o.e)(),{data:r,error:s}=await t.from("comparisons_dynamic").select("*").eq("status","approved");if(s){console.error("[v0] Error fetching comparison for view increment:",s);return}let a=r?.find(t=>`${t.product_a.toLowerCase().replace(/\s+/g,"-")}-vs-${t.product_b.toLowerCase().replace(/\s+/g,"-")}`===e);if(!a)return;let{error:n}=await t.from("comparisons_dynamic").update({views:(a.views||0)+1}).eq("id",a.id);n&&console.error("[v0] Error incrementing views:",n)}},67972:(e,t,r)=>{r.d(t,{Y:()=>a});var o=r(43177);let s=null;async function a(e,t,r=null,a="en"){if(!e?.trim()||!t?.trim())throw Error("Both products are required");let n=r||function(e,t){let r=`${e} ${t}`.toLowerCase();for(let[e,t]of Object.entries({Technology:["phone","laptop","computer","tablet","watch","iphone","samsung","mac","pc","android","ios"],Streaming:["netflix","disney","hbo","hulu","prime","spotify","apple music","youtube"],Automotive:["car","suv","sedan","electric","gas","tesla","toyota","honda"],"E-commerce":["amazon","walmart","ebay","shopify","wix","target"],"Social Media":["facebook","instagram","tiktok","twitter","snapchat"],Travel:["airbnb","hotel","uber","lyft","booking","expedia"],"Health & Fitness":["gym","workout","diet","keto","paleo","vegan"],"Food & Beverage":["coffee","tea","matcha","energy drink"],Finance:["bitcoin","ethereum","crypto","stock","gold"]}))if(t.some(e=>r.includes(e)))return e;return"General"}(e,t),i=`You are an expert product comparison analyst.

Compare these two products in comprehensive detail:
- Product 1: ${e}
- Product 2: ${t}
- Category: ${n}

Provide a detailed, objective comparison including:

1. SUMMARY (2-3 sentences overview)

2. KEY SPECIFICATIONS TABLE
   Compare main specs side-by-side

3. DETAILED COMPARISON SECTIONS:
   - Design & Build Quality
   - Performance & Features  
   - User Experience
   - Value for Money

4. PROS AND CONS
   List 5 pros and 5 cons for each product

5. FINAL VERDICT
   - Overall recommendation
   - Best for Product 1: (3 use cases)
   - Best for Product 2: (3 use cases)

6. FAQs (10 questions with detailed answers)

IMPORTANT:
- Be objective and balanced
- Use real specs and features
- Be detailed and helpful
- Format response as clean JSON

JSON STRUCTURE:
{
  "product1": { "name": "${e}", "brand": "", "image": "" },
  "product2": { "name": "${t}", "brand": "", "image": "" },
  "category": "${n}",
  "summary": "",
  "comparison_sections": [
    {
      "title": "",
      "product1_points": [],
      "product2_points": [],
      "winner": "product1" | "product2" | "tie"
    }
  ],
  "pros_cons": {
    "product1": { "pros": [], "cons": [] },
    "product2": { "pros": [], "cons": [] }
  },
  "verdict": {
    "overall": "",
    "best_for_product1": [],
    "best_for_product2": []
  },
  "faqs": [
    { "question": "", "answer": "" }
  ]
}`,c=function(){let e=process.env.GROQ_API_KEY;if(!e)throw Error("GROQ_API_KEY is not configured. Please add it to your environment variables.");return s||(s=new o.ZP({apiKey:e})),s}(),p=null;for(let e=1;e<=3;e++)try{let e=await c.chat.completions.create({messages:[{role:"system",content:"You are an expert product comparison analyst. Always respond with valid JSON only."},{role:"user",content:i}],model:"llama-3.3-70b-versatile",temperature:.7,max_tokens:4e3,response_format:{type:"json_object"}}),t=e.choices[0]?.message?.content;if(!t)throw Error("No response from AI");let r=JSON.parse(t);if(!(r&&"object"==typeof r&&r.product1&&r.product2&&r.summary&&Array.isArray(r.comparison_sections)&&r.pros_cons&&r.verdict&&Array.isArray(r.faqs)))throw Error("Invalid response structure from AI");return r}catch(t){console.error(`[v0] Groq API attempt ${e} failed:`,t),p=t,e<3&&await new Promise(t=>setTimeout(t,1e3*e))}throw Error(`Failed to generate comparison after 3 attempts: ${p?.message}`)}},19692:(e,t,r)=>{r.d(t,{e:()=>a});var o=r(67721),s=r(71615);async function a(){let e=await (0,s.cookies)();return(0,o.createServerClient)("https://opsesbjwcqxpcbpjgejw.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wc2VzYmp3Y3F4cGNicGpnZWp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1Nzc0ODksImV4cCI6MjA3NzE1MzQ4OX0.NH7cf9AEoYWL2GOG_700x_GtihhPfB8CEezDeSlDjZA",{cookies:{getAll:()=>e.getAll(),setAll(t){try{t.forEach(({name:t,value:r,options:o})=>e.set(t,r,o))}catch{}}}})}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),o=t.X(0,[8948,5972,9702,3177],()=>r(26028));module.exports=o})();