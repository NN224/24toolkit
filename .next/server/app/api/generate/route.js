"use strict";(()=>{var e={};e.id=8290,e.ids=[8290],e.modules={72934:e=>{e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},92048:e=>{e.exports=require("fs")},32615:e=>{e.exports=require("http")},35240:e=>{e.exports=require("https")},55315:e=>{e.exports=require("path")},68621:e=>{e.exports=require("punycode")},76162:e=>{e.exports=require("stream")},17360:e=>{e.exports=require("url")},21764:e=>{e.exports=require("util")},6162:e=>{e.exports=require("worker_threads")},71568:e=>{e.exports=require("zlib")},87561:e=>{e.exports=require("node:fs")},84492:e=>{e.exports=require("node:stream")},72477:e=>{e.exports=require("node:stream/web")},56098:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>b,patchFetch:()=>R,requestAsyncStorage:()=>w,routeModule:()=>h,serverHooks:()=>x,staticGenerationAsyncStorage:()=>y});var s={};t.r(s),t.d(s,{POST:()=>_,dynamic:()=>g});var o=t(49303),a=t(88716),n=t(60670),i=t(87070),c=t(67972),u=t(11112),p=t(47118),d=t(19692);let l=new Map;setInterval(()=>{let e=Date.now();for(let[r,t]of l.entries())t.resetTime<e&&l.delete(r)},3e5);var m=t(43782);let g="force-dynamic";function f(e){return e.toLowerCase().trim().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-")}async function v(e){let r=(0,p.Vj)(e);if(r)return{exists:!0,status:"approved",data:r};try{let r=await (0,d.e)(),{data:t,error:s}=await r.from("comparisons_dynamic").select("*").or(`product_a.eq.${e.split("-vs-")[0]},product_b.eq.${e.split("-vs-")[1]}`).or(`product_a.eq.${e.split("-vs-")[1]},product_b.eq.${e.split("-vs-")[0]}`).single();if(t)return{exists:!0,status:t.status,data:t}}catch(e){}return{exists:!1}}async function _(e){try{var r,t;let s;if(!process.env.GROQ_API_KEY)return console.error("[v0] GROQ_API_KEY is not configured"),i.NextResponse.json({success:!1,error:"AI service is not configured. Please add GROQ_API_KEY to environment variables.",code:"MISSING_API_KEY"},{status:500});let o=e.headers.get("x-forwarded-for")||e.headers.get("x-real-ip")||"unknown",a=function(e,r={maxRequests:10,windowMs:36e5}){let t=Date.now(),s=l.get(e);if(!s||s.resetTime<t){let s=t+r.windowMs;return l.set(e,{count:1,resetTime:s}),{allowed:!0,remaining:r.maxRequests-1,resetTime:s}}return s.count>=r.maxRequests?{allowed:!1,remaining:0,resetTime:s.resetTime}:(s.count++,{allowed:!0,remaining:r.maxRequests-s.count,resetTime:s.resetTime})}(o,{maxRequests:5,windowMs:36e5});if(!a.allowed){let e=(r=a.remaining,t=a.resetTime,{"X-RateLimit-Remaining":r.toString(),"X-RateLimit-Reset":new Date(t).toISOString()});return i.NextResponse.json({success:!1,error:"Rate limit exceeded. Maximum 5 generations per hour.",code:"RATE_LIMIT_EXCEEDED"},{status:429,headers:e})}let{product1:n,product2:p,category:d,language:g="en",email:_,notifyOnApproval:h=!1}=await e.json(),w=(0,m.ZU)(n),y=(0,m.ZU)(p),x=null;if(_)try{x=(0,m.H3)(_)}catch(e){return i.NextResponse.json({success:!1,error:"Invalid email format",code:"INVALID_EMAIL"},{status:400})}let b=w?.trim()&&y?.trim()?w.length<3||w.length>100?{valid:!1,error:"Product 1 name must be between 3 and 100 characters"}:y.length<3||y.length>100?{valid:!1,error:"Product 2 name must be between 3 and 100 characters"}:w.toLowerCase().trim()===y.toLowerCase().trim()?{valid:!1,error:"Products must be different"}:(0,m.yw)(w)||(0,m.yw)(y)?{valid:!1,error:"Invalid product names"}:{valid:!0}:{valid:!1,error:"Both products are required"};if(!b.valid)return i.NextResponse.json({success:!1,error:b.error,code:"INVALID_INPUT"},{status:400});let R=function(e,r){let[t,s]=[f(e),f(r)].sort();return`${t}-vs-${s}`}(w,y),q=await v(R);if(q.exists){if("approved"===q.status)return i.NextResponse.json({success:!0,status:"approved",message:"This comparison already exists!",slug:R,data:q.data});if("pending"===q.status)return i.NextResponse.json({success:!0,status:"pending",message:"This comparison has already been submitted and is under review.",estimated_review_time:"24-48 hours"})}try{s=await (0,c.Y)(w,y,d,g)}catch(r){console.error("[v0] AI generation failed:",r);let e=r instanceof Error?r.message:"Unknown error";return i.NextResponse.json({success:!1,error:`Failed to generate comparison: ${e}. Please try again or contact support.`,code:"AI_ERROR"},{status:500})}let A={summary:s.summary,product_a_score:85,product_b_score:82,product_a_strengths:s.pros_cons.product1.pros,product_b_strengths:s.pros_cons.product2.pros,product_a_weaknesses:s.pros_cons.product1.cons,product_b_weaknesses:s.pros_cons.product2.cons,winner:s.verdict.overall.toLowerCase().includes(w.toLowerCase())?w:y,recommendation:s.verdict.overall,sections:s.comparison_sections,faqs:s.faqs},I=!1;try{await (0,u.JG)(w,y,s.category,A,x||void 0),I=!0}catch(e){console.error("[v0] Database save failed:",e)}return i.NextResponse.json({success:!0,status:I?"pending":"generated",message:"Comparison generated successfully!",slug:R,comparisonUrl:`/comparison/${R}`,isPending:I,data:{title:`${w} vs ${y}`,optionA:{name:w},optionB:{name:y},summary:s.summary,product_a_score:85,product_b_score:82,product_a_strengths:s.pros_cons.product1.pros,product_b_strengths:s.pros_cons.product2.pros,product_a_weaknesses:s.pros_cons.product1.cons,product_b_weaknesses:s.pros_cons.product2.cons,recommendation:s.verdict.overall,sections:s.comparison_sections,faqs:s.faqs,category:s.category}})}catch(r){console.error("[v0] Generate API error:",r);let e=r instanceof Error?r.message:"Unknown error occurred";return i.NextResponse.json({success:!1,error:`An unexpected error occurred: ${e}. Please try again.`,code:"INTERNAL_ERROR",details:void 0},{status:500})}}let h=new o.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/generate/route",pathname:"/api/generate",filename:"route",bundlePath:"app/api/generate/route"},resolvedPagePath:"/Users/nnh-ai-studio/Documents/ProductsVS/app/api/generate/route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:w,staticGenerationAsyncStorage:y,serverHooks:x}=h,b="/api/generate/route";function R(){return(0,n.patchFetch)({serverHooks:x,staticGenerationAsyncStorage:y})}},67972:(e,r,t)=>{t.d(r,{Y:()=>a});var s=t(43177);let o=null;async function a(e,r,t=null,a="en"){if(!e?.trim()||!r?.trim())throw Error("Both products are required");let n=t||function(e,r){let t=`${e} ${r}`.toLowerCase();for(let[e,r]of Object.entries({Technology:["phone","laptop","computer","tablet","watch","iphone","samsung","mac","pc","android","ios"],Streaming:["netflix","disney","hbo","hulu","prime","spotify","apple music","youtube"],Automotive:["car","suv","sedan","electric","gas","tesla","toyota","honda"],"E-commerce":["amazon","walmart","ebay","shopify","wix","target"],"Social Media":["facebook","instagram","tiktok","twitter","snapchat"],Travel:["airbnb","hotel","uber","lyft","booking","expedia"],"Health & Fitness":["gym","workout","diet","keto","paleo","vegan"],"Food & Beverage":["coffee","tea","matcha","energy drink"],Finance:["bitcoin","ethereum","crypto","stock","gold"]}))if(r.some(e=>t.includes(e)))return e;return"General"}(e,r),i=`You are an expert product comparison analyst.

Compare these two products in comprehensive detail:
- Product 1: ${e}
- Product 2: ${r}
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
  "product2": { "name": "${r}", "brand": "", "image": "" },
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
}`,c=function(){let e=process.env.GROQ_API_KEY;if(!e)throw Error("GROQ_API_KEY is not configured. Please add it to your environment variables.");return o||(o=new s.ZP({apiKey:e})),o}(),u=null;for(let e=1;e<=3;e++)try{let e=await c.chat.completions.create({messages:[{role:"system",content:"You are an expert product comparison analyst. Always respond with valid JSON only."},{role:"user",content:i}],model:"llama-3.3-70b-versatile",temperature:.7,max_tokens:4e3,response_format:{type:"json_object"}}),r=e.choices[0]?.message?.content;if(!r)throw Error("No response from AI");let t=JSON.parse(r);if(!(t&&"object"==typeof t&&t.product1&&t.product2&&t.summary&&Array.isArray(t.comparison_sections)&&t.pros_cons&&t.verdict&&Array.isArray(t.faqs)))throw Error("Invalid response structure from AI");return t}catch(r){console.error(`[v0] Groq API attempt ${e} failed:`,r),u=r,e<3&&await new Promise(r=>setTimeout(r,1e3*e))}throw Error(`Failed to generate comparison after 3 attempts: ${u?.message}`)}},43782:(e,r,t)=>{function s(e,r=500){if("string"!=typeof e)return"";let t=e.replace(/\0/g,"");return(t=t.trim()).length>r&&(t=t.substring(0,r)),t}function o(e){let r=s(e,254);if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r))throw Error("Invalid email format");return r.toLowerCase()}function a(e){return s(e,100).replace(/[<>"'`]/g,"")}function n(e){return[/viagra|cialis|pharmacy/i,/\b(buy|cheap|discount)\s+(now|here|online)\b/i,/click\s+here/i,/\$\$\$/,/http[s]?:\/\/[^\s]{50,}/i,/(.)\1{10,}/].some(r=>r.test(e))}t.d(r,{H3:()=>o,ZU:()=>a,yw:()=>n})}};var r=require("../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),s=r.X(0,[8948,5972,9702,3177,3820],()=>t(56098));module.exports=s})();