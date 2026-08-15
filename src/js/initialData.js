// Default Gravatar Profile & Portfolio Data
export const initialProfileData = {
  name: "Billal Hossen",
  username: "veloralbillal",
  email: "billalhossen.self@gmail.com",
  title: "Digital Educator & Ethical Tech Enthusiast",
  company: "SylhetScribe.xyz",
  location: "Sylhet, Bangladesh",
  pronouns: "he/him",
  googleUrl: "https://google.com",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
  coverUrl: "",
  coverGradient: "from-[#d9a58b] via-[#e5b7a0] to-[#c69279]",
  verified: true,
  bio: "I'm Billal Hossen, a digital educator and ethical hacking enthusiast from Sylhet, Bangladesh. I simplify tech education, full-stack web development, and digital security tools for everyone.",
  statusText: "🚀 Active Educator",
  joinedDate: "Member since 2021",
  gravatarRating: "G Rated - Suitable for all audiences",
  
  headerBrandName: "GravatarHub",
  footerBrandName: "Gravatar Profile Hub",
  
  // Network / Our Websites list
  websites: [
    {
      id: "site_1",
      name: "SylhetScribe.xyz",
      url: "https://sylhetscribe.xyz",
      description: "Digital education, tech guides, and ethical security insights.",
      category: "Education & Tech"
    },
    {
      id: "site_2",
      name: "Billal Tech Hub",
      url: "https://billalhossen.com",
      description: "Official developer portfolio, blog, and web engineering tools.",
      category: "Portfolio & Blog"
    },
    {
      id: "site_3",
      name: "Veloral Studio & GitHub",
      url: "https://github.com/billal-hossen",
      description: "Open source software repositories, React templates, and security scripts.",
      category: "Open Source"
    }
  ],
  
  // Custom SEO Config
  seo: {
    title: "Billal Hossen | Gravatar Digital Identity & Portfolio",
    description: "Official Gravatar digital business card, verified social accounts, portfolio showcase, and direct contact portal for Billal Hossen.",
    keywords: "Billal Hossen, Gravatar, Web Developer, Full Stack Engineer, Social Links, Portfolio",
    ogImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1200"
  },

  // Social accounts collection (A to Z)
  socialLinks: [
    {
      id: "github",
      name: "GitHub",
      category: "Code",
      handle: "@billal-hossen",
      url: "https://github.com",
      icon: "Github",
      color: "bg-slate-900 text-white dark:bg-slate-800",
      verified: true,
      clicks: 342,
      description: "Open source repositories, core libraries, and pull requests."
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      category: "Professional",
      handle: "in/billal-hossen",
      url: "https://linkedin.com",
      icon: "Linkedin",
      color: "bg-blue-600 text-white",
      verified: true,
      clicks: 285,
      description: "Professional career history, endorsements, and network."
    },
    {
      id: "twitter",
      name: "Twitter / X",
      category: "Social",
      handle: "@billal_self",
      url: "https://x.com",
      icon: "Twitter",
      color: "bg-black text-white dark:bg-slate-900",
      verified: true,
      clicks: 210,
      description: "Tech insights, web development tips, and AI updates."
    },
    {
      id: "youtube",
      name: "YouTube",
      category: "Media",
      handle: "@BillalCodeLab",
      url: "https://youtube.com",
      icon: "Youtube",
      color: "bg-red-600 text-white",
      verified: true,
      clicks: 175,
      description: "Full-stack web tutorials, UI teardowns, and tech talks."
    },
    {
      id: "instagram",
      name: "Instagram",
      category: "Social",
      handle: "@billal.designs",
      url: "https://instagram.com",
      icon: "Instagram",
      color: "bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-white",
      verified: true,
      clicks: 160,
      description: "Design snapshots, desk setups, and creative behind-the-scenes."
    },
    {
      id: "facebook",
      name: "Facebook",
      category: "Social",
      handle: "facebook.com/billal.self",
      url: "https://facebook.com",
      icon: "Facebook",
      color: "bg-blue-700 text-white",
      verified: true,
      clicks: 140,
      description: "Personal updates, community groups, and technology posts."
    },
    {
      id: "discord",
      name: "Discord Community",
      category: "Gaming",
      handle: "billal#8892",
      url: "https://discord.gg",
      icon: "MessageSquare",
      color: "bg-indigo-600 text-white",
      verified: true,
      clicks: 125,
      description: "Dev community server, live pair programming, and support."
    },
    {
      id: "telegram",
      name: "Telegram Channel",
      category: "Contact",
      handle: "@billal_official",
      url: "https://t.me",
      icon: "Send",
      color: "bg-sky-500 text-white",
      verified: true,
      clicks: 190,
      description: "Direct instant chat, project quotes, and announcement channel."
    },
    {
      id: "whatsapp",
      name: "WhatsApp Direct",
      category: "Contact",
      handle: "+880 1700-000000",
      url: "https://wa.me/8801700000000",
      icon: "PhoneCall",
      color: "bg-emerald-600 text-white",
      verified: true,
      clicks: 220,
      description: "Instant message for quick client inquiries and urgent tasks."
    },
    {
      id: "spotify",
      name: "Spotify Playlist",
      category: "Media",
      handle: "Deep Coding Focus",
      url: "https://spotify.com",
      icon: "Music",
      color: "bg-emerald-500 text-white",
      verified: true,
      clicks: 98,
      description: "Curated ambient & synthwave tracks for uninterrupted coding."
    },
    {
      id: "devto",
      name: "Dev.to Articles",
      category: "Code",
      handle: "@billalhossen",
      url: "https://dev.to",
      icon: "Code",
      color: "bg-slate-800 text-white",
      verified: true,
      clicks: 112,
      description: "Technical articles on React, Express, and performance optimization."
    },
    {
      id: "medium",
      name: "Medium Stories",
      category: "Professional",
      handle: "@billal.hossen",
      url: "https://medium.com",
      icon: "BookOpen",
      color: "bg-slate-900 text-white",
      verified: false,
      clicks: 84,
      description: "In-depth architectural guides and engineering leadership thoughts."
    },
    {
      id: "dribbble",
      name: "Dribbble Shots",
      category: "Media",
      handle: "billal_ux",
      url: "https://dribbble.com",
      icon: "Dribbble",
      color: "bg-pink-600 text-white",
      verified: true,
      clicks: 95,
      description: "UI components, mobile app concepts, and micro-animations."
    },
    {
      id: "website",
      name: "Personal Website",
      category: "Professional",
      handle: "billalhossen.com",
      url: "https://billalhossen.com",
      icon: "Globe",
      color: "bg-teal-600 text-white",
      verified: true,
      clicks: 310,
      description: "Main portfolio site, blog posts, and interactive web tools."
    }
  ],

  // Verified credentials & Web3 Wallets
  verifiedCredentials: [
    {
      id: "domain_proof",
      title: "Verified Domain Ownership",
      issuer: "DNS SEC Proof",
      identifier: "billalhossen.com",
      verifiedDate: "Verified Aug 2024",
      icon: "ShieldCheck",
      status: "Active"
    },
    {
      id: "gravatar_verified",
      title: "Gravatar Primary Profile",
      issuer: "Automattic / Gravatar",
      identifier: "billalhossen.self@gmail.com",
      verifiedDate: "Verified Account",
      icon: "Award",
      status: "Verified"
    }
  ],

  cryptoWallets: [
    {
      symbol: "ETH",
      name: "Ethereum / EVM",
      address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      network: "Ethereum Mainnet / Polygon / Arbitrum"
    },
    {
      symbol: "BTC",
      name: "Bitcoin Native",
      address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      network: "Bitcoin Network"
    },
    {
      symbol: "SOL",
      name: "Solana Address",
      address: "7xKXtg2CW87d97TXJSDpbD5jBk45M59SbhN715N6k34r",
      network: "Solana Mainnet"
    }
  ],

  // Featured Projects
  projects: [
    {
      id: "proj_1",
      title: "NovaCloud AI Dashboard",
      category: "Web Application",
      description: "Next-generation analytics dashboard with AI insights, automated reporting, and real-time WebSocket telemetry.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600",
      demoUrl: "https://example.com/novacloud",
      tags: ["React", "Express", "Tailwind", "Gemini API"],
      stars: 128
    },
    {
      id: "proj_2",
      title: "Gravatar Matrix Theme Engine",
      category: "Open Source Tool",
      description: "Lightweight CSS and JS engine for generating responsive Gravatar identity cards with dark mode and micro-interactions.",
      image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=600",
      demoUrl: "https://example.com/gravatar-theme",
      tags: ["TypeScript", "Tailwind", "CSS Grid"],
      stars: 245
    },
    {
      id: "proj_3",
      title: "CryptoPay Web3 Gateway",
      category: "Web3 & Fintech",
      description: "Non-custodial crypto payment gateway for online merchants supporting instant QR checkout across multiple chains.",
      image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=600",
      demoUrl: "https://example.com/cryptopay",
      tags: ["Ethers.js", "React", "Node.js"],
      stars: 94
    }
  ],

  // Photos Gallery
  galleryPhotos: [
    {
      id: "photo_1",
      title: "Minimal Developer Workstation",
      url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600",
      caption: "Dual monitors, mechanical keyboard, and hot coffee."
    },
    {
      id: "photo_2",
      title: "Keynote Presentation at Tech Summit",
      url: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=600",
      caption: "Speaking about modern full-stack web architectures."
    },
    {
      id: "photo_3",
      title: "UI System Design Exploration",
      url: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=600",
      caption: "Iterating on color tokens and high-contrast dark themes."
    }
  ],

  // Crypto & Payment Wallets Control (BTC, LTC, ETH, USDT, SOL, etc)
  cryptoWallets: [
    {
      id: "wallet_btc",
      symbol: "BTC",
      name: "Bitcoin",
      network: "Bitcoin Native Mainnet",
      address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      qrUrl: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=bitcoin:bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      iconColor: "from-amber-500 to-orange-600",
      enabled: true,
      note: "Send only BTC to this Bitcoin network address."
    },
    {
      id: "wallet_ltc",
      symbol: "LTC",
      name: "Litecoin",
      network: "Litecoin Mainnet",
      address: "ltc1q98k7u3v3hxmg5lq2k7s9kzp83k2m09shxfv3x4",
      qrUrl: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=litecoin:ltc1q98k7u3v3hxmg5lq2k7s9kzp83k2m09shxfv3x4",
      iconColor: "from-slate-400 to-blue-500",
      enabled: true,
      note: "Fast and low-fee Litecoin payments."
    },
    {
      id: "wallet_eth",
      symbol: "ETH",
      name: "Ethereum",
      network: "Ethereum (ERC-20 / Arbitrum / Base)",
      address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      qrUrl: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ethereum:0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      iconColor: "from-indigo-500 to-purple-600",
      enabled: true,
      note: "Supports ETH on Ethereum, Arbitrum, Optimism & Base."
    },
    {
      id: "wallet_usdt",
      symbol: "USDT",
      name: "Tether USD",
      network: "Tron (TRC-20) & BNB Chain (BEP-20)",
      address: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
      qrUrl: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
      iconColor: "from-emerald-500 to-teal-600",
      enabled: true,
      note: "Send USDT on TRC-20 Tron network or BEP-20."
    },
    {
      id: "wallet_sol",
      symbol: "SOL",
      name: "Solana",
      network: "Solana Mainnet-Beta",
      address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      qrUrl: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=solana:7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      iconColor: "from-fuchsia-500 to-purple-600",
      enabled: true,
      note: "Instant low-cost Solana transfers."
    }
  ],

  // Donation & Support Configuration
  donationConfig: {
    enabled: true,
    title: "Support & Sponsor My Work",
    subtitle: "Help keep open-source education, tech tutorials, and developer tools accessible to everyone worldwide.",
    message: "Thank you for considering supporting my work! Every single contribution directly helps me create in-depth tech guides, maintain open-source software, and keep community resources free.",
    goal: {
      enabled: true,
      title: "Monthly Community Education & Hosting Goal",
      currentAmount: 185,
      targetAmount: 500,
      currency: "$"
    },
    platforms: {
      buymeacoffee: {
        enabled: true,
        username: "veloralbillal",
        url: "https://buymeacoffee.com/veloralbillal",
        label: "Buy Me a Coffee",
        note: "Support with a $3 coffee or one-time tip"
      },
      paypal: {
        enabled: true,
        username: "veloralbillal",
        url: "https://paypal.me/veloralbillal",
        label: "PayPal",
        note: "Direct instant donation via PayPal or Credit Card"
      },
      kofi: {
        enabled: true,
        username: "veloralbillal",
        url: "https://ko-fi.com/veloralbillal",
        label: "Ko-fi",
        note: "Support with 0% platform fee"
      },
      githubSponsors: {
        enabled: true,
        username: "billal-hossen",
        url: "https://github.com/sponsors/billal-hossen",
        label: "GitHub Sponsors",
        note: "Sponsor open-source dev repositories directly"
      },
      patreon: {
        enabled: false,
        username: "veloralbillal",
        url: "https://patreon.com/veloralbillal",
        label: "Patreon",
        note: "Monthly membership with exclusive community perks"
      },
      customLink: {
        enabled: false,
        label: "Custom Sponsor Portal",
        url: "",
        note: "Stripe, Razorpay, or OpenCollective support"
      }
    },
    localPayment: {
      enabled: true,
      title: "Local Mobile Banking (Bangladesh)",
      note: "Send Money (Personal) with your name as reference",
      bkash: {
        number: "01700-000000",
        type: "Personal",
        enabled: true
      },
      nagad: {
        number: "01700-000000",
        type: "Personal",
        enabled: true
      },
      rocket: {
        number: "01700-000000-0",
        type: "Personal",
        enabled: false
      }
    },
    presetTiers: [
      {
        id: "tier_1",
        amount: 3,
        currency: "$",
        label: "Buy a Coffee ☕",
        desc: "A quick token of appreciation for open tutorials and free tools."
      },
      {
        id: "tier_2",
        amount: 10,
        currency: "$",
        label: "Tech Book & Tools 📖",
        desc: "Help fund programming books, subscriptions, and code research."
      },
      {
        id: "tier_3",
        amount: 25,
        currency: "$",
        label: "Server & Hosting 🚀",
        desc: "Covers monthly cloud hosting, testing clusters, and domains."
      },
      {
        id: "tier_4",
        amount: 50,
        currency: "$",
        label: "Golden Sponsor ⭐",
        desc: "Special shoutout in open-source READMEs and website credits."
      }
    ]
  }
};
