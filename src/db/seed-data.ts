/** بيانات البداية: المنتجات والإعدادات الافتراضية */

export const SEED_PRODUCTS = [
  {
    name: "قلاية هوائية رقمية 5.5 لتر",
    description:
      "قلاية هوائية بشاشة رقمية تعمل باللمس، سعة عائلية 5.5 لتر، 8 برامج طبخ مسبقة، سلة قابلة للإزالة وسهلة التنظيف. اطبخ بدون زيت تقريباً وبنتائج مقرمشة ذهبية.",
    price: 749,
    oldPrice: 999,
    image: "/images/products/airfryer.jpg",
    category: "المطبخ",
    stock: 14,
    featured: true,
  },
  {
    name: "خلاط كهربائي احترافي 800 واط",
    description:
      "خلاط زجاجي بسعة 1.5 لتر مع 3 سرعات ونبض، شفرات ستانلس حادة تسحق الثلج والفواكه المجمدة. مثالي للعصائر والحساء والصلصات.",
    price: 329,
    oldPrice: 429,
    image: "/images/products/blender.jpg",
    category: "المطبخ",
    stock: 22,
    featured: true,
  },
  {
    name: "غلاية كهربائية ستانلس 1.8 لتر",
    description:
      "غلاية من الستانلس ستيل المقاوم للصدأ، غليان سريع مع إيقاف تلقائي وحماية من التشغيل الفارغ، قاعدة دوارة 360 درجة.",
    price: 199,
    oldPrice: 259,
    image: "/images/products/kettle.jpg",
    category: "المطبخ",
    stock: 30,
    featured: false,
  },
  {
    name: "طقم أواني طبخ جرانيت 10 قطع",
    description:
      "طقم كامل بطلاء جرانيت مضاد للالتصاق، يتكون من 4 طناجر بأحجام مختلفة + مقلاة + غطاء زجاجي لكل قطعة. مناسب لجميع أنواع المواقد بما فيها التعريفي.",
    price: 899,
    oldPrice: 1199,
    image: "/images/products/cookware.jpg",
    category: "المطبخ",
    stock: 9,
    featured: true,
  },
  {
    name: "آلة إسبريسو أوتوماتيكية 15 بار",
    description:
      "آلة قهوة إسبريسو بمضخة إيطالية 15 بار، فوهة بخار لتسخين وتكثيف الحليب، خزان ماء 1.2 لتر قابل للإزالة. قهوتك المفضلة في المنزل بجودة المقاهي.",
    price: 1290,
    oldPrice: 1590,
    image: "/images/products/espresso.jpg",
    category: "المطبخ",
    stock: 7,
    featured: true,
  },
  {
    name: "مكنسة روبوت ذكية بالليزر",
    description:
      "مكنسة روبوت بخرائط ليزر ذكية، شفط قوي 2700Pa، تحكم عبر التطبيق والأوامر الصوتية، عودة تلقائية لقاعدة الشحن. نظف منزلك وأنت مرتاح.",
    price: 1490,
    oldPrice: 1990,
    image: "/images/products/robotvacuum.jpg",
    category: "إلكترونيات",
    stock: 6,
    featured: true,
  },
  {
    name: "سماعات بلوتوث لاسلكية بعزل الضوضاء",
    description:
      "سماعات فوق الأذن بعزل نشط للضوضاء، بطارية تدوم 40 ساعة، بلوتوث 5.3 مع اتصال بجهازين في نفس الوقت، قابلة للطي مع حقيبة حمل.",
    price: 449,
    oldPrice: 599,
    image: "/images/products/headphones.jpg",
    category: "إلكترونيات",
    stock: 18,
    featured: true,
  },
  {
    name: "ساعة ذكية بشاشة أموليد",
    description:
      "ساعة ذكية بشاشة AMOLED عالية الوضوح، قياس نبض القلب والأكسجين والنوم، أكثر من 100 وضع رياضي، مقاومة للماء، بطارية 10 أيام.",
    price: 699,
    oldPrice: 899,
    image: "/images/products/smartwatch.jpg",
    category: "إلكترونيات",
    stock: 12,
    featured: true,
  },
  {
    name: "مكبر صوت بلوتوث 360°",
    description:
      "مكبر صوت محمول بصوت محيطي 360 درجة، مقاوم للماء والغبار IP67، بطارية 20 ساعة، مثالي للرحلات والمناسبات.",
    price: 349,
    oldPrice: null,
    image: "/images/products/speaker.jpg",
    category: "إلكترونيات",
    stock: 25,
    featured: false,
  },
  {
    name: "مروحة برجية رقمية بجهاز تحكم",
    description:
      "مروحة برجية أنيقة بارتفاع 110 سم، 3 أوضاع هواء مع مؤقت حتى 8 ساعات، جهاز تحكم عن بعد، تشغيل هادئ مثالي لغرف النوم.",
    price: 549,
    oldPrice: 699,
    image: "/images/products/towerfan.jpg",
    category: "المنزل",
    stock: 11,
    featured: false,
  },
  {
    name: "زربية مغربية تقليدية 160×230",
    description:
      "زربية مغربية منسوجة يدوياً بألوان دافئة ونقوش تقليدية أصيلة، تضيف لمسة مغربية راقية للصالون أو غرفة الجلوس.",
    price: 799,
    oldPrice: 999,
    image:
      "https://images.pexels.com/photos/19464831/pexels-photo-19464831.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    category: "المنزل",
    stock: 5,
    featured: false,
  },
  {
    name: "كاميرا فورية للطباعة الفورية",
    description:
      "كاميرا فورية بطابع ممتع تطبع الصور بحجم بطاقة الائتمان خلال ثوانٍ، عدسة سيلفي بمرآة، مثالية للرحلات والذكريات.",
    price: 1150,
    oldPrice: 1350,
    image:
      "https://images.pexels.com/photos/16045125/pexels-photo-16045125.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    category: "إلكترونيات",
    stock: 8,
    featured: false,
  },
  {
    name: "إبريق شاي زجاجي مقاوم للحرارة",
    description:
      "إبريق شاي من الزجاج البوروسيليكات المقاوم للحرارة مع مصفاة ستانلس، سعة 1 لتر، مثالي لتقديم أتاي المغربي بأناقة.",
    price: 149,
    oldPrice: 189,
    image:
      "https://images.pexels.com/photos/10900909/pexels-photo-10900909.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    category: "المطبخ",
    stock: 20,
    featured: false,
  },
  {
    name: "سكين شيف ألماني ستانلس 20 سم",
    description:
      "سكين شيف احترافي من الستانلس ستيل الألماني بمقبض مريح مضاد للانزلاق، نصل حاد يدوم طويلاً، مثالي لكل مهام التقطيع.",
    price: 189,
    oldPrice: null,
    image:
      "https://images.pexels.com/photos/30327171/pexels-photo-30327171.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    category: "المطبخ",
    stock: 16,
    featured: false,
  },
];

export const SEED_SETTINGS: Record<string, string> = {
  site_url: "https://chaouishop.app",
  site_url_enabled: "true",
  shipping_fee: "35",
  free_shipping_threshold: "500",
  categories: "المطبخ,إلكترونيات,المنزل",
  store_phone: "0600-000000",
  store_whatsapp: "212600000000",
};
