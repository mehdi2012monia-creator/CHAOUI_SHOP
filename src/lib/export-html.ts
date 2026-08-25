import type { Product } from "@/db/schema";
import { SITE_DESCRIPTION, SITE_NAME } from "./site";

type BuildOptions = {
  products: Product[];
  categories: string[];
  shippingFee: number;
  freeThreshold: number;
  apiBase: string;
  whatsapp: string;
  phone: string;
  /** الصور مرفقة بجانب الملف (حزمة GitHub) */
  localImages?: boolean;
};

/**
 * يبني نسخة HTML مستقلة بالكامل من المتجر (ملف واحد بدون أي اعتماد خارجي)
 * صالحة للصق في Google Sites أو رفعها على أي استضافة ثابتة.
 */
export function buildStoreHtml(opts: BuildOptions): string {
  const {
    products,
    categories,
    shippingFee,
    freeThreshold,
    apiBase,
    whatsapp,
    phone,
    localImages = false,
  } = opts;

  const data = {
    products: products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      oldPrice: p.oldPrice,
      // نحفظ المسار كما هو ونحوّله لرابط كامل وقت العرض
      // حتى لا تنكسر الصور إذا تغيّر عنوان المتجر
      image: p.image,
      category: p.category,
      stock: p.stock,
      featured: p.featured,
    })),
    categories,
    shippingFee,
    freeThreshold,
    apiBase,
    whatsapp,
    phone,
    localImages,
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: apiBase,
    currenciesAccepted: "MAD",
    paymentAccepted: "الدفع عند الاستلام",
    areaServed: { "@type": "Country", name: "المغرب" },
  };

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${SITE_NAME} — متجر المواد المنزلية والإلكترونيات</title>
<meta name="description" content="${SITE_DESCRIPTION}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lalezar&family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{
--paper:#f5f2ea;--paper2:#ece7da;--ink:#0e1726;--maj:#2a4edb;--maj2:#1d3fbf;--maj-l:#e3e9fc;
--saf:#ffb524;--saf2:#f5a300;--saf-l:#fff1d6;--mint:#16835a;--mint-l:#dff3e8;--dan:#d64545;
}
body{font-family:'Tajawal',sans-serif;background:var(--paper);color:var(--ink);-webkit-font-smoothing:antialiased;overflow-x:hidden}
img{display:block;max-width:100%}
button{font-family:inherit;cursor:pointer;border:none;background:none;color:inherit}
input,select,textarea{font-family:inherit;width:100%;border:1px solid rgba(14,23,38,.15);background:#fff;border-radius:9px;padding:10px 14px;font-size:14px;outline:none;transition:.2s}
input:focus,select:focus,textarea:focus{border-color:var(--maj);box-shadow:0 0 0 3px rgba(42,78,219,.15)}
.wrap{max-width:1200px;margin:0 auto;padding:0 16px}
.disp{font-family:'Lalezar',cursive;font-weight:400}
.press{transition:.15s}.press:active{transform:scale(.97)}
/* ticker */
.ticker{background:var(--saf);overflow:hidden;direction:ltr}
.ticker-in{display:flex;width:max-content;animation:mq 30s linear infinite}
.ticker span{padding:8px 26px;font-size:13px;font-weight:700;white-space:nowrap}
@keyframes mq{from{transform:translateX(0)}to{transform:translateX(-50%)}}
/* header */
header{position:sticky;top:0;z-index:40;background:rgba(245,242,234,.92);backdrop-filter:blur(10px);border-bottom:1px solid rgba(14,23,38,.1)}
.hrow{display:flex;align-items:center;gap:16px;padding:14px 0}
.logo{font-family:'Lalezar',cursive;font-size:26px;letter-spacing:.5px}
.logo em{color:var(--saf2);font-style:normal}
.srch{position:relative;flex:1;max-width:520px}
.srch input{border-radius:999px;padding-left:44px}
.srch button{position:absolute;left:5px;top:5px;width:32px;height:32px;border-radius:999px;background:var(--ink);color:var(--paper);display:grid;place-items:center}
.cartbtn{position:relative;width:44px;height:44px;border-radius:10px;border:1px solid rgba(14,23,38,.15);background:#fff;display:grid;place-items:center;margin-right:auto}
.cartbtn:hover{border-color:var(--maj);color:var(--maj2)}
.badge{position:absolute;top:-6px;left:-6px;min-width:20px;height:20px;padding:0 5px;border-radius:999px;background:var(--maj2);color:#fff;font-size:11px;font-weight:800;display:grid;place-items:center}
.chips{display:flex;gap:8px;overflow-x:auto;padding-bottom:12px;scrollbar-width:none}
.chips::-webkit-scrollbar{display:none}
.chip{flex-shrink:0;border:1px solid rgba(14,23,38,.15);background:#fff;color:rgba(14,23,38,.65);border-radius:999px;padding:7px 16px;font-size:13px;font-weight:700;transition:.2s}
.chip:hover{border-color:rgba(14,23,38,.4);color:var(--ink)}
.chip.on{background:var(--ink);color:var(--paper);border-color:var(--ink)}
/* hero */
.hero{position:relative;overflow:hidden;padding:48px 0 56px}
.hero:before{content:'';position:absolute;top:-120px;right:-120px;width:360px;height:360px;border-radius:50%;background:rgba(255,209,102,.3);filter:blur(60px)}
.hero:after{content:'';position:absolute;bottom:-60px;left:-80px;width:300px;height:300px;border-radius:50%;background:rgba(195,207,248,.5);filter:blur(60px)}
.hgrid{position:relative;display:grid;gap:40px;align-items:center}
@media(min-width:900px){.hgrid{grid-template-columns:1.05fr .95fr}}
.pill{display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(14,23,38,.1);background:#fff;border-radius:999px;padding:7px 16px;font-size:12px;font-weight:800;color:rgba(14,23,38,.7)}
.dot{width:8px;height:8px;border-radius:50%;background:var(--saf2)}
h1.big{font-family:'Lalezar',cursive;font-size:clamp(44px,7vw,72px);line-height:1.05;margin-top:18px}
h1.big u{color:var(--maj2);text-decoration:none;position:relative}
h1.big u:after{content:'';position:absolute;bottom:-2px;right:0;width:100%;height:6px;border-radius:4px;background:var(--saf)}
.lead{margin-top:18px;font-size:17px;line-height:1.85;color:rgba(14,23,38,.65);max-width:520px}
.cta{display:flex;flex-wrap:wrap;gap:12px;margin-top:28px}
.btn1{background:var(--maj2);color:#fff;border-radius:10px;padding:14px 28px;font-size:14px;font-weight:800;box-shadow:0 10px 24px -8px rgba(29,63,191,.6);transition:.2s}
.btn1:hover{background:#17339e}
.btn2{border:2px solid rgba(14,23,38,.15);background:#fff;border-radius:10px;padding:12px 22px;font-size:14px;font-weight:800;transition:.2s}
.btn2:hover{border-color:var(--saf2);color:var(--saf2)}
.perks{display:flex;flex-wrap:wrap;gap:10px 26px;margin-top:32px;list-style:none}
.perks li{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:700;color:rgba(14,23,38,.7)}
.tick{width:20px;height:20px;border-radius:50%;background:var(--saf-l);color:var(--saf2);display:grid;place-items:center;font-size:11px;font-weight:900}
.arch{border-radius:999px 999px 26px 26px;overflow:hidden;border:7px solid #fff;box-shadow:0 30px 60px -20px rgba(14,23,38,.45);aspect-ratio:4/5;background:var(--paper2)}
.arch img{width:100%;height:100%;object-fit:cover}
.archwrap{position:relative;max-width:400px;margin:0 auto}
.float{position:absolute;background:#fff;border-radius:14px;padding:12px;box-shadow:0 18px 40px -14px rgba(14,23,38,.35);display:flex;align-items:center;gap:12px;animation:fl 5.5s ease-in-out infinite}
@keyframes fl{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
/* sections */
section.pad{padding:52px 0}
.shead{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap}
.kicker{font-size:12px;font-weight:800;color:var(--saf2);letter-spacing:.3px}
h2.sec{font-family:'Lalezar',cursive;font-size:clamp(32px,5vw,46px);margin-top:6px}
.count{border:1px solid rgba(14,23,38,.1);background:#fff;border-radius:999px;padding:6px 16px;font-size:12px;font-weight:800;color:rgba(14,23,38,.6)}
.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-top:26px}
@media(min-width:700px){.grid{grid-template-columns:repeat(3,1fr)}}
@media(min-width:1050px){.grid{grid-template-columns:repeat(4,1fr)}}
/* card */
.card{background:#fff;border:1px solid rgba(14,23,38,.1);border-radius:14px;overflow:hidden;transition:.3s;display:flex;flex-direction:column}
.card:hover{transform:translateY(-6px);box-shadow:0 20px 42px -16px rgba(14,23,38,.32)}
.cimg{position:relative;aspect-ratio:1;background:var(--paper2);overflow:hidden}
.cimg img{width:100%;height:100%;object-fit:cover;transition:.5s}
.card:hover .cimg img{transform:scale(1.06)}
.off{position:absolute;top:12px;right:12px;background:var(--saf);border-radius:7px;padding:4px 8px;font-size:11px;font-weight:800}
.oos{position:absolute;inset:0;background:rgba(14,23,38,.55);display:grid;place-items:center}
.oos span{background:#fff;border-radius:7px;padding:6px 12px;font-size:12px;font-weight:800}
.cbody{padding:14px;display:flex;flex-direction:column;flex:1}
.ccat{font-size:11px;font-weight:800;color:rgba(42,78,219,.8)}
.cname{font-size:14px;font-weight:700;line-height:1.55;margin-top:4px;min-height:44px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.crow{display:flex;align-items:flex-end;justify-content:space-between;gap:8px;margin-top:10px}
.price{font-size:17px;font-weight:800}
.old{font-size:12px;font-weight:700;color:rgba(14,23,38,.35);text-decoration:line-through;margin-right:6px}
.addb{width:38px;height:38px;border-radius:10px;background:var(--ink);color:var(--paper);display:grid;place-items:center;flex-shrink:0;transition:.2s}
.addb:hover{background:var(--maj2)}
.addb:disabled{opacity:.35;cursor:not-allowed}
/* trust */
.trust{background:var(--ink);color:var(--paper)}
.tgrid{display:grid;grid-template-columns:repeat(2,1fr);gap:26px 16px;padding:40px 0}
@media(min-width:900px){.tgrid{grid-template-columns:repeat(4,1fr)}}
.titem{display:flex;align-items:center;gap:14px}
.tico{width:46px;height:46px;border-radius:11px;background:rgba(255,181,36,.15);color:var(--saf);display:grid;place-items:center;font-size:20px;flex-shrink:0}
.titem b{display:block;font-size:14px}
.titem small{color:rgba(245,242,234,.5);font-size:12px}
/* footer */
footer{background:var(--ink);color:rgba(245,242,234,.65);padding:48px 0 0}
.fgrid{display:grid;gap:32px;padding-bottom:40px}
@media(min-width:820px){.fgrid{grid-template-columns:1.6fr 1fr 1.2fr}}
footer h4{font-family:'Lalezar',cursive;font-size:20px;color:var(--paper);margin-bottom:14px}
footer p,footer li{font-size:14px;line-height:1.9}
footer ul{list-style:none}
.fbtns{display:flex;gap:10px;margin-top:18px;flex-wrap:wrap}
.fb1{border:1px solid rgba(255,255,255,.15);border-radius:9px;padding:9px 15px;font-size:12px;font-weight:700;color:var(--paper);text-decoration:none;transition:.2s}
.fb1:hover{border-color:var(--saf);color:var(--saf)}
.fb2{background:var(--saf);color:var(--ink);border-radius:9px;padding:9px 15px;font-size:12px;font-weight:800;text-decoration:none}
.fbot{border-top:1px solid rgba(255,255,255,.1);padding:18px 0;font-size:12px;font-weight:700;color:rgba(245,242,234,.45);display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px}
/* drawer */
.ov{position:fixed;inset:0;background:rgba(14,23,38,.6);backdrop-filter:blur(3px);z-index:50;opacity:0;visibility:hidden;transition:.3s}
.ov.on{opacity:1;visibility:visible}
.dw{position:fixed;top:0;bottom:0;left:0;width:100%;max-width:430px;background:var(--paper);z-index:51;display:flex;flex-direction:column;transform:translateX(-100%);transition:transform .3s;box-shadow:0 0 60px rgba(0,0,0,.3)}
.dw.on{transform:translateX(0)}
.dwh{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid rgba(14,23,38,.1)}
.dwh h3{font-size:17px;font-weight:800;display:flex;align-items:center;gap:10px}
.xb{width:34px;height:34px;border-radius:9px;color:rgba(14,23,38,.5);display:grid;place-items:center;font-size:20px}
.xb:hover{background:rgba(14,23,38,.06);color:var(--ink)}
.dwb{flex:1;overflow-y:auto;padding:16px 20px}
.dwf{border-top:1px solid rgba(14,23,38,.1);background:#fff;padding:16px 20px}
.line{display:flex;gap:12px;background:#fff;border:1px solid rgba(14,23,38,.1);border-radius:13px;padding:11px;margin-bottom:12px}
.line img{width:74px;height:74px;border-radius:9px;object-fit:cover;flex-shrink:0}
.lname{font-size:13px;font-weight:700;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.qty{display:inline-flex;align-items:center;gap:4px;border:1px solid rgba(14,23,38,.1);background:#fff;border-radius:9px;padding:3px}
.qty button{width:26px;height:26px;border-radius:6px;background:rgba(14,23,38,.05);display:grid;place-items:center;font-size:15px;font-weight:800}
.qty button:hover{background:rgba(14,23,38,.1)}
.qty span{min-width:26px;text-align:center;font-size:13px;font-weight:800}
.bar{height:6px;border-radius:99px;background:rgba(14,23,38,.1);overflow:hidden;margin-top:8px}
.bar i{display:block;height:100%;background:var(--saf);border-radius:99px;transition:.5s}
dl.tot{margin-top:14px;font-size:14px}
dl.tot div{display:flex;justify-content:space-between;padding:3px 0;color:rgba(14,23,38,.7)}
dl.tot div.g{border-top:1px dashed rgba(14,23,38,.15);margin-top:8px;padding-top:10px;font-size:16px;font-weight:800;color:var(--ink)}
.fbtn{width:100%;border-radius:10px;padding:14px;font-size:14px;font-weight:800;margin-top:14px;background:var(--maj2);color:#fff;box-shadow:0 10px 22px -8px rgba(29,63,191,.55);transition:.2s}
.fbtn:hover{background:#17339e}
.fbtn.dark{background:var(--ink);box-shadow:none}
.fbtn.dark:hover{background:var(--maj2)}
.fbtn:disabled{opacity:.6}
label.lb{display:block;font-size:12px;font-weight:800;color:rgba(14,23,38,.6);margin:0 0 6px}
.fld{margin-bottom:14px}
.err{color:var(--dan);font-size:11px;font-weight:700;margin-top:4px}
.note{display:flex;gap:10px;align-items:center;background:var(--saf-l);color:#8a5b00;border-radius:9px;padding:12px 14px;font-size:12px;font-weight:700}
.empty{text-align:center;padding:60px 0}
.empty .ico{width:78px;height:78px;border-radius:50%;background:rgba(14,23,38,.05);color:rgba(14,23,38,.3);display:grid;place-items:center;margin:0 auto 16px;font-size:32px}
.done{text-align:center;padding:40px 24px}
.done .ok{width:92px;height:92px;border-radius:50%;background:var(--mint-l);color:var(--mint);display:grid;place-items:center;margin:0 auto;font-size:44px;animation:pop .4s cubic-bezier(.2,1.6,.4,1)}
@keyframes pop{from{transform:scale(.4)}to{transform:scale(1)}}
.ref{border:2px dashed rgba(245,163,0,.6);background:rgba(255,241,214,.6);border-radius:13px;padding:16px 28px;margin-top:20px;display:inline-block}
.ref b{display:block;font-size:24px;font-weight:800;letter-spacing:1px;color:#17339e;direction:ltr}
.toast{position:fixed;bottom:22px;left:16px;z-index:70;display:flex;flex-direction:column;gap:8px}
.toast div{background:var(--ink);color:var(--paper);border-radius:10px;padding:12px 16px;font-size:13px;font-weight:700;box-shadow:0 14px 30px -10px rgba(0,0,0,.5);animation:rise .4s}
@keyframes rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
.logo{user-select:none;-webkit-user-select:none}
/* ===== لوحة التحكم داخل الملف ===== */
#adm{position:fixed;inset:0;z-index:90;background:var(--paper);display:none;flex-direction:column;overflow:hidden}
#adm.on{display:flex}
.ahead{background:var(--ink);color:var(--paper);padding:14px 20px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
.ahead .logo{color:var(--paper);font-size:23px}
.atabs{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none}
.atabs::-webkit-scrollbar{display:none}
.atab{flex-shrink:0;border-radius:9px;padding:8px 15px;font-size:13px;font-weight:800;color:rgba(245,242,234,.55);transition:.2s;white-space:nowrap}
.atab:hover{background:rgba(255,255,255,.08);color:var(--paper)}
.atab.on{background:var(--saf);color:var(--ink)}
.abody{flex:1;overflow-y:auto;padding:20px;background:var(--paper)}
.astats{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
@media(min-width:800px){.astats{grid-template-columns:repeat(4,1fr)}}
.astat{background:#fff;border:1px solid rgba(14,23,38,.1);border-radius:13px;padding:18px}
.astat i{display:grid;place-items:center;width:42px;height:42px;border-radius:10px;font-size:19px;font-style:normal}
.astat small{display:block;font-size:11px;font-weight:800;color:rgba(14,23,38,.45);margin-top:14px}
.astat b{display:block;font-family:'Lalezar',cursive;font-weight:400;font-size:29px;line-height:1.1;margin-top:3px}
.acard{background:#fff;border:1px solid rgba(14,23,38,.1);border-radius:13px;margin-top:16px;overflow:hidden}
.acard>h4{padding:14px 16px;border-bottom:1px solid rgba(14,23,38,.1);font-size:15px;font-weight:800}
.atbl{width:100%;border-collapse:collapse;font-size:13px}
.atbl th{background:rgba(245,242,234,.7);text-align:right;padding:11px 14px;font-size:11px;font-weight:800;color:rgba(14,23,38,.5);white-space:nowrap}
.atbl td{padding:11px 14px;border-top:1px solid rgba(14,23,38,.07);vertical-align:middle}
.atbl tr:hover td{background:rgba(245,242,234,.45)}
.scroll{overflow-x:auto}
.st{border:0;border-radius:7px;padding:6px 9px;font-size:11px;font-weight:800;cursor:pointer;outline:none}
.pill2{border-radius:6px;padding:3px 8px;font-size:11px;font-weight:800;display:inline-block}
.mini{width:74px;padding:6px 8px;font-size:12px;font-weight:800;text-align:center;border-radius:7px}
.iconb{width:30px;height:30px;border-radius:7px;display:grid;place-items:center;font-size:14px;color:rgba(14,23,38,.45);transition:.2s}
.iconb:hover{background:rgba(14,23,38,.07);color:var(--ink)}
.thumb{width:42px;height:42px;border-radius:8px;object-fit:cover;border:1px solid rgba(14,23,38,.1)}
.det{background:rgba(245,242,234,.6)}
.det .box{background:#fff;border:1px solid rgba(14,23,38,.1);border-radius:11px;padding:14px;margin:0 0 12px;display:grid;gap:14px}
@media(min-width:760px){.det .box{grid-template-columns:1.4fr 1fr}}
.mrow{display:flex;align-items:center;gap:10px;padding:5px 0}
.abtn{background:var(--maj2);color:#fff;border-radius:9px;padding:10px 18px;font-size:13px;font-weight:800;transition:.2s}
.abtn:hover{background:#17339e}
.abtn.gray{background:#fff;color:var(--ink);border:1px solid rgba(14,23,38,.15)}
.abtn.gray:hover{border-color:rgba(14,23,38,.4)}
.modal{position:fixed;inset:0;z-index:95;background:rgba(14,23,38,.62);backdrop-filter:blur(3px);display:none;overflow-y:auto;padding:18px}
.modal.on{display:block}
.mbox{max-width:620px;margin:22px auto;background:var(--paper);border-radius:14px;box-shadow:0 30px 60px -20px rgba(0,0,0,.5);animation:rise .35s}
.mbox>h4{padding:16px 20px;border-bottom:1px solid rgba(14,23,38,.1);font-size:16px;font-weight:800;display:flex;justify-content:space-between;align-items:center}
.mbody{padding:20px}
.f2{display:grid;gap:14px}
@media(min-width:620px){.f2.c3{grid-template-columns:repeat(3,1fr)}.f2.c2{grid-template-columns:repeat(2,1fr)}}
.chk{display:flex;align-items:center;gap:9px;font-size:13px;font-weight:700}
.chk input{width:17px;height:17px;accent-color:var(--maj2);padding:0}
</style>
</head>
<body>

<div class="ticker"><div class="ticker-in" id="tk"></div></div>

<header>
  <div class="wrap">
    <div class="hrow">
      <div class="logo" id="logo" title="MEHDISHOP">MEHDI<em>SHOP</em></div>
      <div class="srch">
        <input id="q" type="search" placeholder="ابحث عن منتج، جهاز، فكرة لدارك...">
        <button aria-label="بحث">🔍</button>
      </div>
      <button class="cartbtn press" id="openCart" aria-label="السلة">🛒<span class="badge" id="cnt" style="display:none">0</span></button>
    </div>
    <div class="chips" id="chips"></div>
  </div>
</header>

<section class="hero">
  <div class="wrap hgrid">
    <div>
      <span class="pill"><span class="dot"></span> متجر مغربي 100% — نوصلو لجميع المدن</span>
      <h1 class="big">دارك تستاهل <u>الأحسن</u></h1>
      <p class="lead">تجهيزات المنزل، المطبخ، وأحدث الإلكترونيات بأثمنة مناسبة وجودة مضمونة. اختار منتجاتك، وخلّص غير ملي يوصلك الطلب لباب الدار.</p>
      <div class="cta">
        <button class="btn1 press" onclick="document.getElementById('products').scrollIntoView({behavior:'smooth'})">تسوق الآن</button>
        <button class="btn2 press" onclick="setCat('عروض خاصة')">🔥 عروض اليوم</button>
      </div>
      <ul class="perks">
        <li><span class="tick">✓</span> الدفع عند الاستلام</li>
        <li><span class="tick">✓</span> توصيل 24–48 ساعة</li>
        <li><span class="tick">✓</span> إرجاع خلال 7 أيام</li>
      </ul>
    </div>
    <div class="archwrap">
      <div class="arch"><img src="https://images.pexels.com/photos/38147593/pexels-photo-38147593.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" alt="ديكور مغربي عصري"></div>
      <div class="float" style="left:-14px;bottom:44px;background:var(--ink);color:var(--paper)">
        <span style="width:36px;height:36px;border-radius:9px;background:var(--saf);color:var(--ink);display:grid;place-items:center">🚚</span>
        <span><b style="font-size:14px">توصيل مجاني</b><br><small style="color:rgba(245,242,234,.6);font-size:11px">للطلبات فوق ${freeThreshold} د.م</small></span>
      </div>
    </div>
  </div>
</section>

<section class="pad" id="products" style="background:rgba(236,231,218,.5);scroll-margin-top:80px">
  <div class="wrap">
    <div class="shead">
      <div><span class="kicker">كتالوج المتجر</span><h2 class="sec">كل المنتجات</h2></div>
      <span class="count" id="cnt2">0 منتج</span>
    </div>
    <div class="grid" id="grid"></div>
  </div>
</section>

<section class="trust">
  <div class="wrap tgrid">
    <div class="titem"><span class="tico">🚚</span><span><b>توصيل سريع</b><small>24 إلى 48 ساعة لجميع المدن</small></span></div>
    <div class="titem"><span class="tico">💵</span><span><b>الدفع عند الاستلام</b><small>خلّص غير ملي توصلك السلعة</small></span></div>
    <div class="titem"><span class="tico">🛡️</span><span><b>جودة مضمونة</b><small>منتجات أصلية 100% مع الضمان</small></span></div>
    <div class="titem"><span class="tico">🎧</span><span><b>دعم 6 أيام</b><small>فريقنا جاهز للرد على استفساراتك</small></span></div>
  </div>
</section>

<footer>
  <div class="wrap fgrid">
    <div>
      <div class="logo" id="logo2" style="color:var(--paper)">MEHDI<em>SHOP</em></div>
      <p style="margin-top:14px;max-width:330px">متجر مغربي متخصص في المواد المنزلية والإلكترونيات. نختارو ليك أحسن المنتجات بأثمنة مناسبة، مع التوصيل لجميع المدن والدفع عند الاستلام.</p>
      <div class="fbtns">
        <a class="fb1" href="tel:${phone}">📞 اتصل بنا</a>
        <a class="fb2" href="https://wa.me/${whatsapp}" target="_blank" rel="noreferrer">💬 واتساب</a>
      </div>
    </div>
    <div>
      <h4>الأقسام</h4>
      <ul id="fcats"></ul>
    </div>
    <div>
      <h4>معلومات الاتصال</h4>
      <ul>
        <li>📞 <span dir="ltr">${phone}</span></li>
        <li>🚚 التوصيل لجميع مدن المغرب</li>
        <li>💵 الدفع عند الاستلام</li>
        <li>🕘 الاثنين–السبت: 9:00 – 20:00</li>
      </ul>
    </div>
  </div>
  <div class="wrap"><div class="fbot">
    <span>© 2026 MEHDISHOP — جميع الحقوق محفوظة</span>
    <span>صنع بإتقان في المغرب ★</span>
  </div></div>
</footer>

<div class="ov" id="ov"></div>
<aside class="dw" id="dw">
  <div class="dwh"><h3 id="dwt">🛒 سلة المشتريات</h3><button class="xb" id="closeCart">✕</button></div>
  <div class="dwb" id="dwb"></div>
  <div class="dwf" id="dwf" style="display:none"></div>
</aside>

<div class="toast" id="toast"></div>

<!-- ===== لوحة الإدارة (5 نقرات على الشعار) ===== -->
<div id="adm">
  <div class="ahead">
    <div class="logo">MEHDI<em>SHOP</em></div>
    <div class="atabs" id="atabs"></div>
    <div style="display:flex;gap:8px;margin-right:auto;align-items:center">
      <button class="atab" id="apiChip" onclick="changeApi()" title="عنوان المتجر — اضغط للتغيير" style="font-family:monospace;font-size:11px;max-width:210px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" dir="ltr"></button>
      <button class="atab" onclick="loadAdmin()" title="تحديث">🔄 تحديث</button>
      <button class="atab" onclick="closeAdmin()" title="إغلاق">✕ إغلاق</button>
    </div>
  </div>
  <div class="abody" id="abody"></div>
</div>

<div class="modal" id="pmodal">
  <div class="mbox">
    <h4><span id="pmtitle">تعديل المنتج</span><button class="xb" onclick="closeP()">✕</button></h4>
    <div class="mbody" id="pmbody"></div>
  </div>
</div>

<script>
var D = ${JSON.stringify(data)};
var cart = [];
var cat = 'الكل', q = '', step = 'cart', lastRef = '', lastTotal = 0;

try { cart = JSON.parse(localStorage.getItem('mehdishop-cart') || '[]'); } catch(e) { cart = []; }

/* ===== تحديد عنوان المتجر تلقائياً (يعمل دائماً) ===== */
var API = D.apiBase;
var API_KEY = 'mehdishop-api-base';

function normBase(u){ return (u||'').trim().replace(/\\/+$/,''); }

function apiCandidates(){
  var list = [];
  try { var saved = localStorage.getItem(API_KEY); if(saved) list.push(saved); } catch(e){}
  // إن كان الملف مستضافاً على خادم، جرّب نفس العنوان أولاً — الأضمن دائماً
  if(location.protocol.indexOf('http')===0 && location.origin && location.origin!=='null'){
    list.push(location.origin);
  }
  list.push(D.apiBase);
  var out=[];
  for(var i=0;i<list.length;i++){
    var v=normBase(list[i]);
    if(v && out.indexOf(v)===-1) out.push(v);
  }
  return out;
}

/** يجرّب العناوين واحداً واحداً حتى يجد الذي يستجيب */
function resolveApi(cb){
  var list = apiCandidates(), i = 0;
  function tryNext(){
    if(i >= list.length){ cb(false); return; }
    var base = list[i++];
    var ctrl = typeof AbortController!=='undefined' ? new AbortController() : null;
    var t = setTimeout(function(){ if(ctrl) ctrl.abort(); }, 6000);
    fetch(base+'/api/health', ctrl?{signal:ctrl.signal,cache:'no-store'}:{cache:'no-store'})
      .then(function(r){
        clearTimeout(t);
        if(r && r.ok){ setApi(base); cb(true); } else tryNext();
      })
      .catch(function(){ clearTimeout(t); tryNext(); });
  }
  tryNext();
}

function setApi(base){
  API = normBase(base);
  try { localStorage.setItem(API_KEY, API); } catch(e){}
  var chip = document.getElementById('apiChip');
  if(chip){ chip.textContent = '🔗 ' + API.replace(/^https?:\\/\\//,''); }
}

/** تغيير عنوان المتجر يدوياً من رأس اللوحة */
function changeApi(){
  var v = prompt('عنوان متجرك (الرابط الذي نُشر عليه):', API);
  if(v===null) return;
  v = normBase(v);
  if(!v || v.indexOf('http')!==0){ toast('اكتب رابطاً كاملاً يبدأ بـ https://'); return; }
  fetch(v+'/api/health',{cache:'no-store'}).then(function(r){
    if(!r.ok) throw new Error();
    setApi(v); toast('تم الاتصال بـ '+v.replace(/^https?:\\/\\//,''));
    render(); fetchAdminData();
  }).catch(function(){ toast('لا يستجيب هذا العنوان'); });
}

/** رابط الصورة الكامل مهما كان عنوان المتجر */
function imgUrl(src){
  if(!src) return '';
  if(src.indexOf('http')===0) return src;
  // حزمة GitHub: الصور بجانب الملف — تعمل حتى لو كان الخادم متوقفاً
  if(D.localImages) return '.' + src;
  return API + src;
}

function mad(n){ return Math.round(n).toLocaleString('en-US') + ' د.م'; }
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function save(){ try{ localStorage.setItem('mehdishop-cart', JSON.stringify(cart)); }catch(e){} }
function find(id){ for(var i=0;i<D.products.length;i++){ if(D.products[i].id===id) return D.products[i]; } return null; }
function toast(m){
  var t=document.createElement('div'); t.textContent='✓ '+m;
  document.getElementById('toast').appendChild(t);
  setTimeout(function(){ t.remove(); }, 2600);
}
function count(){ var n=0; for(var i=0;i<cart.length;i++) n+=cart[i].qty; return n; }
function subtotal(){ var s=0; for(var i=0;i<cart.length;i++){ var p=find(cart[i].productId); if(p) s+=p.price*cart[i].qty; } return s; }
function shipping(){ var s=subtotal(); return (s===0||s>=D.freeThreshold)?0:D.shippingFee; }

/* ticker */
(function(){
  var msgs=['الدفع عند الاستلام متاح في جميع المدن','توصيل مجاني للطلبات فوق '+D.freeThreshold+' د.م','توصيل سريع خلال 24 إلى 48 ساعة','ضمان سنة كاملة على الإلكترونيات','إرجاع مجاني خلال 7 أيام'];
  var h=''; for(var r=0;r<2;r++){ for(var i=0;i<msgs.length;i++){ h+='<span>✦ '+msgs[i]+'</span>'; } }
  document.getElementById('tk').innerHTML=h;
})();

/* chips + footer cats */
function renderChips(){
  var list=['الكل'].concat(D.categories,['عروض خاصة']), h='';
  for(var i=0;i<list.length;i++){
    var c=list[i];
    h+='<button class="chip press'+(cat===c?' on':'')+'" onclick="setCat(\\''+c.replace(/'/g,"")+'\\')">'+(c==='عروض خاصة'?'🔥 ':'')+esc(c)+'</button>';
  }
  document.getElementById('chips').innerHTML=h;
  var f=''; for(var j=0;j<D.categories.length;j++){ f+='<li><a href="#products" style="color:inherit;text-decoration:none" onclick="setCat(\\''+D.categories[j].replace(/'/g,"")+'\\')">'+esc(D.categories[j])+'</a></li>'; }
  document.getElementById('fcats').innerHTML=f;
}
function setCat(c){
  cat=c; renderChips(); render();
  document.getElementById('products').scrollIntoView({behavior:'smooth'});
}

/* products grid */
function render(){
  var list=[], i;
  for(i=0;i<D.products.length;i++){
    var p=D.products[i];
    if(cat==='عروض خاصة'){ if(!(p.oldPrice&&p.oldPrice>p.price)) continue; }
    else if(cat!=='الكل'){ if(p.category!==cat) continue; }
    if(q && p.name.indexOf(q)===-1 && p.description.indexOf(q)===-1) continue;
    list.push(p);
  }
  var h='';
  for(i=0;i<list.length;i++){
    var x=list[i];
    var off = (x.oldPrice&&x.oldPrice>x.price) ? Math.round((1-x.price/x.oldPrice)*100) : null;
    h+='<article class="card">'
      +'<div class="cimg"><img loading="lazy" src="'+esc(imgUrl(x.image))+'" alt="'+esc(x.name)+'">'
      +(off!==null?'<span class="off">-'+off+'%</span>':'')
      +(x.stock<=0?'<div class="oos"><span>نفذ المخزون</span></div>':'')
      +'</div><div class="cbody"><span class="ccat">'+esc(x.category)+'</span>'
      +'<h3 class="cname">'+esc(x.name)+'</h3>'
      +'<div class="crow"><div><span class="price">'+mad(x.price)+'</span>'
      +(x.oldPrice?'<span class="old">'+mad(x.oldPrice)+'</span>':'')+'</div>'
      +'<button class="addb press" onclick="add('+x.id+')"'+(x.stock<=0?' disabled':'')+' aria-label="أضف">🛒</button>'
      +'</div></div></article>';
  }
  document.getElementById('grid').innerHTML = h || '<p style="grid-column:1/-1;text-align:center;padding:60px 0;font-weight:700;color:rgba(14,23,38,.45)">ما لقيناش نتائج — جرب كلمة بحث أخرى</p>';
  document.getElementById('cnt2').textContent = list.length + ' منتج';
}

/* cart ops */
function add(id){
  var p=find(id); if(!p||p.stock<=0) return;
  var f=null,i;
  for(i=0;i<cart.length;i++){ if(cart[i].productId===id){ f=cart[i]; break; } }
  if(f){ if(f.qty>=p.stock){ toast('وصلت للكمية القصوى المتوفرة'); return; } f.qty++; }
  else cart.push({productId:id, qty:1});
  save(); badge(); toast('تمت إضافة «'+p.name+'» إلى السلة');
  if(document.getElementById('dw').classList.contains('on')) drawer();
}
function setQty(id,n){
  var p=find(id); if(!p) return;
  if(n<=0){ cart=cart.filter(function(l){ return l.productId!==id; }); }
  else { for(var i=0;i<cart.length;i++){ if(cart[i].productId===id) cart[i].qty=Math.min(n,p.stock); } }
  save(); badge(); drawer();
}
function badge(){
  var n=count(), b=document.getElementById('cnt');
  b.textContent=n; b.style.display = n>0 ? 'grid' : 'none';
}

/* drawer */
function open(){ document.getElementById('ov').classList.add('on'); document.getElementById('dw').classList.add('on'); document.body.style.overflow='hidden'; drawer(); }
function close(){ document.getElementById('ov').classList.remove('on'); document.getElementById('dw').classList.remove('on'); document.body.style.overflow=''; if(step==='done'){ step='cart'; } }

function drawer(){
  var b=document.getElementById('dwb'), f=document.getElementById('dwf'), t=document.getElementById('dwt');
  if(step==='done'){
    t.textContent='✅ تم تأكيد الطلب'; f.style.display='none';
    b.innerHTML='<div class="done"><div class="ok">✓</div><h3 style="font-family:Lalezar,cursive;font-size:30px;margin-top:20px">شكراً على ثقتك!</h3>'
      +'<p style="margin-top:8px;font-size:14px;line-height:1.9;color:rgba(14,23,38,.6)">تم تسجيل طلبك بنجاح وسنتصل بك قريباً لتأكيده.<br>احتفظ برقم الطلب للمتابعة:</p>'
      +'<div class="ref"><small style="font-size:12px;font-weight:700;color:rgba(14,23,38,.5)">رقم الطلب</small><b>'+esc(lastRef)+'</b><span style="font-size:14px;font-weight:800">'+mad(lastTotal)+'</span></div>'
      +'<br><button class="fbtn dark press" style="max-width:220px;margin:24px auto 0" onclick="close()">مواصلة التسوق</button></div>';
    return;
  }
  if(step==='form'){
    t.textContent='📝 معلومات التوصيل';
    var cities=['الدار البيضاء','الرباط','مراكش','فاس','طنجة','أكادير','مكناس','وجدة','القنيطرة','تطوان','سلا','المحمدية','الجديدة','بني ملال','الناظور','العيون','مدينة أخرى'];
    var opts=''; for(var i=0;i<cities.length;i++){ opts+='<option>'+cities[i]+'</option>'; }
    b.innerHTML='<button onclick="step=\\'cart\\';drawer()" style="font-size:12px;font-weight:800;color:rgba(14,23,38,.5);margin-bottom:16px">↩ الرجوع للسلة</button>'
      +'<div class="fld"><label class="lb">الاسم الكامل *</label><input id="f_name" placeholder="مثال: المهدي العلوي"><div class="err" id="e_name" style="display:none"></div></div>'
      +'<div class="fld"><label class="lb">رقم الهاتف *</label><input id="f_phone" dir="ltr" inputmode="tel" placeholder="0612345678"><div class="err" id="e_phone" style="display:none"></div></div>'
      +'<div class="fld"><label class="lb">المدينة *</label><select id="f_city">'+opts+'</select></div>'
      +'<div class="fld"><label class="lb">العنوان الكامل *</label><input id="f_addr" placeholder="الحي، الشارع، رقم المنزل..."><div class="err" id="e_addr" style="display:none"></div></div>'
      +'<div class="fld"><label class="lb">ملاحظة (اختياري)</label><textarea id="f_note" rows="3" style="resize:none" placeholder="أي ملاحظة للتوصيل..."></textarea></div>'
      +'<div class="note">💵 الدفع عند الاستلام — ما تخلص والو حتى توصلك السلعة</div>'
      +'<div class="err" id="e_srv" style="display:none;margin-top:10px"></div>';
    f.style.display='block';
    f.innerHTML='<div style="display:flex;justify-content:space-between;font-size:14px;font-weight:800"><span>المجموع ('+count()+' منتجات)</span><span style="color:#17339e">'+mad(subtotal()+shipping())+'</span></div>'
      +'<button class="fbtn dark press" id="submitBtn" onclick="submitOrder()">تأكيد الطلب — '+mad(subtotal()+shipping())+'</button>';
    return;
  }
  t.innerHTML='🛒 سلة المشتريات';
  if(cart.length===0){
    b.innerHTML='<div class="empty"><div class="ico">🛒</div><p style="font-weight:800">السلة فارغة</p><p style="font-size:14px;color:rgba(14,23,38,.5);margin-top:4px">عثر على منتجات تعجبك وزيدها للسلة</p><button class="fbtn dark press" style="max-width:200px;margin:20px auto 0" onclick="close()">ابدأ التسوق</button></div>';
    f.style.display='none'; return;
  }
  var h='',i;
  for(i=0;i<cart.length;i++){
    var l=cart[i], p=find(l.productId); if(!p) continue;
    h+='<div class="line"><img src="'+esc(imgUrl(p.image))+'" alt="'+esc(p.name)+'">'
      +'<div style="flex:1;display:flex;flex-direction:column">'
      +'<div style="display:flex;justify-content:space-between;gap:8px"><h4 class="lname">'+esc(p.name)+'</h4>'
      +'<button onclick="setQty('+p.id+',0)" style="color:rgba(14,23,38,.3);font-size:15px" aria-label="حذف">🗑</button></div>'
      +'<div style="display:flex;align-items:center;justify-content:space-between;margin-top:auto;padding-top:8px">'
      +'<span class="qty"><button onclick="setQty('+p.id+','+(l.qty+1)+')">+</button><span>'+l.qty+'</span><button onclick="setQty('+p.id+','+(l.qty-1)+')">−</button></span>'
      +'<b style="font-size:14px;color:#17339e">'+mad(p.price*l.qty)+'</b></div></div></div>';
  }
  b.innerHTML=h;
  var s=subtotal(), sh=shipping(), miss=Math.max(0,D.freeThreshold-s), pr=Math.min(100,(s/D.freeThreshold)*100);
  f.style.display='block';
  f.innerHTML=(miss>0
      ? '<p style="font-size:12px;font-weight:700;color:rgba(14,23,38,.6)">زيد <b style="color:#c98600">'+mad(miss)+'</b> باش تستافد من التوصيل المجاني</p>'
      : '<p style="font-size:12px;font-weight:800;color:#16835a">✓ مبروك! حصلت على التوصيل المجاني</p>')
    +'<div class="bar"><i style="width:'+pr+'%"></i></div>'
    +'<dl class="tot"><div><dt>المجموع الفرعي</dt><dd><b>'+mad(s)+'</b></dd></div>'
    +'<div><dt>التوصيل</dt><dd><b'+(sh===0?' style="color:#16835a"':'')+'>'+(sh===0?'مجاني':mad(sh))+'</b></dd></div>'
    +'<div class="g"><dt>المجموع</dt><dd style="color:#17339e">'+mad(s+sh)+'</dd></div></dl>'
    +'<button class="fbtn press" onclick="step=\\'form\\';drawer()">إتمام الطلب ←</button>';
}

function submitOrder(){
  var name=document.getElementById('f_name').value.trim();
  var phone=document.getElementById('f_phone').value.replace(/\\s/g,'');
  var city=document.getElementById('f_city').value;
  var addr=document.getElementById('f_addr').value.trim();
  var note=document.getElementById('f_note').value.trim();
  var ok=true;
  function sh(id,msg){ var e=document.getElementById(id); if(msg){ e.textContent=msg; e.style.display='block'; ok=false; } else e.style.display='none'; }
  sh('e_name', name.length<3 ? 'اكتب اسمك الكامل' : '');
  sh('e_phone', /^0[5-7]\\d{8}$/.test(phone) ? '' : 'رقم هاتف مغربي غير صحيح (مثال: 0612345678)');
  sh('e_addr', addr.length<6 ? 'اكتب عنواناً كاملاً' : '');
  if(!ok) return;

  var btn=document.getElementById('submitBtn');
  btn.disabled=true; btn.textContent='جاري إرسال الطلب...';
  var total=subtotal()+shipping();
  var items=[]; for(var i=0;i<cart.length;i++) items.push({productId:cart[i].productId, qty:cart[i].qty});

  fetch(API+'/api/orders',{
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ customer:{name:name,phone:phone,city:city,address:addr,note:note}, items:items })
  }).then(function(r){ return r.json().then(function(d){ return {ok:r.ok, d:d}; }); })
  .then(function(res){
    if(!res.ok) throw new Error(res.d.error||'خطأ');
    lastRef=res.d.ref; lastTotal=res.d.total;
    cart=[]; save(); badge(); step='done'; drawer();
  })
  .catch(function(){
    /* احتياطي: إرسال الطلب عبر واتساب */
    var txt='طلب جديد من MEHDISHOP%0A%0Aالاسم: '+encodeURIComponent(name)+'%0Aالهاتف: '+encodeURIComponent(phone)
      +'%0Aالمدينة: '+encodeURIComponent(city)+'%0Aالعنوان: '+encodeURIComponent(addr)+'%0A%0Aالمنتجات:%0A';
    for(var i=0;i<cart.length;i++){ var p=find(cart[i].productId); if(p) txt+=encodeURIComponent('• '+p.name+' × '+cart[i].qty+' = '+mad(p.price*cart[i].qty))+'%0A'; }
    txt+='%0A'+encodeURIComponent('المجموع: '+mad(total));
    if(note) txt+='%0A'+encodeURIComponent('ملاحظة: '+note);
    window.open('https://wa.me/'+D.whatsapp+'?text='+txt,'_blank');
    lastRef='WA-'+Date.now().toString(36).toUpperCase(); lastTotal=total;
    cart=[]; save(); badge(); step='done'; drawer();
  });
}

document.getElementById('openCart').onclick=function(){ step='cart'; open(); };
document.getElementById('closeCart').onclick=close;
document.getElementById('ov').onclick=close;
document.getElementById('q').oninput=function(e){ q=e.target.value.trim(); render(); };

/* ======================= لوحة التحكم ======================= */
var clicks=0, ctimer=null, atab='dash', aOrders=[], aProducts=[], aSettings={}, openRow=null, editing=null;

var ST={
  pending:{l:'جديدة',c:'#8A5B00',b:'#FFF1D6'},
  preparing:{l:'قيد التحضير',c:'#17339E',b:'#E3E9FC'},
  shipped:{l:'تم الشحن',c:'#0E7490',b:'#D8F3F9'},
  delivered:{l:'تم التسليم',c:'#166B45',b:'#DFF3E8'},
  cancelled:{l:'ملغاة',c:'#A33030',b:'#FBE3E3'}
};

/* النقر 5 مرات على الشعار (في الأعلى أو في الفوتر) — يفتح اللوحة فوراً */
function logoTap(){
  clicks++;
  if(ctimer) clearTimeout(ctimer);
  if(clicks>=5){ clicks=0; dots(0); requestAdmin(); return; }
  dots(clicks);
  ctimer=setTimeout(function(){ clicks=0; dots(0); }, 2500);
}

/** مؤشر خفي: نقاط تحت الشعار تبدأ من النقرة الثالثة */
function dots(n){
  ['logo','logo2'].forEach(function(id){
    var el=document.getElementById(id); if(!el) return;
    var d=el.querySelector('.tapdots');
    if(n<3){ if(d) d.remove(); return; }
    if(!d){
      d=document.createElement('span');
      d.className='tapdots';
      d.style.cssText='position:absolute;bottom:-5px;left:0;right:0;display:flex;justify-content:center;gap:4px;pointer-events:none';
      el.style.position='relative';
      el.appendChild(d);
    }
    var h='';
    for(var i=0;i<5;i++){
      h+='<i style="width:4px;height:4px;border-radius:50%;background:'+(i<n?'var(--saf2)':'rgba(128,128,128,.28)')+'"></i>';
    }
    d.innerHTML=h;
  });
}
['logo','logo2'].forEach(function(id){
  var el=document.getElementById(id);
  if(el){
    el.style.cursor='pointer'; el.style.webkitTapHighlightColor='transparent';
    el.addEventListener('click', logoTap);
    // دعم اللمس على الهاتف داخل Google Sites
    el.addEventListener('touchend', function(e){ e.preventDefault(); logoTap(); }, {passive:false});
  }
});

/** نقطة الدخول: الزر أو 5 نقرات أو #admin — بدون كلمة مرور */
function requestAdmin(){ openAdmin(); }

function openAdmin(){
  document.getElementById('adm').classList.add('on');
  document.body.style.overflow='hidden';
  if(location.hash!=='#admin'){ try{ history.replaceState(null,'','#admin'); }catch(e){} }
  renderTabs(); loadAdmin();
}
function closeAdmin(){
  document.getElementById('adm').classList.remove('on');
  document.body.style.overflow='';
  try{ history.replaceState(null,'',location.pathname+location.search); }catch(e){}
}

/* فتح اللوحة مباشرة عبر الرابط: ...#admin أو ?admin=1 */
(function(){
  function checkUrl(){
    var h = location.hash === '#admin';
    var q = new URLSearchParams(location.search).get('admin') === '1';
    if(h || q) setTimeout(requestAdmin, 60);
  }
  checkUrl();
  window.addEventListener('hashchange', function(){
    if(location.hash==='#admin') requestAdmin();
  });
})();
function renderTabs(){
  var t=[['dash','📊 نظرة عامة'],['orders','📦 الطلبات'],['prods','🏷️ المنتجات'],['set','⚙️ الإعدادات']], h='';
  for(var i=0;i<t.length;i++){
    h+='<button class="atab'+(atab===t[i][0]?' on':'')+'" onclick="setTab(\\''+t[i][0]+'\\')">'+t[i][1]+'</button>';
  }
  document.getElementById('atabs').innerHTML=h;
}
function setTab(t){ atab=t; openRow=null; renderTabs(); renderAdmin(); }

function fetchAdminData(){
  Promise.all([
    fetch(API+'/api/admin/orders').then(function(r){ return r.json(); }),
    fetch(API+'/api/admin/products').then(function(r){ return r.json(); }),
    fetch(API+'/api/admin/settings').then(function(r){ return r.json(); })
  ]).then(function(res){
    aOrders = Array.isArray(res[0]) ? res[0] : [];
    aProducts = Array.isArray(res[1]) ? res[1] : [];
    aSettings = (res[2] && typeof res[2]==='object') ? res[2] : {};
    // نحدّث بيانات المتجر المعروضة للزبون فوراً
    if(aSettings.shipping_fee) D.shippingFee = Number(aSettings.shipping_fee)||D.shippingFee;
    if(aSettings.free_shipping_threshold) D.freeThreshold = Number(aSettings.free_shipping_threshold)||D.freeThreshold;
    if(aSettings.categories){
      var c = aSettings.categories.split(',').map(function(x){ return x.trim(); }).filter(Boolean);
      if(c.length) { D.categories = c; renderChips(); }
    }
    if(aSettings.store_whatsapp) D.whatsapp = aSettings.store_whatsapp.replace(/\D/g,'') || D.whatsapp;
    renderAdmin();
  }).catch(function(){ adminError(); });
}

function loadAdmin(){
  document.getElementById('abody').innerHTML='<p style="text-align:center;padding:60px 0;font-weight:700;color:rgba(14,23,38,.45)">⏳ جاري الاتصال بالمتجر...</p>';
  resolveApi(function(ok){
    if(!ok){ adminError(); return; }
    fetchAdminData();
  });
}

/** شاشة الخطأ مع إمكانية إدخال عنوان المتجر يدوياً */
function adminError(){
  var tried = apiCandidates().map(function(u){ return '<li style="font-family:monospace;font-size:11px;opacity:.7;padding:2px 0" dir="ltr">'+esc(u)+'</li>'; }).join('');
  document.getElementById('abody').innerHTML=
     '<div class="acard" style="padding:30px;max-width:560px;margin:0 auto">'
    +'<p style="font-weight:800;font-size:17px;text-align:center">⚠️ تعذّر الاتصال بالمتجر</p>'
    +'<p style="font-size:13px;color:rgba(14,23,38,.55);margin-top:10px;line-height:1.9;text-align:center">جرّبنا العناوين التالية ولم يستجب أي منها:</p>'
    +'<ul style="list-style:none;text-align:center;margin:8px 0 16px">'+tried+'</ul>'
    +'<label class="lb">اكتب عنوان متجرك الصحيح</label>'
    +'<div style="display:flex;gap:8px">'
    +'<input id="apiInput" dir="ltr" placeholder="https://mon-magasin.vercel.app" value="'+esc(API)+'">'
    +'<button class="abtn" style="flex-shrink:0" onclick="applyApi()">اتصال</button></div>'
    +'<p id="apiMsg" style="font-size:12px;font-weight:700;margin-top:10px;text-align:center"></p>'
    +'<p style="font-size:12px;color:rgba(14,23,38,.45);margin-top:14px;line-height:1.9;text-align:center">'
    +'العنوان هو رابط متجرك المنشور (مثلاً على Vercel). سيُحفظ في هذا المتصفح ولن تحتاج كتابته مرة أخرى.</p>'
    +'<div style="text-align:center;margin-top:14px"><button class="abtn gray" onclick="loadAdmin()">إعادة المحاولة</button></div>'
    +'</div>';
}

function applyApi(){
  var v = normBase(document.getElementById('apiInput').value);
  var msg = document.getElementById('apiMsg');
  if(!v || v.indexOf('http')!==0){ msg.style.color='var(--dan)'; msg.textContent='اكتب رابطاً كاملاً يبدأ بـ https://'; return; }
  msg.style.color='rgba(14,23,38,.5)'; msg.textContent='⏳ جاري التحقق...';
  fetch(v+'/api/health',{cache:'no-store'}).then(function(r){
    if(!r.ok) throw new Error();
    setApi(v);
    msg.style.color='#16835a'; msg.textContent='✓ تم الاتصال بنجاح';
    setTimeout(function(){ document.getElementById('abody').innerHTML=''; fetchAdminData(); }, 500);
  }).catch(function(){
    msg.style.color='var(--dan)'; msg.textContent='✗ لا يستجيب هذا العنوان — تأكد أن المتجر منشور ويعمل';
  });
}

function renderAdmin(){
  if(atab==='dash') return renderDash();
  if(atab==='orders') return renderOrders();
  if(atab==='set') return renderSettings();
  return renderProds();
}

function renderDash(){
  var rev=0,pend=0,i;
  for(i=0;i<aOrders.length;i++){ if(aOrders[i].status!=='cancelled') rev+=aOrders[i].total; if(aOrders[i].status==='pending') pend++; }
  var act=0; for(i=0;i<aProducts.length;i++){ if(aProducts[i].active) act++; }

  /* رسم مبيعات آخر 7 أيام */
  var days=[],mx=1;
  for(i=6;i>=0;i--){
    var d=new Date(); d.setDate(d.getDate()-i);
    days.push({k:d.toDateString(), l:['أحد','إثنين','ثلاثاء','أربعاء','خميس','جمعة','سبت'][d.getDay()], v:0});
  }
  for(i=0;i<aOrders.length;i++){
    if(aOrders[i].status==='cancelled') continue;
    var k=new Date(aOrders[i].createdAt).toDateString();
    for(var j=0;j<days.length;j++){ if(days[j].k===k) days[j].v+=aOrders[i].total; }
  }
  for(i=0;i<days.length;i++){ if(days[i].v>mx) mx=days[i].v; }
  var bars='';
  for(i=0;i<days.length;i++){
    var hp=Math.max(6,(days[i].v/mx)*100);
    bars+='<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:5px" title="'+mad(days[i].v)+'">'
      +'<div style="width:100%;height:'+hp+'%;border-radius:6px 6px 0 0;background:'+(days[i].v>0?'var(--maj)':'rgba(14,23,38,.08)')+';transition:.5s"></div>'
      +'<small style="font-size:10px;font-weight:700;color:rgba(14,23,38,.45)">'+days[i].l+'</small></div>';
  }

  var recent='';
  for(i=0;i<Math.min(6,aOrders.length);i++){
    var o=aOrders[i], s=ST[o.status]||ST.pending;
    recent+='<div class="mrow" style="border-top:1px solid rgba(14,23,38,.07)">'
      +'<div style="flex:1;min-width:0"><b style="font-size:13px">'+esc(o.customerName)+'</b>'
      +' <small style="font-size:11px;color:rgba(14,23,38,.4)" dir="ltr">'+esc(o.ref)+'</small>'
      +'<div style="font-size:11px;font-weight:700;color:rgba(14,23,38,.45)">'+esc(o.city)+'</div></div>'
      +'<span class="pill2" style="color:'+s.c+';background:'+s.b+'">'+s.l+'</span>'
      +'<b style="font-size:13px;color:#17339e;min-width:78px;text-align:left">'+mad(o.total)+'</b></div>';
  }
  if(!recent) recent='<p style="padding:26px 0;text-align:center;font-weight:700;color:rgba(14,23,38,.4)">لا توجد طلبات بعد</p>';

  document.getElementById('abody').innerHTML=
    '<div class="astats">'
    +'<div class="astat"><i style="background:var(--saf-l);color:#c98600">💵</i><small>إجمالي المبيعات</small><b>'+mad(rev)+'</b></div>'
    +'<div class="astat"><i style="background:var(--maj-l);color:#17339e">📦</i><small>عدد الطلبات</small><b>'+aOrders.length+'</b></div>'
    +'<div class="astat"><i style="background:var(--mint-l);color:#16835a">🚚</i><small>طلبات جديدة</small><b>'+pend+'</b></div>'
    +'<div class="astat"><i style="background:var(--paper2)">🏷️</i><small>المنتجات</small><b>'+aProducts.length+'</b><small style="margin-top:4px">'+act+' منتج نشط</small></div>'
    +'</div>'
    +'<div class="acard"><h4>مبيعات آخر 7 أيام</h4><div style="padding:18px;display:flex;align-items:flex-end;gap:10px;height:190px">'+bars+'</div></div>'
    +'<div class="acard"><h4>آخر الطلبات</h4><div style="padding:6px 16px 14px">'+recent+'</div></div>';
}

function renderOrders(){
  var h='<div class="acard"><h4>كل الطلبيات ('+aOrders.length+')</h4><div class="scroll"><table class="atbl">'
    +'<thead><tr><th>الطلب</th><th>العميل</th><th>المدينة</th><th>القطع</th><th>المجموع</th><th>الحالة</th><th></th></tr></thead><tbody>';
  for(var i=0;i<aOrders.length;i++){
    var o=aOrders[i], s=ST[o.status]||ST.pending, n=0, j;
    for(j=0;j<o.items.length;j++) n+=o.items[j].qty;
    var dt=new Date(o.createdAt), ds=dt.getDate()+'/'+(dt.getMonth()+1)+' '+String(dt.getHours()).padStart(2,'0')+':'+String(dt.getMinutes()).padStart(2,'0');
    var opts='';
    for(var k in ST){ opts+='<option value="'+k+'"'+(o.status===k?' selected':'')+'>'+ST[k].l+'</option>'; }
    h+='<tr><td><b dir="ltr">'+esc(o.ref)+'</b><div style="font-size:11px;font-weight:700;color:rgba(14,23,38,.45)">'+ds+'</div></td>'
      +'<td><b>'+esc(o.customerName)+'</b><div style="font-size:11px;font-weight:700;color:rgba(14,23,38,.45)" dir="ltr">'+esc(o.phone)+'</div></td>'
      +'<td style="font-weight:700">'+esc(o.city)+'</td><td style="font-weight:700">'+n+'</td>'
      +'<td><b style="color:#17339e">'+mad(o.total)+'</b></td>'
      +'<td><select class="st" style="color:'+s.c+';background:'+s.b+'" onchange="setStatus('+o.id+',this.value)">'+opts+'</select></td>'
      +'<td><button class="iconb" onclick="toggleRow('+o.id+')">'+(openRow===o.id?'▲':'▼')+'</button></td></tr>';
    if(openRow===o.id){
      var items='';
      for(j=0;j<o.items.length;j++){
        var it=o.items[j];
        items+='<div class="mrow"><img class="thumb" src="'+esc(imgUrl(it.image))+'" alt="">'
          +'<span style="flex:1;font-size:13px;font-weight:700">'+esc(it.name)+'</span>'
          +'<span style="font-size:12px;font-weight:700;color:rgba(14,23,38,.5)">×'+it.qty+'</span>'
          +'<b style="font-size:13px;min-width:80px;text-align:left">'+mad(it.price*it.qty)+'</b></div>';
      }
      h+='<tr class="det"><td colspan="7" style="padding:0 14px 14px"><div class="box">'
        +'<div><small style="font-size:11px;font-weight:800;color:rgba(14,23,38,.5)">المنتجات المطلوبة</small>'+items
        +'<div style="border-top:1px dashed rgba(14,23,38,.15);margin-top:10px;padding-top:8px;font-size:12px;font-weight:700;color:rgba(14,23,38,.6)">'
        +'<div style="display:flex;justify-content:space-between"><span>المجموع الفرعي</span><span>'+mad(o.subtotal)+'</span></div>'
        +'<div style="display:flex;justify-content:space-between"><span>التوصيل</span><span>'+(o.shipping===0?'مجاني':mad(o.shipping))+'</span></div>'
        +'<div style="display:flex;justify-content:space-between;font-size:14px;font-weight:800;color:var(--ink)"><span>المجموع</span><span>'+mad(o.total)+'</span></div></div></div>'
        +'<div><small style="font-size:11px;font-weight:800;color:rgba(14,23,38,.5)">عنوان التوصيل</small>'
        +'<p style="font-size:13px;font-weight:700;line-height:1.9;margin-top:8px">'+esc(o.customerName)+'<br>'+esc(o.city)+' — '+esc(o.address)+'<br><span dir="ltr">'+esc(o.phone)+'</span></p>'
        +(o.note?'<p style="margin-top:10px;background:var(--saf-l);color:#8a5b00;border-radius:8px;padding:9px 12px;font-size:12px;font-weight:700">📝 '+esc(o.note)+'</p>':'')
        +'<a class="fb2" style="display:inline-block;margin-top:12px" target="_blank" rel="noreferrer" href="https://wa.me/'+esc(o.phone.replace(/^0/,'212'))+'">💬 مراسلة العميل</a>'
        +'</div></div></td></tr>';
    }
  }
  if(aOrders.length===0) h+='<tr><td colspan="7" style="padding:46px;text-align:center;font-weight:700;color:rgba(14,23,38,.4)">لا توجد طلبات بعد</td></tr>';
  document.getElementById('abody').innerHTML=h+'</tbody></table></div></div>';
}

function toggleRow(id){ openRow = (openRow===id) ? null : id; renderOrders(); }

function setStatus(id,st){
  fetch(API+'/api/admin/orders/'+id,{
    method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({status:st})
  }).then(function(r){ return r.json(); }).then(function(u){
    for(var i=0;i<aOrders.length;i++){ if(aOrders[i].id===id) aOrders[i].status=u.status||st; }
    renderOrders(); toast('تم تحديث حالة الطلب');
  }).catch(function(){ toast('تعذر التحديث'); });
}

/* ======================= الإعدادات ======================= */

function sv(k, d){ return (aSettings[k]!==undefined && aSettings[k]!=='') ? aSettings[k] : (d||''); }

function renderSettings(){
  var cats = sv('categories','المطبخ,إلكترونيات,المنزل').split(',').map(function(c){ return c.trim(); }).filter(Boolean);
  var chips='';
  for(var i=0;i<cats.length;i++){
    chips+='<span class="pill2" style="background:var(--maj-l);color:#17339e;display:inline-flex;align-items:center;gap:6px;padding:6px 12px;margin:0 0 6px 6px">'
      +esc(cats[i])+'<button onclick="delCat('+i+')" style="color:rgba(23,51,158,.5);font-size:13px;line-height:1" title="حذف">✕</button></span>';
  }

  document.getElementById('abody').innerHTML=
  '<div style="display:grid;gap:16px;max-width:900px">'

  /* التوصيل */
  +'<div class="acard"><h4>🚚 إعدادات التوصيل</h4><div style="padding:16px">'
  +'<p style="font-size:12px;font-weight:700;color:rgba(14,23,38,.45);margin-bottom:12px">ثمن التوصيل وعتبة التوصيل المجاني بالدرهم المغربي</p>'
  +'<div class="f2 c2">'
  +'<div><label class="lb">ثمن التوصيل (د.م)</label><input id="s_fee" type="number" min="0" value="'+esc(sv('shipping_fee','35'))+'"></div>'
  +'<div><label class="lb">توصيل مجاني ابتداءً من (د.م)</label><input id="s_thr" type="number" min="0" value="'+esc(sv('free_shipping_threshold','500'))+'"></div>'
  +'</div>'
  +'<button class="abtn" style="margin-top:14px" onclick="saveSet([\\'shipping_fee\\',\\'free_shipping_threshold\\'],[\\'s_fee\\',\\'s_thr\\'])">حفظ</button>'
  +'</div></div>'

  /* التواصل */
  +'<div class="acard"><h4>📞 معلومات التواصل</h4><div style="padding:16px">'
  +'<p style="font-size:12px;font-weight:700;color:rgba(14,23,38,.45);margin-bottom:12px">تظهر في فوتر المتجر وتُستعمل لاستقبال الطلبات عبر واتساب</p>'
  +'<div class="f2 c2">'
  +'<div><label class="lb">الهاتف</label><input id="s_tel" dir="ltr" value="'+esc(sv('store_phone','0600-000000'))+'" placeholder="0600-000000"></div>'
  +'<div><label class="lb">واتساب (بالصيغة الدولية)</label><input id="s_wa" dir="ltr" value="'+esc(sv('store_whatsapp','212600000000'))+'" placeholder="212600000000"></div>'
  +'</div>'
  +'<button class="abtn" style="margin-top:14px" onclick="saveSet([\\'store_phone\\',\\'store_whatsapp\\'],[\\'s_tel\\',\\'s_wa\\'])">حفظ</button>'
  +'</div></div>'

  /* الأقسام */
  +'<div class="acard"><h4>🏷️ أقسام المتجر</h4><div style="padding:16px">'
  +'<p style="font-size:12px;font-weight:700;color:rgba(14,23,38,.45);margin-bottom:12px">الأقسام التي تظهر للزبناء في شريط التصفية</p>'
  +'<div id="catBox">'+chips+'</div>'
  +'<div style="display:flex;gap:8px;margin-top:12px;max-width:420px">'
  +'<input id="s_newcat" placeholder="اسم القسم الجديد..." onkeydown="if(event.key===\\'Enter\\'){event.preventDefault();addCat();}">'
  +'<button class="abtn gray" style="flex-shrink:0" onclick="addCat()">إضافة</button></div>'
  +'<button class="abtn" style="margin-top:14px" onclick="saveCats()">حفظ الأقسام</button>'
  +'</div></div>'

  /* رابط المتجر */
  +'<div class="acard"><h4>🌐 رابط المتجر</h4><div style="padding:16px">'
  +'<p style="font-size:12px;font-weight:700;color:rgba(14,23,38,.45);margin-bottom:12px">يُستعمل في خريطة الموقع وملف Google Merchant وكود التضمين</p>'
  +'<div style="background:var(--mint-l);border-radius:9px;padding:11px 13px;margin-bottom:12px">'
  +'<p style="font-size:11px;font-weight:800;color:var(--mint)">✅ العنوان المتصل حالياً</p>'
  +'<p dir="ltr" style="font-family:monospace;font-size:11px;font-weight:700;margin-top:3px;word-break:break-all">'+esc(API)+'</p></div>'
  +'<label class="lb">نطاقك الخاص (فعّله بعد ربطه فعلياً)</label>'
  +'<input id="s_url" dir="ltr" value="'+esc(sv('site_url',''))+'" placeholder="https://chaouishop.app">'
  +'<label class="chk" style="margin-top:12px"><input type="checkbox" id="s_urlon"'+(sv('site_url_enabled','false')==='true'?' checked':'')+'> استعمل نطاقي الخاص في كل الروابط</label>'
  +'<button class="abtn" style="margin-top:14px" onclick="saveUrl()">حفظ</button>'
  +'</div></div>'

  +'<p id="setMsg" style="text-align:center;font-size:13px;font-weight:800;min-height:20px"></p>'
  +'</div>';
}

function setMsg(m, ok){
  var e=document.getElementById('setMsg'); if(!e) return;
  e.style.color = ok ? '#16835a' : 'var(--dan)';
  e.textContent = m;
  setTimeout(function(){ if(e.textContent===m) e.textContent=''; }, 3000);
}

/** حفظ عام: يأخذ مفاتيح الإعدادات ومعرّفات الحقول */
function saveSet(keys, ids){
  var body={};
  for(var i=0;i<keys.length;i++){
    var el=document.getElementById(ids[i]); if(!el) continue;
    body[keys[i]] = el.value.trim();
  }
  postSettings(body, 'تم الحفظ بنجاح ✓');
}

function postSettings(body, okMsg){
  fetch(API+'/api/admin/settings',{
    method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({settings:body})
  }).then(function(r){
    if(!r.ok) throw new Error();
    for(var k in body) aSettings[k]=body[k];
    // تحديث فوري لواجهة المتجر
    if(body.shipping_fee!==undefined) D.shippingFee=Number(body.shipping_fee)||0;
    if(body.free_shipping_threshold!==undefined) D.freeThreshold=Number(body.free_shipping_threshold)||0;
    if(body.store_whatsapp!==undefined) D.whatsapp=body.store_whatsapp.replace(/\D/g,'')||D.whatsapp;
    if(body.categories!==undefined){
      D.categories=body.categories.split(',').map(function(x){ return x.trim(); }).filter(Boolean);
      renderChips(); render();
    }
    setMsg(okMsg, true); toast(okMsg);
  }).catch(function(){ setMsg('تعذر الحفظ — تحقق من الاتصال', false); });
}

function addCat(){
  var inp=document.getElementById('s_newcat');
  var v=inp.value.trim(); if(!v) return;
  var cats=sv('categories','').split(',').map(function(c){ return c.trim(); }).filter(Boolean);
  if(cats.indexOf(v)!==-1){ setMsg('هذا القسم موجود مسبقاً', false); return; }
  cats.push(v); aSettings.categories=cats.join(',');
  inp.value=''; renderSettings();
}

function delCat(i){
  var cats=sv('categories','').split(',').map(function(c){ return c.trim(); }).filter(Boolean);
  cats.splice(i,1); aSettings.categories=cats.join(',');
  renderSettings();
}

function saveCats(){
  var cats=sv('categories','');
  if(!cats){ setMsg('أضف قسماً واحداً على الأقل', false); return; }
  postSettings({categories:cats}, 'تم حفظ الأقسام ✓');
}

function saveUrl(){
  var v=normBase(document.getElementById('s_url').value);
  var on=document.getElementById('s_urlon').checked;
  if(on && (!v || v.indexOf('http')!==0)){ setMsg('اكتب رابطاً كاملاً يبدأ بـ https://', false); return; }
  postSettings({site_url:v, site_url_enabled:on?'true':'false'}, 'تم حفظ رابط المتجر ✓');
}

function renderProds(){
  var h='<div class="acard"><h4 style="display:flex;justify-content:space-between;align-items:center">المنتجات ('+aProducts.length+')'
    +'<button class="abtn" onclick="editP(null)">+ إضافة منتج</button></h4><div class="scroll"><table class="atbl">'
    +'<thead><tr><th>المنتج</th><th>القسم</th><th>الثمن (د.م)</th><th>المخزون</th><th>نشط</th><th>إجراءات</th></tr></thead><tbody>';
  for(var i=0;i<aProducts.length;i++){
    var p=aProducts[i];
    h+='<tr><td><div style="display:flex;align-items:center;gap:10px">'
      +'<img class="thumb" src="'+esc(imgUrl(p.image))+'" alt="">'
      +'<div><b style="display:block;max-width:230px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(p.name)+'</b>'
      +'<small style="font-size:11px;font-weight:700;color:rgba(14,23,38,.4)">#'+p.id+'</small></div></div></td>'
      +'<td><span class="pill2" style="background:var(--maj-l);color:#17339e">'+esc(p.category)+'</span></td>'
      +'<td><input class="mini" type="number" value="'+p.price+'" onchange="quick('+p.id+',\\'price\\',this.value)"></td>'
      +'<td><input class="mini" type="number" value="'+p.stock+'" onchange="quick('+p.id+',\\'stock\\',this.value)"></td>'
      +'<td><input type="checkbox" style="width:18px;height:18px;accent-color:#16835a;padding:0"'+(p.active?' checked':'')+' onchange="quick('+p.id+',\\'active\\',this.checked)"></td>'
      +'<td><div style="display:flex;gap:4px"><button class="iconb" title="تعديل" onclick="editP('+p.id+')">✏️</button>'
      +'<button class="iconb" title="حذف" onclick="delP('+p.id+')">🗑️</button></div></td></tr>';
  }
  document.getElementById('abody').innerHTML=h+'</tbody></table></div></div>'
    +'<p style="margin-top:12px;font-size:12px;font-weight:700;color:rgba(14,23,38,.45);text-align:center">💡 يمكنك تعديل الثمن والمخزون مباشرة من الجدول — يُحفظ تلقائياً</p>';
}

function quick(id,field,val){
  var body={}; body[field] = (field==='active') ? val : Number(val);
  fetch(API+'/api/admin/products/'+id,{
    method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)
  }).then(function(r){ return r.json(); }).then(function(u){
    for(var i=0;i<aProducts.length;i++){ if(aProducts[i].id===id) aProducts[i][field]=u[field]; }
    toast('تم الحفظ');
  }).catch(function(){ toast('تعذر الحفظ'); });
}

function delP(id){
  var p=null; for(var i=0;i<aProducts.length;i++){ if(aProducts[i].id===id) p=aProducts[i]; }
  if(!p || !confirm('حذف «'+p.name+'» نهائياً؟')) return;
  fetch(API+'/api/admin/products/'+id,{method:'DELETE'}).then(function(){
    aProducts=aProducts.filter(function(x){ return x.id!==id; });
    renderProds(); toast('تم حذف المنتج');
  }).catch(function(){ toast('تعذر الحذف'); });
}

function editP(id){
  editing=null;
  if(id!==null){ for(var i=0;i<aProducts.length;i++){ if(aProducts[i].id===id) editing=aProducts[i]; } }
  var p = editing || {name:'',category:D.categories[0]||'',price:'',oldPrice:'',stock:10,image:'',description:'',featured:false,active:true};
  var opts=''; for(var j=0;j<D.categories.length;j++){ opts+='<option'+(p.category===D.categories[j]?' selected':'')+'>'+esc(D.categories[j])+'</option>'; }
  document.getElementById('pmtitle').textContent = editing ? 'تعديل المنتج' : 'إضافة منتج جديد';
  document.getElementById('pmbody').innerHTML=
     '<div class="f2"><div><label class="lb">اسم المنتج *</label><input id="p_name" value="'+esc(p.name)+'"></div></div>'
    +'<div class="f2 c3" style="margin-top:14px">'
    +'<div><label class="lb">القسم</label><select id="p_cat">'+opts+'</select></div>'
    +'<div><label class="lb">الثمن (د.م) *</label><input id="p_price" type="number" value="'+p.price+'"></div>'
    +'<div><label class="lb">قبل التخفيض</label><input id="p_old" type="number" value="'+(p.oldPrice||'')+'"></div></div>'
    +'<div style="margin-top:14px"><label class="lb">رابط الصورة *</label><input id="p_img" dir="ltr" value="'+esc(p.image)+'"></div>'
    +'<div style="margin-top:14px"><label class="lb">الوصف</label><textarea id="p_desc" rows="3" style="resize:none">'+esc(p.description)+'</textarea></div>'
    +'<div class="f2 c3" style="margin-top:14px;align-items:end">'
    +'<div><label class="lb">المخزون</label><input id="p_stock" type="number" value="'+p.stock+'"></div>'
    +'<label class="chk"><input type="checkbox" id="p_feat"'+(p.featured?' checked':'')+'> منتج مميز</label>'
    +'<label class="chk"><input type="checkbox" id="p_act"'+(p.active?' checked':'')+'> ظاهر في المتجر</label></div>'
    +'<div id="p_err" class="err" style="display:none;margin-top:12px"></div>'
    +'<div style="display:flex;gap:10px;justify-content:flex-end;margin-top:20px;border-top:1px solid rgba(14,23,38,.1);padding-top:16px">'
    +'<button class="abtn gray" onclick="closeP()">إلغاء</button>'
    +'<button class="abtn" id="p_save" onclick="saveP()">حفظ المنتج</button></div>';
  document.getElementById('pmodal').classList.add('on');
}
function closeP(){ document.getElementById('pmodal').classList.remove('on'); editing=null; }

function saveP(){
  var v=function(id){ return document.getElementById(id).value.trim(); };
  var name=v('p_name'), price=Number(v('p_price')), img=v('p_img');
  var e=document.getElementById('p_err');
  if(!name || !price || price<=0 || !img){ e.textContent='المرجو ملء الاسم والثمن ورابط الصورة'; e.style.display='block'; return; }
  e.style.display='none';
  var old=v('p_old');
  var body={
    name:name, category:document.getElementById('p_cat').value, price:price,
    oldPrice: old===''?null:Number(old), image:img, description:v('p_desc'),
    stock:Number(v('p_stock'))||0,
    featured:document.getElementById('p_feat').checked,
    active:document.getElementById('p_act').checked
  };
  var btn=document.getElementById('p_save'); btn.disabled=true; btn.textContent='جاري الحفظ...';
  var url = editing ? API+'/api/admin/products/'+editing.id : API+'/api/admin/products';
  fetch(url,{ method: editing?'PATCH':'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) })
    .then(function(r){ return r.json().then(function(d){ if(!r.ok) throw new Error(d.error||'خطأ'); return d; }); })
    .then(function(saved){
      if(editing){ for(var i=0;i<aProducts.length;i++){ if(aProducts[i].id===saved.id) aProducts[i]=saved; } }
      else aProducts.unshift(saved);
      closeP(); renderProds(); toast(editing?'تم تحديث المنتج':'تمت إضافة المنتج');
    })
    .catch(function(err){ e.textContent=err.message||'تعذر الحفظ'; e.style.display='block'; })
    .then(function(){ btn.disabled=false; btn.textContent='حفظ المنتج'; });
}

document.addEventListener('keydown', function(e){
  if(e.key!=='Escape') return;
  if(document.getElementById('pmodal').classList.contains('on')) return closeP();
  if(document.getElementById('adm').classList.contains('on')) return closeAdmin();
  close();
});

renderChips(); render(); badge();

/* تحديد عنوان المتجر عند فتح الصفحة (يصحح الصور والسلة تلقائياً) */
resolveApi(function(ok){
  if(ok){ render(); if(document.getElementById('dw').classList.contains('on')) drawer(); }
});
</script>
</body>
</html>`;
}
