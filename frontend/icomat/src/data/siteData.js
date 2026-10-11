/**
 * Icomat Site Data Model
 * Extracted directly from live Next.js SSG Prismic payload
 */
export const siteData = {
  meta: {
    title: "ICOMAT - Engineer Without Limits™",
    description: "Transformational lightweighting solutions. We design and produce the world's lightest structures for the aerospace and automotive."
  },
  hero: {
    title: "Engineer \nWithout Limits™",
    text: "The only composite manufacturer in the world delivering steered fiber composites at scale. Unlocking design and performance never thought possible.",
    videoDesktop: "/videos/hero-desktop.mp4",
    poster: "./assets/images/aWER2AIvOtkhBOig_ICOMAT-HOMEBACKGROUNDVIDEO2.webp",
    ctaLabel: "Build with Icomat"
  },
  navigation: [
    { label: "solutions", href: "/solutions" },
    { label: "tech", href: "/tech" },
    { label: "industries", href: "/industries" },
    { 
      label: "The Company", 
      submenu: [
        { label: "manifesto", href: "/manifesto" },
        { label: "careers", href: "/careers" },
        { label: "whitepapers", href: "/whitepapers" }
      ] 
    }
  ],
  rtsIntro: {
    heading: "ICOMAT invented RTS. \nRapid Tow Shearing.",
    title: "The RTS Revolution",
    description: "For 50 years, composites were limited to straight lines. Our patented RTS process removes that constraint. Fibers can now flow along curves to build lighter, stronger, more efficient parts."
  },
  compositesComparison: [
    {
      title: "Conventional / straight Fiber Composites",
      tag: "Before RTS",
      description: "Composite materials are only strong in the fiber direction. Traditional manufacturing relies on straight fiber layers, but real-world forces don’t follow straight lines. This means more material, more weight, and higher cost than necessary.",
      videoMp4: "/videos/composites/A01.mp4",
      image: "./assets/images/aSmCfHNYClf9nkeJ_Container.png"
    },
    {
      title: "RTS / Steered Fiber Composites",
      tag: "RTS Design",
      highlight: "Up to 65% lighter, \n10x faster production",
      description: "With Rapid Tow Shearing (RTS), each fiber is precisely steered to follow the load path of the structure and not limited to fixed 0°, ±45°, or 90° angles. Form and function become one continuous flow.",
      videoMp4: "/videos/composites/A02.mp4",
      image: "./assets/images/aSmCn3NYClf9nkeR_Container2.png"
    }
  ],
  stats: [
    { number: "65%", label: "Lighter structures" },
    { number: "10×", label: "Faster production" },
    { number: "0", label: "Defects at scale" },
    { number: "100%", label: "Automation digital thread" }
  ],
  testimonials: [
    {
      company: "Joby Aviation",
      logo: "./assets/images/aVFZ23NYClf9oqbg_f48a5d32-6963-4b34-93e0-f9bcf5d41c69.png",
      quote: "I believe that ICOMAT has unlocked the full potential of composites. Thanks to their unique Rapid Tow Shearing manufacturing process, Engineers can now design and produce composite structures with unparalleled fiber optimization.",
      author: "John Geriguis, AD @Joby Aviation"
    },
    {
      company: "BAE Systems",
      logo: "./assets/images/aVFaI3NYClf9oqbl_Isolation_Mode.png",
      quote: "Delivering cost effective and innovative solutions across our manufacturing operations is critical to maintaining a leading position in the UK combat air sector. Working alongside organisations like iCOMAT helps us to ensure we’re able to maintain that edge for our customers.",
      author: "Paul, Head of Airframe Technology @BAE Systems"
    },
    {
      company: "NIAR",
      logo: "./assets/images/aVFaDHNYClf9oqbj_Untitled-11.png",
      quote: "At NIAR, we work with some of the most advanced manufacturing technologies in the world, and iCOMAT stands out as a true innovator. Their novel approach to composite manufacturing represents a significant leap forward in performance and design flexibility.",
      author: "Waruna Seneviratne, Director @NIAR"
    },
    {
      company: "Pall Aerospace",
      logo: "./assets/images/aZW3KFWLo0XkEoW5_logo-pall.png",
      quote: "Impressed with ICOMAT’s first production delivery: quality parts, reliable timelines, and responsive support. A great start to our partnership.",
      author: "Craig Eason, Supplier Relationship Manager @Pall Aerospace"
    }
  ],
  featureCards: [
    {
      title: "Steered composites",
      description: "The only process that steers fibers freely, unlocking designs no one else can make.",
      lottie: "/lottie/cards/Icon0A.json"
    },
    {
      title: "Lighter structures",
      description: "Up to 65% weight savings with equal or higher strength.",
      lottie: "/lottie/cards/Icon02.json"
    },
    {
      title: "Zero defects",
      description: "Perfect parts every time. No compromises.",
      lottie: "/lottie/cards/Icon03.json"
    },
    {
      title: "Faster designs",
      description: "10× faster than traditional methods. Preforms in minutes, parts in hours.",
      lottie: "/lottie/cards/Icon04.json"
    },
    {
      title: "Integrated partner",
      description: "From design to production, everything under one roof, one partner instead of many.",
      lottie: "/lottie/cards/Icon05.json"
    }
  ]
};
