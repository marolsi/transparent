import React, { useState, useRef, useEffect } from "react";

// ─── ISSUES ───────────────────────────────────────────────────────────────────
// Each issue maps to specific tabs and data keys within company profiles.
// The platform surfaces relevant data points without editorializing.

const ISSUES = [
  { id:"worker_treatment",          label:"Worker Treatment",                       icon:"👷",    relevantTabs:["labor"],             relevantKeys:["compensation","layoffs","unionization"] },
  { id:"immigrant_rights",          label:"Immigrant Rights",                       icon:"🌐",    relevantTabs:["labor","political"],  relevantKeys:["immigration","hiring","iceContracts","dueProcess"] },
  { id:"dei",                       label:"Diversity, Equity & Inclusion",          icon:"🤝",    relevantTabs:["labor","governance"], relevantKeys:["boardComposition","dei"] },
  { id:"lgbtq",                     label:"LGBTQ+ Advocacy",                        icon:"🏳️‍🌈",   relevantTabs:["labor","political"],  relevantKeys:["lgbtq","benefits"] },
  { id:"environmental_sustainability",label:"Environmental Sustainability",          icon:"🌱",    relevantTabs:["environment"],        relevantKeys:["emissions","targets"] },
  { id:"free_speech",               label:"Free Speech",                            icon:"🗣️",    relevantTabs:["business","political"],relevantKeys:["moderation","content"] },
  { id:"fact_checking",             label:"Fact-Checking & Moderation",             icon:"🔍",    relevantTabs:["business","political"],relevantKeys:["moderation","content"] },
  { id:"child_safety",              label:"Child Safety",                           icon:"🧒",    relevantTabs:["legal","privacy"],    relevantKeys:["childSafety","minors"] },
  { id:"animal_welfare",            label:"Animal Welfare",                         icon:"🐾",    relevantTabs:["environment","business"],relevantKeys:["supplyChain","welfare"] },
  { id:"data_privacy",              label:"Personal Data & Privacy",                icon:"🔒",    relevantTabs:["privacy","business"], relevantKeys:["tracking","dataCollection"] },
  { id:"health_wellbeing",          label:"Health & Well-being",                   icon:"🧬",    relevantTabs:["legal","business"],   relevantKeys:["safety","health"] },
  { id:"corporate_power",           label:"Corporate Power & Market Manipulation",  icon:"⚖️",    relevantTabs:["legal","governance"], relevantKeys:["antitrust","acquisitions"] },
];

// ─── ISSUE → COMPANY DATA MAPPING ────────────────────────────────────────────
// For each company × issue, what specific data points are most relevant?
// These appear as highlighted callouts when user has flagged that issue.

const ISSUE_RELEVANCE = {
  // ─────────────────────────────────────────────────────────────── META ──────
  meta: {
    worker_treatment: {
      headline: "Meta cut 21,000 jobs in 2022–2023, then rehired. Content moderation remains outsourced to contractors.",
      dataPoints: [
        "Median employee comp ($397K) reflects all-tech workforce; contractor moderators earn $18–24/hr and are not Meta employees",
        "Nov 2022: 11,000 layoffs (13%). Mar 2023: 10,000 more (13%). Both rounds within 5 months.",
        "No workforce is unionized. Meta grew headcount again in 2024 to 74,067 — above pre-layoff levels.",
      ],
      tabs: ["labor"],
    },
    immigrant_rights: {
      headline: "Meta has complied with government requests to suppress immigrant-protection tools and hand over user data to ICE.",
      dataPoints: [
        "Meta removed a Facebook group used by communities to track immigration agent activity at DOJ request, citing 'coordinated harm' policies",
        "ICE demanded Meta hand over personal information attached to Instagram accounts that monitor immigration raids; Meta's response not fully disclosed",
        "No direct ICE infrastructure contracts, but Meta has acted as a compliance partner in government enforcement operations",
        "H-1B sponsorship is consistent with peer tech companies; no outlier immigration hiring practices on record",
      ],
      tabs: ["labor", "political"],
    },
    dei: {
      headline: "Meta ended its DEI programs in early 2025, reversing public 2020 commitments.",
      dataPoints: [
        "Ended supplier diversity program and internal equity initiatives in Jan 2025 under political pressure",
        "Board: 3 of 9 members are women; 7 of 9 are independent directors",
        "Meta cited the 'changing legal landscape' as its rationale; LGBTQ+ groups raised concerns",
      ],
      tabs: ["labor", "governance"],
    },
    lgbtq: {
      headline: "Meta historically offered LGBTQ+-inclusive benefits. 2025 DEI rollbacks raised concerns from advocacy groups.",
      dataPoints: [
        "Historically offered inclusive benefits including same-sex partner coverage and gender-affirming care",
        "2025 DEI rollback removed equity-focused programs; LGBTQ+ advocacy groups flagged impact",
        "No formal LGBTQ+ policy changes announced alongside DEI rollback as of Q1 2025",
      ],
      tabs: ["labor", "political"],
    },
    reproductive: {
      headline: "Meta offered travel reimbursement for reproductive healthcare after Dobbs. Quietly scaled back in 2025.",
      dataPoints: [
        "After the 2022 Dobbs ruling, Meta announced travel reimbursement for employees seeking reproductive healthcare",
        "Under political pressure in early 2025, the policy was quietly scaled back",
        "Meta has not made public statements explaining the policy change",
      ],
      tabs: ["labor", "political"],
    },
    environmental_sustainability: {
      headline: "Claims 100% renewable energy and 2030 net-zero. AI infrastructure expansion is putting these goals at risk.",
      dataPoints: [
        "Scope 3 (supply chain) emissions: 4.0M MT CO₂e — largest category, includes hardware manufacturing",
        "100% renewable claim relies on RECs (renewable energy certificates), not direct power purchase",
        "Meta guided $60–65B capex for 2025, up from $38B in 2024 — AI build-out creates measurable risk to 2030 targets",
      ],
      tabs: ["environment"],
    },
    online_speech: {
      headline: "Meta ended its third-party fact-checking program in Jan 2025. Internal docs showed COVID content suppression at White House request.",
      dataPoints: [
        "Third-party fact-checking program replaced with Community Notes-style system in Jan 2025",
        "Internal documents (via whistleblower) showed accurate COVID-19 information was suppressed at White House request",
        "Meta has removed content for foreign authoritarian governments including Vietnam and Turkey",
      ],
      tabs: ["business", "political"],
    },
    free_speech: {
      headline: "Meta removed its fact-checking program in Jan 2025, shifting toward a less-moderated Community Notes model.",
      dataPoints: [
        "Third-party fact-checking program ended Jan 2025; replaced with user-sourced Community Notes",
        "Meta has complied with government requests to remove legal speech — including from foreign authoritarian governments",
        "Zuckerberg stated the prior system had 'too much censorship' in announcing the change",
      ],
      tabs: ["business", "political"],
    },
    fact_checking: {
      headline: "Meta ended independent fact-checking in Jan 2025. Internal docs showed it suppressed accurate COVID content at White House request.",
      dataPoints: [
        "Third-party fact-checking replaced with Community Notes — a less robust, crowd-sourced system",
        "Whistleblower documents: Meta suppressed accurate COVID-19 information at explicit White House request",
        "Meta has removed content on behalf of foreign governments including Vietnam and Turkey",
      ],
      tabs: ["business", "political"],
    },
    child_safety: {
      headline: "Meta's own research found Instagram harms teen girls' mental health — and suppressed it. A federal MDL is active.",
      dataPoints: [
        "Internal documents showed Instagram worsened body image in teenage girls; Meta did not disclose this publicly",
        "Federal MDL (In re Social Media Adolescent Addiction) now consolidates 1,400+ lawsuits from school districts and families",
        "Multiple state AG enforcement actions settled or ongoing as of 2026",
      ],
      tabs: ["legal", "privacy"],
    },
    animal_welfare: {
      headline: "Meta's direct operations don't involve animal supply chains. No significant animal welfare exposure.",
      dataPoints: [
        "Meta's operations are digital — no food, agriculture, or animal product supply chains",
        "Quest hardware involves electronics components with environmental but not specific animal welfare concerns",
        "No animal welfare controversies, investigations, or litigation on record",
      ],
      tabs: ["environment", "business"],
    },
    data_privacy: {
      headline: "98% of revenue comes from selling advertisers access to behavioral data.",
      dataPoints: [
        "Meta Pixel tracks users across ~30% of top websites, including people without accounts via 'shadow profiles'",
        "EU GDPR fine: €1.2B for illegal data transfers to US servers — largest GDPR fine ever issued",
        "WhatsApp messages are encrypted; metadata (who you talk to, when, how often) is collected and integrated",
      ],
      tabs: ["privacy", "business"],
    },
    health_wellbeing: {
      headline: "Meta faces 1,400+ active lawsuits alleging documented harm to youth mental health. No food or pharmaceutical operations.",
      dataPoints: [
        "Federal MDL consolidates 1,400+ cases from school districts and families alleging Instagram and Facebook caused harm to minors",
        "Internal Meta research showed adverse mental health effects in teenage girls; not publicly disclosed",
        "No food, pharmaceutical, or consumer product operations — health exposure is platform-related",
      ],
      tabs: ["legal"],
    },
    corporate_power: {
      headline: "FTC antitrust trial against Meta launched 2024. Zuckerberg holds 57% voting control with 13% economic ownership.",
      dataPoints: [
        "FTC alleges 'buy or bury': Instagram ($1B, 2012) and WhatsApp ($19B, 2014) acquired to neutralize competitors",
        "FTC antitrust trial launched 2024; potential remedy includes forced divestiture of Instagram and/or WhatsApp",
        "Zuckerberg's Class B shares give 10× voting weight; 57% voting control with only 13% economic ownership",
      ],
      tabs: ["legal", "governance"],
    },
  },

  // ────────────────────────────────────────────────────────────── AMAZON ──────
  amazon: {
    worker_treatment: {
      headline: "Median employee compensation is $37,000 — reflecting a majority warehouse and logistics workforce.",
      dataPoints: [
        "CEO pay ratio: 5,621:1 (Andy Jassy total comp vs. median employee, 2024)",
        "Starting warehouse wage: $18/hr; corporate engineers median ~$178,000",
        "NLRB has issued multiple unfair labor practice complaints for alleged union interference",
      ],
      tabs: ["labor"],
    },
    immigrant_rights: {
      headline: "AWS is the cloud backbone of ICE's enforcement operations, hosting the databases used to track, monitor, and deport immigrants.",
      dataPoints: [
        "AWS GovCloud hosts the Investigative Case Management (ICM) database — the core system ICE uses to identify and deport immigrants — originally built by Palantir",
        "As of 2023, CBP was hosting at least 62% of its systems on Amazon servers, making AWS foundational to border enforcement infrastructure",
        "AWS GovCloud hosts databases used by DHS, CBP, ICE, and USCIS to track and monitor immigrants across the US",
        "Amazon is partnering with Flock Safety and Axon to facilitate law enforcement access to Ring doorbell footage, including for ICE operations",
        "Amazon has not adopted a public policy limiting the use of its infrastructure for immigration enforcement or protecting immigrant workers' due process rights",
        "Amazon consistently ranks among the top 5 H-1B visa sponsors nationally",
      ],
      tabs: ["labor", "political"],
    },
    dei: {
      headline: "Board: 4 of 11 members are women. Amazon has not rolled back DEI programs as of 2023.",
      dataPoints: [
        "Board: 4 women of 11 total; 10 of 11 directors are independent",
        "Workforce diversity breakdown not fully disclosed; warehouse majority complicates aggregate comparison",
        "Shareholder DEI-reporting resolutions have been filed; management has opposed most",
      ],
      tabs: ["labor", "governance"],
    },
    lgbtq: {
      headline: "Amazon offers LGBTQ+-inclusive benefits and has historically supported Pride initiatives.",
      dataPoints: [
        "Offers gender-affirming care coverage and same-sex partner benefits across US operations",
        "Has sponsored Pride events and maintained internal LGBTQ+ employee resource groups",
        "No formal rollback of LGBTQ+ policies announced as of 2023",
      ],
      tabs: ["labor"],
    },
    reproductive: {
      headline: "Amazon offers travel reimbursement for reproductive healthcare — including abortion — for employees in states with restrictions.",
      dataPoints: [
        "Policy announced after 2022 Dobbs ruling: covers travel costs up to $4,000/year for reproductive healthcare",
        "Applies to employees in states where certain procedures are restricted or unavailable",
        "Policy has remained in place as of 2023; no rollback announced",
      ],
      tabs: ["labor"],
    },
    environmental_sustainability: {
      headline: "Total emissions: 71.5M MT CO₂e in 2022. Delivery fleet is the fastest-growing source.",
      dataPoints: [
        "Scope 3 (supply chain + delivery): 47M MT CO₂e — largest category",
        "100,000 electric Rivian vans ordered; majority of delivery fleet still ICE as of 2022",
        "Net-zero target: 2040. Absolute emissions grew significantly 2019–2021 as the company scaled.",
      ],
      tabs: ["environment"],
    },
    online_speech: {
      headline: "Amazon Web Services hosts much of the internet's infrastructure but is not a consumer speech platform.",
      dataPoints: [
        "AWS is a cloud infrastructure provider — it hosts platforms but does not set their speech policies",
        "AWS terminated Parler's hosting in Jan 2021 after the Jan 6 Capitol attack",
        "No ongoing content moderation controversies; Amazon.com product reviews have separate moderation policies",
      ],
      tabs: ["business"],
    },
    free_speech: {
      headline: "AWS terminated Parler's hosting in Jan 2021 — its most significant speech-related decision as an infrastructure provider.",
      dataPoints: [
        "AWS is infrastructure, not a speech platform — it sets terms of service, not content policy",
        "Parler termination after Jan 6 Capitol attack was AWS's most visible content-related action",
        "Amazon.com product reviews are moderated separately; no major free speech controversies on retail side",
      ],
      tabs: ["business"],
    },
    fact_checking: {
      headline: "Amazon does not operate a content or news platform. AWS infrastructure decisions are its closest analog to speech policy.",
      dataPoints: [
        "AWS terminated Parler after Jan 6 — viewed as a moderation decision by critics and as a terms-of-service enforcement by AWS",
        "No independent fact-checking program; not applicable to core business model",
        "Alexa and Kindle content have separate content policies with limited public disclosure",
      ],
      tabs: ["business"],
    },
    child_safety: {
      headline: "FTC settled with Amazon for $25M over children's Alexa data retention. Ring data-sharing also raised concerns.",
      dataPoints: [
        "2023 FTC settlement: Amazon retained children's voice data beyond lawful period and failed to delete on request ($25M penalty)",
        "Ring previously shared footage with 2,000+ police agencies without user warrants; ended 2022",
        "No active child safety MDL comparable to Meta's as of 2023",
      ],
      tabs: ["legal", "privacy"],
    },
    animal_welfare: {
      headline: "Amazon sells animal products through Whole Foods and amazon.com. Labeling and supply chain accountability are ongoing concerns.",
      dataPoints: [
        "Whole Foods markets itself on humane animal welfare standards; third-party auditing practices vary",
        "Amazon's marketplace hosts third-party sellers with varying animal product standards",
        "No major supply chain animal welfare enforcement actions or litigation as of 2023",
      ],
      tabs: ["business"],
    },
    data_privacy: {
      headline: "Amazon collects purchase history, Alexa recordings, Ring footage, and location across its full ecosystem.",
      dataPoints: [
        "Alexa retains voice recordings by default; deletion must be user-initiated",
        "Ring previously shared footage with 2,000+ police agencies without warrants — practice ended 2022",
        "Third-party seller data was used competitively — EU found this violated competition law",
      ],
      tabs: ["privacy", "business"],
    },
    health_wellbeing: {
      headline: "Amazon owns Whole Foods and One Medical. Drug pricing through Amazon Pharmacy is an emerging pressure point.",
      dataPoints: [
        "Amazon Pharmacy launched 2020; competes on drug pricing transparency with RxPass subscription program",
        "One Medical acquisition (2023, $3.9B) raised privacy concerns about health data integration with retail/ad systems",
        "Whole Foods labeling standards and supply chain claims have faced scrutiny from consumer groups",
      ],
      tabs: ["business", "legal"],
    },
    corporate_power: {
      headline: "FTC antitrust case against Amazon is active. EU fined €1.1B for marketplace data abuse.",
      dataPoints: [
        "FTC alleges Amazon illegally maintains monopoly in online retail through anti-competitive seller pricing and search practices",
        "EU found Amazon abused marketplace data — using third-party seller data to compete against those same sellers",
        "60%+ of units sold on amazon.com are from third-party sellers who pay listing, fulfillment, and advertising fees",
      ],
      tabs: ["legal", "governance"],
    },
  },

  // ─────────────────────────────────────────────────────────────── TESLA ──────
  tesla: {
    worker_treatment: {
      headline: "Median employee compensation is $48,655. NLRB has issued multiple unfair labor practice complaints.",
      dataPoints: [
        "10% workforce reduction executed April 2024; additional layoffs announced in early 2025 targeting management layers",
        "NLRB complaints cite illegal firings and surveillance of union organizers at the Fremont factory",
        "Swedish union dispute began late 2023; sympathy strikes spread across Nordic unions",
      ],
      tabs: ["labor"],
    },
    immigrant_rights: {
      headline: "Tesla has no direct ICE contracts, but Musk's role in the Trump administration and DOGE raises broader concerns about political influence on enforcement.",
      dataPoints: [
        "No ICE data-sharing, cloud infrastructure, or enforcement contracts disclosed in public records as of 2025",
        "Elon Musk's involvement in DOGE alongside Antonio Gracias has assisted Palantir's government-fueled contract growth — Palantir built ICE's core targeting database",
        "An unnamed Tesla executive VP was among signatories of a tech worker petition urging CEOs to publicly oppose ICE operations in cities",
        "Tesla has not adopted a public policy on ICE requests or immigrant worker protections; Musk's political influence represents the primary concern, not direct contracts",
        "Engineering teams use H-1B visas at moderate rates; Fremont and Texas Gigafactory workforces are primarily US-born",
      ],
      tabs: ["labor", "political"],
    },
    dei: {
      headline: "California DFEH found widespread racial harassment at Fremont. Tesla does not publish workforce diversity data.",
      dataPoints: [
        "DFEH/EEOC racial harassment case: $3.2M partial settlement; broader state case ongoing as of 2023",
        "Board: 2 women of 8 total; 5 of 8 directors are independent",
        "Tesla has declined to publish standard EEO-1 workforce diversity reports",
      ],
      tabs: ["legal", "governance"],
    },
    lgbtq: {
      headline: "Tesla offers standard LGBTQ+-inclusive benefits. No formal policy positions or advocacy as of 2023.",
      dataPoints: [
        "Offers same-sex partner benefits and gender-affirming care coverage",
        "No formal corporate LGBTQ+ advocacy programs or public policy positions",
        "Musk's personal public statements on gender identity have generated criticism; Tesla has not responded formally",
      ],
      tabs: ["labor"],
    },
    reproductive: {
      headline: "Tesla offers travel reimbursement for reproductive healthcare in states with restrictions.",
      dataPoints: [
        "Policy covers travel costs for employees in states where certain reproductive procedures are restricted",
        "Policy announced post-Dobbs; no rollback reported as of 2023",
        "Headquartered in Texas, where abortion restrictions are among the strictest in the US",
      ],
      tabs: ["labor"],
    },
    environmental_sustainability: {
      headline: "Tesla's vehicles reduce lifecycle emissions vs. ICE cars — verified by third parties. No corporate net-zero pledge.",
      dataPoints: [
        "Independent lifecycle analyses confirm EVs produce less CO₂ than comparable ICE vehicles, including battery production",
        "Tesla has not made a formal net-zero corporate commitment, unlike GM, Ford, and most European automakers",
        "Battery supply chain (lithium, cobalt) carries significant upstream environmental impacts",
      ],
      tabs: ["environment"],
    },
    online_speech: {
      headline: "Tesla is not a speech platform. Musk's ownership of X (Twitter) is separate from Tesla's corporate operations.",
      dataPoints: [
        "Tesla does not operate a consumer speech or content platform",
        "Musk's acquisition of Twitter/X and its content moderation policies are not Tesla corporate decisions",
        "No formal Tesla position on online speech issues",
      ],
      tabs: ["business"],
    },
    free_speech: {
      headline: "Tesla is not a speech platform. Musk's personal operation of X is legally and operationally separate from Tesla.",
      dataPoints: [
        "Tesla does not operate a consumer platform with content or speech policies",
        "Elon Musk's acquisition and operation of X (Twitter) is conducted as a separate private entity",
        "Musk has publicly championed free speech absolutism at X; this does not reflect formal Tesla policy",
      ],
      tabs: ["business"],
    },
    fact_checking: {
      headline: "Tesla has no content moderation function. Musk's dismantling of Twitter's fact-checking is an X decision, not a Tesla one.",
      dataPoints: [
        "Tesla has no product with moderation, fact-checking, or content review functions",
        "Musk eliminated Twitter's Birdwatch/Community Notes predecessor and rebuilt it; this was an X corporate decision",
        "No Tesla board positions, filings, or policies address fact-checking or content moderation",
      ],
      tabs: ["business"],
    },
    child_safety: {
      headline: "No child safety litigation. Tesla vehicles and software are not platforms targeting minors.",
      dataPoints: [
        "No active child safety investigations or litigation as of 2023",
        "Autopilot and FSD investigations are vehicle safety issues, not minor-specific",
        "No data collection practices targeting children",
      ],
      tabs: ["legal"],
    },
    animal_welfare: {
      headline: "Battery supply chain raises upstream environmental concerns; no direct animal welfare exposure.",
      dataPoints: [
        "Lithium and cobalt mining for battery production can affect local ecosystems and habitats",
        "Tesla does not operate food, agriculture, or animal product supply chains",
        "No animal welfare controversies, investigations, or litigation on record",
      ],
      tabs: ["environment"],
    },
    data_privacy: {
      headline: "Tesla continuously collects driving behavior, location, and camera footage. Fleet data trains FSD AI.",
      dataPoints: [
        "Speed, acceleration, location, and driver behavior recorded continuously by default",
        "Sentry Mode (exterior cameras) is opt-in; cabin camera use and retention policies vary by feature",
        "China-collected vehicle data stored in China per local law — separate infrastructure from US operations",
      ],
      tabs: ["privacy"],
    },
    health_wellbeing: {
      headline: "No food or pharmaceutical operations. Autopilot/FSD investigations are the primary consumer safety exposure.",
      dataPoints: [
        "2M+ vehicle recall for Autopilot software (NHTSA, 2023) — largest Tesla recall by volume",
        "Multiple active NHTSA investigations into FSD-related crash incidents",
        "Tesla disputes characterization of some incidents; no criminal charges as of 2023",
      ],
      tabs: ["legal"],
    },
    corporate_power: {
      headline: "Delaware court voided Musk's $56B compensation. Multiple conflicts of interest between Tesla and Musk's other ventures.",
      dataPoints: [
        "Delaware Chancery voided Musk's 2018 pay package for conflicted board approval process; Tesla moved to Texas",
        "Shareholder lawsuits cite distraction from Twitter acquisition and resource overlap with SpaceX and xAI",
        "Musk proposed 28% supervoting stake to maintain control as he invests company resources elsewhere",
      ],
      tabs: ["legal", "governance"],
    },
  },
};

// ─── COMPANY DATA ────────────────────────────────────────────────────────────

const COMPANIES = {
  meta: {
    id: "meta",
    name: "Meta",
    fullName: "Meta Platforms, Inc.",
    ticker: "META",
    exchange: "NASDAQ",
    founded: 2004,
    hq: "Menlo Park, CA",
    sector: "Technology / Social Media",
    tagline: "Social media, advertising, and virtual reality",
    vitals: [
      { label: "Revenue (2024)", value: "$164.5B" },
      { label: "Net Income (2024)", value: "$62.4B" },
      { label: "Employees", value: "74,067" },
    ],
    business: {
      summary: "Meta operates social media platforms (Facebook, Instagram, WhatsApp, Threads) and a hardware/VR division (Reality Labs). The company generates nearly all revenue by selling targeted advertising. Users access platforms for free; advertisers pay to reach them. In 2025, Meta shifted strategy significantly toward AI — both in advertising infrastructure and consumer products.",
      revenueStreams: [
        { label: "Advertising", pct: 98, amt: "$160.6B", note: "Targeted ad placements across Facebook, Instagram, and Messenger" },
        { label: "Reality Labs (VR/AR)", pct: 2, amt: "$1.8B", note: "Hardware sales (Quest headsets) and VR content" },
      ],
      profitStreams: [
        { label: "Advertising", margin: 48, amt: "$94.3B op. income", note: "48% operating margin" },
        { label: "Reality Labs (VR/AR)", margin: -983, amt: "−$17.7B op. loss", note: "Loses more than it earns — loss exceeds revenue", loss: true },
      ],
      profitNote: "Meta's 48% operating margin is one of the highest of any large-cap company. Reality Labs is a total loss center — every dollar of VR investment is subsidized by ad revenue.",
      keyMetrics: [
        { label: "Daily Active Users", value: "3.35B", sub: "Across all platforms combined, Q4 2024" },
        { label: "Revenue per User (US/Canada)", value: "$78.96", sub: "Per quarter, Q4 2024" },
        { label: "Revenue per User (Global)", value: "$14.93", sub: "Per quarter, Q4 2024" },
        { label: "Operating Margin", value: "48%", sub: "Full year 2024" },
        { label: "Reality Labs Cumulative Loss", value: "$58B+", sub: "2020–2024 combined" },
        { label: "AI Investment (Capex)", value: "$38B", sub: "Full year 2024; $60–65B guided for 2025" },
      ],
      modelExplainer: [
        { title: "How the ad model works", body: "Advertisers pay per impression or click, set by real-time auction. The more precisely Meta can predict user behavior and interests, the higher prices advertisers will pay — creating a structural incentive to collect detailed behavioral data." },
        { title: "AI is now core to the ad machine", body: "Meta's AI systems (Andromeda, GEM) now automate ad targeting and creative selection. Meta reports AI-driven campaigns outperform manual targeting significantly. This reduces advertiser friction and makes Meta's data advantage harder to compete with." },
        { title: "Reality Labs losses continue mounting", body: "Reality Labs has lost $58B+ since 2020 with no clear path to profitability. These losses are fully subsidized by advertising revenue. Meta classified this as a long-term strategic investment, though its AI pivot now competes for the same capital." },
      ],
      profitDrivers: [
        { title: "One segment, one driver", body: "Meta's 48% operating margin in 2024 comes almost entirely from advertising. Every dollar of profit improvement flows from either higher average revenue per user (ARPU) or lower operating costs — not from product diversification." },
        { title: "US and Canada carry the company", body: "North American users generate $78.96/quarter vs. $14.93 globally. 250M North American users produce nearly 50% of total ad revenue. Growth must now come from monetizing users who generate far less." },
      ],
      costStructure: {
        summary: "Meta's largest costs are headcount, data center infrastructure, and AI compute. When margins compress, the pattern is clear: headcount is cut first and fastest.",
        items: [
          { label: "Headcount (largest operating cost)", body: "Meta cut 21,000 employees in 2022–2023 and called it the 'Year of Efficiency.' Operating income margins jumped from 25% to 48% in two years. Labor cost is the primary lever management pulls.", issues: ["worker_treatment"] },
          { label: "Infrastructure / AI compute", body: "Meta guided $60–65B in capital expenditure for 2025, primarily for AI data center infrastructure. This is an investment cost today but creates long-term fixed infrastructure that is hard to reverse.", issues: ["environmental_sustainability"] },
          { label: "Content moderation", body: "Meta outsources content moderation to contractors who earn $18–22/hr and report high rates of psychological trauma from exposure to harmful content. These workers are not Meta employees and receive fewer benefits.", issues: ["worker_treatment", "child_safety"] },
        ],
      },
      source: "Meta 10-K 2024, Q4 2024 Earnings",
      issueLinks: ["data_privacy", "corporate_power"],
    },
    labor: {
      headcountHistory: [
        { year: "2020", count: 58604 },
        { year: "2021", count: 71970 },
        { year: "2022", count: 86482, note: "Peak" },
        { year: "2023", count: 67317, note: "Post-layoffs" },
      ],
      layoffs: [
        { date: "Nov 2022", count: "11,000", pct: "13%", context: "First major layoff in company history. Cited macroeconomic headwinds and over-hiring during COVID.", issues: ["worker_treatment"] },
        { date: "Mar 2023", count: "10,000", pct: "13%", context: "Second round, six months later. Zuckerberg described 2023 as the 'Year of Efficiency.'", issues: ["worker_treatment"] },
      ],
      compensation: [
        { label: "Median Total Compensation (2023)", value: "$379,000", sub: "Includes salary, bonus, and stock; reflects all-tech workforce", issues: ["worker_treatment"] },
        { label: "CEO Pay Ratio (2023)", value: "1:1", sub: "Zuckerberg's salary is $1/yr; ratio is not meaningful", issues: ["worker_treatment", "corporate_power"] },
        { label: "Content Moderator Pay (Contractors)", value: "$18–22/hr", sub: "Outsourced via Accenture/Teleperformance; not Meta employees", issues: ["worker_treatment"] },
      ],
      unionization: "No Meta workforce is unionized. Content moderation is primarily performed by contractors employed by third-party firms, not directly by Meta.",
      source: "Meta Proxy Statement 2023, SEC Filings, Reported Contractor Data",
      issueLinks: ["worker_treatment", "dei"],
    },
    environment: {
      emissions: [
        { label: "Scope 1 — Direct operations", value: "225,000 MT CO₂e", year: 2022, issues: ["environmental_sustainability"] },
        { label: "Scope 2 — Purchased energy (market-based)", value: "0 MT CO₂e", year: 2022, note: "Net zero via RECs (renewable energy certificates)", issues: ["environmental_sustainability"] },
        { label: "Scope 3 — Supply chain", value: "4.0M MT CO₂e", year: 2022, note: "Largest category; includes hardware manufacturing", issues: ["environmental_sustainability"] },
        { label: "Total (market-based)", value: "3.8M MT CO₂e", year: 2022, issues: ["environmental_sustainability"] },
      ],
      targets: [
        { label: "Net Zero Target", value: "2030", status: "Committed", issues: ["environmental_sustainability"] },
        { label: "Renewable Energy", value: "100%", status: "Claimed (via RECs)", note: "RECs are certificates, not direct power purchase", issues: ["environmental_sustainability"] },
        { label: "Water Neutral", value: "2030", status: "Committed", issues: ["environmental_sustainability"] },
      ],
      risks: [
        { title: "AI infrastructure energy demand", body: "Meta's rapid AI investment is driving significant data center expansion. The company has acknowledged this creates risk to its 2030 net-zero targets. Exact projected increase has not been disclosed." },
        { title: "REC methodology", body: "Meta's 100% renewable claim relies on renewable energy certificates (RECs). RECs represent purchasing credits, not necessarily direct renewable power. This is industry-standard practice but is contested by some analysts." },
      ],
      source: "Meta 2022 Sustainability Report",
      issueLinks: ["environmental_sustainability"],
    },
    governance: {
      controlStructure: "Dual-class share structure. Class A shares (public): 1 vote. Class B shares (Zuckerberg): 10 votes. Zuckerberg holds ~57% voting control with ~13% economic ownership.",
      boardComposition: [
        { label: "Board Size", value: "11 members", issues: ["corporate_power"] },
        { label: "Independent Directors", value: "9 of 11", issues: ["corporate_power"] },
        { label: "Women on Board", value: "3 of 11", issues: ["dei"] },
        { label: "CEO also serves as Chair", value: "Yes", issues: ["corporate_power"] },
      ],
      shareholderResolutions: "No shareholder resolution has ever passed over Zuckerberg's objection. The supervoting structure makes this mathematically impossible without his support.",
      source: "Meta 2025 Proxy Statement",
      issueLinks: ["corporate_power", "dei"],
    },
    legal: {
      items: [
        { name: "FTC Antitrust Trial", status: "Active", filed: "2020", amount: "TBD", summary: "FTC antitrust trial began in 2024, alleging Meta illegally maintained a social networking monopoly through 'buy or bury' acquisitions of Instagram and WhatsApp. Trial outcome expected 2025–2026; potential remedy includes forced divestiture.", issues: ["corporate_power"] },
        { name: "Youth Mental Health MDL", status: "Active", filed: "2023", amount: "TBD", summary: "In re Social Media Adolescent Addiction: federal MDL now consolidates 1,400+ lawsuits from school districts and families alleging Instagram and Facebook caused harm to minors.", issues: ["child_safety"] },
        { name: "EU GDPR Fine", status: "Final", filed: "2023", amount: "€1.2B", summary: "Meta illegally transferred EU user data to US servers in violation of GDPR. Largest GDPR fine ever issued.", issues: ["data_privacy"] },
        { name: "FTC Privacy Settlement", status: "Final", filed: "2019", amount: "$5B", summary: "Meta violated a 2012 FTC consent decree by sharing user data without adequate consent. Required operational reforms.", issues: ["data_privacy"] },
        { name: "Cambridge Analytica", status: "Settled", filed: "2018", amount: "$725M (class)", summary: "87M users' data was accessed for political targeting. Meta settled a class action in 2022.", issues: ["data_privacy"] },
      ],
      source: "FTC.gov, EU DPA, Court Records, SEC Disclosures",
      issueLinks: ["data_privacy", "child_safety", "corporate_power"],
    },
    political: {
      lobbyingTotal: "$185M+",
      lobbyingYears: "2015–2024",
      annualSpend: [
        { year: "2016", amt: 11.5 }, { year: "2017", amt: 11.5 },
        { year: "2018", amt: 12.6 }, { year: "2019", amt: 16.7 }, { year: "2020", amt: 19.7 },
        { year: "2021", amt: 20.1 }, { year: "2022", amt: 19.2 }, { year: "2023", amt: 17.9 }, { year: "2024", amt: 21.1 },
      ],
      keyIssues: [
        { label: "Data Privacy Legislation", stance: "Opposing federal bills requiring consent for cross-site tracking and data collection", issues: ["data_privacy"] },
        { label: "Section 230 Reform", stance: "Opposing changes to platform liability shield for user-generated content", issues: ["free_speech", "fact_checking", "child_safety"] },
        { label: "Antitrust / Competition", stance: "Opposing bills limiting self-preferencing and platform data integration", issues: ["corporate_power"] },
        { label: "Children's Online Safety", stance: "Supporting some transparency bills; opposing algorithmic audit requirements and age verification mandates", issues: ["child_safety"] },
        { label: "AI Regulation", stance: "Engaging with Congress on AI policy; generally favoring lighter-touch federal frameworks over state-by-state rules", issues: ["data_privacy", "free_speech", "fact_checking"] },
      ],
      revolvingDoor: [
        { label: "Former Regulators Hired", value: "15+", sub: "FTC, FCC, congressional staff" },
        { label: "Outside Lobbying Firms", value: "22+", sub: "On retainer, 2024" },
        { label: "Trade Associations", value: "10+", sub: "Including Chamber, CCIA, TechNet" },
      ],
      source: "OpenSecrets.org, Lobbying Disclosure Act, LittleSis.org",
      issueLinks: ["data_privacy", "corporate_power"],
    },
    dataPrivacy: {
      model: "Meta's business model depends on collecting user behavioral data to enable targeted advertising. The company tracks users across its own platforms and, via the Meta Pixel, across third-party websites.",
      practices: [
        { label: "Cross-site tracking", value: "Yes", valence: "flag", note: "Meta Pixel on ~30% of top websites", issues: ["data_privacy"] },
        { label: "Non-user tracking ('shadow profiles')", value: "Yes", valence: "flag", note: "Built from data on people without accounts", issues: ["data_privacy", "child_safety"] },
        { label: "Data sold to third parties", value: "No (per policy)", valence: "neutral", note: "Meta sells ad access, not raw data files", issues: ["data_privacy"] },
        { label: "User data deletion rights (US)", value: "Partial", valence: "neutral", note: "CCPA applies in California; varies by state", issues: ["data_privacy"] },
        { label: "End-to-end encryption", value: "WhatsApp messages only", valence: "neutral", note: "Metadata (who, when, frequency) still collected", issues: ["data_privacy"] },
      ],
      source: "Meta Privacy Policy, FTC Filings, EU DPA Rulings",
      issueLinks: ["data_privacy", "child_safety"],
    },
  },

  amazon: {
    id: "amazon",
    name: "Amazon",
    fullName: "Amazon.com, Inc.",
    ticker: "AMZN",
    exchange: "NASDAQ",
    founded: 1994,
    hq: "Seattle, WA",
    sector: "E-commerce / Cloud / Logistics",
    tagline: "E-commerce, cloud computing, logistics, and media",
    vitals: [
      { label: "Revenue (2024)", value: "$637.9B" },
      { label: "Net Income (2024)", value: "$59.2B" },
      { label: "Employees", value: "1,551,000" },
    ],
    business: {
      summary: "Amazon operates across three major segments: North America retail, International retail, and Amazon Web Services (AWS). AWS generates the majority of operating profit despite being ~19% of revenue. The retail operation runs on thin margins, subsidized by AWS cash flow. In 2024, Amazon became the first cloud company to cross $100B in annual revenue.",
      revenueStreams: [
        { label: "Online Stores", pct: 37, amt: "$239B", note: "Direct product sales on amazon.com" },
        { label: "Third-Party Seller Services", pct: 24, amt: "$157B", note: "Fees from marketplace sellers; includes fulfillment and transaction fees" },
        { label: "Amazon Web Services (AWS)", pct: 19, amt: "$107B", note: "Cloud infrastructure; highest-margin segment; first cloud provider to pass $100B/yr" },
        { label: "Advertising Services", pct: 9, amt: "$56B", note: "Sponsored product listings; fastest-growing segment" },
        { label: "Subscription Services (Prime)", pct: 7, amt: "$44B", note: "Membership fees and streaming" },
        { label: "Physical Stores", pct: 3, amt: "$21B", note: "Whole Foods and Amazon Go" },
        { label: "Other", pct: 1, amt: "$6B", note: "" },
      ],
      profitStreams: [
        { label: "Online Stores", margin: 3, amt: "~3% margin", note: "Direct retail is near-breakeven" },
        { label: "Third-Party Seller Services", margin: 20, amt: "~20% margin", note: "Fees and fulfillment are higher margin than direct sales" },
        { label: "Amazon Web Services (AWS)", margin: 37, amt: "$39.8B op. income", note: "37% margin — funds the entire company" },
        { label: "Advertising Services", margin: 50, amt: "~50% margin est.", note: "Near-zero marginal cost; overlaid on existing search infrastructure" },
        { label: "Subscription Services (Prime)", margin: 15, amt: "~15% margin est.", note: "Mix of streaming content costs and membership" },
        { label: "Physical Stores", margin: 4, amt: "~4% margin", note: "Whole Foods and Amazon Go" },
        { label: "Other", margin: 10, amt: "~10% margin est.", note: "" },
      ],
      profitNote: "This is the most important fact about Amazon: the cloud division (AWS) you may rarely think about generates 37% margins and funds the warehouse and delivery operation you interact with every day. Retail margins run 3–5%. One pays for the other.",
      keyMetrics: [
        { label: "AWS Operating Margin", value: "37%", sub: "vs. ~4% for retail segments" },
        { label: "Third-Party Share of Units", value: "60%+", sub: "Majority of units are marketplace sellers" },
        { label: "Prime Members (Global)", value: "200M+ est.", sub: "Amazon does not disclose exact count" },
        { label: "Advertising Revenue Growth", value: "+18%", sub: "2024 vs 2023" },
        { label: "AWS Market Share (Cloud)", value: "~30%", sub: "vs. Azure ~21%, GCP ~12%" },
        { label: "Fulfillment Network", value: "400M+ sq ft", sub: "Global warehouse and logistics footprint" },
      ],
      modelExplainer: [
        { title: "AWS funds the retail operation", body: "Amazon's retail segments operate at near-zero margins. AWS's ~30% operating margin generates the bulk of corporate profit. In 2023, AWS produced $25B of Amazon's $37B in total operating income." },
        { title: "The marketplace fee structure", body: "Third-party sellers pay listing, fulfillment, and advertising fees to Amazon. For many categories, sellers report that organic search visibility has declined, making paid advertising increasingly necessary to compete." },
        { title: "Advertising as a marketplace toll", body: "Amazon's $47B advertising business is primarily sponsored listings in search results. This revenue stream layers on top of existing seller fees, raising the effective cost for sellers who need visibility." },
      ],
      profitDrivers: [
        { title: "AWS is the profit engine", body: "AWS's 37% operating margin funds everything else. In 2023, AWS generated $25B of Amazon's $37B total operating income — on just 19% of revenue. The retail business is a customer acquisition and logistics operation, not a margin business." },
        { title: "Advertising is the fastest-growing profit source", body: "Amazon's advertising business ($56B revenue, 2024) has near-zero marginal cost — ads overlay on existing search infrastructure. It grew 18% in 2024 and represents the most lucrative expansion opportunity after AWS." },
      ],
      costStructure: {
        summary: "Amazon's largest cost categories are fulfillment labor, logistics, and technology infrastructure. The people who bear the most direct cost pressure are warehouse workers and delivery drivers.",
        items: [
          { label: "Fulfillment labor (1.5M+ workers)", body: "Amazon's warehouse injury rates have historically exceeded industry averages. The company sets performance metrics (TPH — tasks per hour) that workers allege create unsafe pace requirements. Median employee compensation is $37,000/year — reflecting this majority workforce.", issues: ["worker_treatment"] },
          { label: "Third-party seller fees", body: "When Amazon needs to maintain margins, seller fees and advertising requirements increase. Independent analyses suggest the effective 'Amazon tax' on marketplace sellers now exceeds 50% of gross revenue for many categories. The FTC's antitrust case focuses specifically on this.", issues: ["corporate_power"] },
          { label: "Technology infrastructure / AI", body: "Amazon guided $75B+ in capital expenditures for 2025, primarily for AWS AI infrastructure. This is among the largest corporate capital programs in the world.", issues: ["environmental_sustainability"] },
        ],
      },
      source: "Amazon 10-K 2023, Q4 2023 Earnings",
      issueLinks: ["corporate_power", "data_privacy"],
    },
    labor: {
      headcountHistory: [
        { year: "2021", count: 1608000, note: "Peak" },
        { year: "2022", count: 1541000 },
        { year: "2023", count: 1525000 },
        { year: "2024", count: 1551000 },
      ],
      layoffs: [
        { date: "Nov 2022", count: "10,000", pct: "<1%", context: "Corporate and tech roles. Warehouse workforce largely unaffected.", issues: ["worker_treatment"] },
        { date: "Jan 2023", count: "18,000", pct: "~1%", context: "Largest corporate layoff in Amazon history. Targeted AWS, advertising, and HR teams.", issues: ["worker_treatment"] },
        { date: "Mar 2023", count: "9,000", pct: "<1%", context: "Second round targeting AWS, Twitch, and advertising teams.", issues: ["worker_treatment"] },
      ],
      compensation: [
        { label: "Median Annual Compensation (2024)", value: "$37,000", sub: "Reflects majority warehouse/hourly workforce", issues: ["worker_treatment"] },
        { label: "CEO Pay Ratio (2024)", value: "5,621:1", sub: "Andy Jassy total comp vs. median employee", issues: ["worker_treatment", "corporate_power"] },
        { label: "Starting Warehouse Wage (US)", value: "$19/hr", sub: "Announced minimum as of 2024", issues: ["worker_treatment"] },
        { label: "Corporate Engineer (Median)", value: "~$190,000", sub: "Salary only; Levels.fyi estimate", issues: ["worker_treatment"] },
      ],
      unionization: "The Amazon Labor Union won an NLRB election at a Staten Island warehouse (JFK8) in April 2022 — the first successful union vote in Amazon's US history. Amazon has challenged the result and continued fighting unionization. No collective bargaining agreement has been reached as of 2026. NLRB has issued numerous unfair labor practice complaints against Amazon.",
      source: "Amazon Proxy Statement 2024, NLRB Records, BLS Data",
      issueLinks: ["worker_treatment", "dei"],
    },
    environment: {
      emissions: [
        { label: "Scope 1 — Direct operations", value: "18.5M MT CO₂e", year: 2022, issues: ["environmental_sustainability"] },
        { label: "Scope 2 — Purchased energy (market-based)", value: "4.5M MT CO₂e", year: 2022, issues: ["environmental_sustainability"] },
        { label: "Scope 3 — Supply chain + delivery", value: "47M MT CO₂e", year: 2022, note: "Includes last-mile delivery and sold products", issues: ["environmental_sustainability"] },
        { label: "Total", value: "71.5M MT CO₂e", year: 2022, issues: ["environmental_sustainability"] },
      ],
      targets: [
        { label: "Net Zero Target", value: "2040", status: "Committed (The Climate Pledge)", issues: ["environmental_sustainability"] },
        { label: "Renewable Energy", value: "100%", status: "Claimed for 2023 operations", issues: ["environmental_sustainability"] },
        { label: "50% Carbon Reduction by 2030", value: "2030", status: "Committed", issues: ["environmental_sustainability"] },
      ],
      risks: [
        { title: "Delivery fleet emissions", body: "Amazon's last-mile delivery network is its fastest-growing emissions source. 100,000 electric Rivian vans ordered; majority of fleet still ICE as of 2022." },
        { title: "Absolute emissions growth", body: "Amazon's absolute emissions grew significantly 2019–2021 as the company scaled. Amazon reports 'carbon intensity' improvements (emissions per dollar of revenue) while absolute emissions remain very large." },
      ],
      source: "Amazon 2022 Sustainability Report",
      issueLinks: ["environmental_sustainability"],
    },
    governance: {
      controlStructure: "Single-class share structure. All shares carry equal voting rights. Jeff Bezos holds ~9% economic stake with no supervoting control. Andy Jassy is CEO.",
      boardComposition: [
        { label: "Board Size", value: "11 members", issues: ["corporate_power"] },
        { label: "Independent Directors", value: "10 of 11", issues: ["corporate_power"] },
        { label: "Women on Board", value: "4 of 11", issues: ["dei"] },
        { label: "CEO and Chair are separate roles", value: "Yes", issues: ["corporate_power"] },
      ],
      shareholderResolutions: "Amazon shareholders have passed advisory resolutions on climate, labor, and DEI topics. These are non-binding. Management has opposed many of them.",
      source: "Amazon 2024 Proxy Statement",
      issueLinks: ["shareholder", "dei"],
    },
    legal: {
      items: [
        { name: "FTC Antitrust Case (Retail)", status: "Active", filed: "2023", amount: "TBD", summary: "FTC and 17 state AGs allege Amazon illegally maintains monopoly power in online retail and marketplace services through anti-competitive pricing and seller practices.", issues: ["corporate_power"] },
        { name: "EU Antitrust Fine", status: "Final", filed: "2021", amount: "€1.1B", summary: "EU found Amazon abused marketplace data — using third-party seller data to compete against those sellers. Largest EU antitrust fine against Amazon.", issues: ["corporate_power", "data_privacy"] },
        { name: "NLRB Unfair Labor Practices", status: "Multiple Active", filed: "Ongoing", amount: "TBD", summary: "NLRB has issued numerous complaints for alleged interference with union organizing, including illegal firings and surveillance of organizers.", issues: ["worker_treatment"] },
        { name: "FTC Prime Subscription (Dark Patterns)", status: "Active", filed: "2023", amount: "TBD", summary: "FTC alleges Amazon used dark patterns to enroll users in Prime without consent and made cancellation intentionally difficult.", issues: ["corporate_power", "data_privacy"] },
        { name: "NY AG Warehouse Safety", status: "Settled", filed: "2021", amount: "$500,000", summary: "NY AG found Amazon failed to adequately protect warehouse workers during COVID. Settled 2022 with required operational reforms.", issues: ["worker_treatment", "safety"] },
      ],
      source: "FTC.gov, EU Competition Authority, NLRB.gov, Court Records",
      issueLinks: ["worker_treatment", "corporate_power", "safety"],
    },
    political: {
      lobbyingTotal: "$110M+",
      lobbyingYears: "2015–2023",
      annualSpend: [
        { year: "2015", amt: 9.1 }, { year: "2016", amt: 11.0 }, { year: "2017", amt: 12.8 },
        { year: "2018", amt: 14.2 }, { year: "2019", amt: 16.1 }, { year: "2020", amt: 18.7 },
        { year: "2021", amt: 19.3 }, { year: "2022", amt: 21.4 }, { year: "2023", amt: 17.4 },
      ],
      keyIssues: [
        { label: "Antitrust / Competition", stance: "Opposing legislation limiting self-preferencing or requiring marketplace separation", issues: ["corporate_power"] },
        { label: "Labor / Union Law", stance: "Opposing PRO Act and legislation expanding union organizing rights", issues: ["worker_treatment"] },
        { label: "Data Privacy", stance: "Supporting federal preemption standard that would supersede stricter state laws", issues: ["data_privacy"] },
        { label: "Defense / Cloud Contracts", stance: "Lobbying for government cloud contracts; holds major DoD and CIA cloud agreements", issues: ["corporate_power"] },
      ],
      revolvingDoor: [
        { label: "Former DoD/Intelligence Officials Hired", value: "15+", sub: "Tied to AWS GovCloud and defense contracts" },
        { label: "Outside Lobbying Firms", value: "25+", sub: "On retainer, 2023" },
        { label: "Trade Associations", value: "10+", sub: "Including Chamber, BSA, CCIA" },
      ],
      source: "OpenSecrets.org, Lobbying Disclosure Act, LittleSis.org",
      issueLinks: ["political_influence", "worker_treatment", "corporate_power"],
    },
    dataPrivacy: {
      model: "Amazon collects purchase history, Alexa voice recordings, Ring camera footage, location, and device data across its retail, cloud, and device ecosystems. This data informs Amazon's advertising business and product development.",
      practices: [
        { label: "Purchase history used for ad targeting", value: "Yes", valence: "flag", note: "Core to Amazon's sponsored listing targeting", issues: ["data_privacy"] },
        { label: "Alexa voice recordings retained (default)", value: "Yes", valence: "flag", note: "User-deletable; retention policies changed under regulatory pressure", issues: ["data_privacy", "child_safety"] },
        { label: "Ring footage shared with police", value: "Previously yes, ended 2022", valence: "neutral", note: "Amazon ended warrantless police data sharing after public disclosure", issues: ["data_privacy"] },
        { label: "Seller data used competitively", value: "Contested", valence: "flag", note: "EU found this violated competition law; Amazon disputes characterization", issues: ["data_privacy", "corporate_power"] },
        { label: "Data sold to third parties", value: "No (per policy)", valence: "neutral", note: "Amazon sells ad access, not raw data", issues: ["data_privacy"] },
      ],
      source: "Amazon Privacy Notice, EU DPA Rulings, FTC Records, Congressional Testimony",
      issueLinks: ["data_privacy", "child_safety"],
    },
  },

  tesla: {
    id: "tesla",
    name: "Tesla",
    fullName: "Tesla, Inc.",
    ticker: "TSLA",
    exchange: "NASDAQ",
    founded: 2003,
    hq: "Austin, TX",
    sector: "Automotive / Energy",
    tagline: "Electric vehicles, energy storage, and solar",
    vitals: [
      { label: "Revenue (2024)", value: "$97.7B" },
      { label: "Net Income (2024)", value: "$7.3B" },
      { label: "Employees", value: "121,500" },
    ],
    business: {
      summary: "Tesla generates most revenue from automotive sales and services. A growing segment covers energy products (Powerwall, Megapack, solar), which became a record profit contributor in 2024. Tesla also earns regulatory credit revenue by selling EV credits to other automakers. Revenue was flat year-over-year in 2024 as price cuts and rising competition compressed automotive margins significantly.",
      revenueStreams: [
        { label: "Automotive Sales", pct: 75, amt: "$73.8B", note: "Vehicle sales — down slightly from 2023 despite volume gains" },
        { label: "Energy Generation & Storage", pct: 9, amt: "$10.1B", note: "Megapack, Powerwall, and solar — record revenue in 2024" },
        { label: "Automotive Services", pct: 7, amt: "$6.7B", note: "Maintenance, repairs, used vehicle sales, insurance" },
        { label: "Software & Other", pct: 6, amt: "$5.9B", note: "FSD subscriptions, connectivity, licensing" },
        { label: "Regulatory Credits", pct: 3, amt: "$2.8B", note: "Selling EV credits to automakers who can't meet emissions standards; 100% margin" },
      ],
      profitStreams: [
        { label: "Automotive Sales", margin: 17, amt: "17% gross margin", note: "Down from 28% in 2022 — price war with BYD compressing fast" },
        { label: "Energy Generation & Storage", margin: 33, amt: "33% gross margin", note: "Now higher margin than vehicles; fastest-growing segment" },
        { label: "Automotive Services", margin: 16, amt: "~16% gross margin", note: "Repairs, insurance, used vehicles" },
        { label: "Software & Other", margin: 40, amt: "~40% margin est.", note: "FSD subscriptions and connectivity" },
        { label: "Regulatory Credits", margin: 100, amt: "$2.8B — 100% margin", note: "Pure profit, no cost. Remove this and 2024 net income shrinks dramatically.", highlight: true },
      ],
      profitNote: "Tesla's profit is more fragile than revenue suggests. Automotive margins have nearly halved since 2022. Regulatory credits — a windfall with no future guarantee — contributed $2.8B in pure profit in 2024.",
      keyMetrics: [
        { label: "Vehicles Delivered (2024)", value: "1.79M", sub: "Roughly flat vs. 2023; first annual decline in deliveries" },
        { label: "Automotive Gross Margin", value: "17.1%", sub: "Down from 18.9% in 2023 (continued price pressure)" },
        { label: "Average Selling Price", value: "~$41,200", sub: "Blended 2024; continued decline" },
        { label: "Supercharger Stations", value: "6,700+", sub: "Global, end of 2024" },
        { label: "Energy Storage Deployed", value: "31.4 GWh", sub: "2024; up 113% year-over-year" },
        { label: "FSD Attachment Rate", value: "~20% est.", sub: "Tesla does not disclose officially" },
      ],
      modelExplainer: [
        { title: "Regulatory credit revenue is 100% margin", body: "Tesla earned $2.8B in 2024 selling zero-emission vehicle credits to automakers who can't meet emissions standards. This revenue has no associated cost and has historically been the difference between profitability and loss." },
        { title: "Energy storage is now a major growth engine", body: "Tesla's Megapack and Powerwall segment generated $10.1B in 2024 revenue — nearly double 2023. As automotive margins compress, energy is increasingly important to Tesla's profitability thesis." },
        { title: "Full Self-Driving as recurring software revenue", body: "FSD costs $99–199/month or $8,000 upfront. Tesla continues deploying FSD v13 and supervised autonomy. Robotaxi ambitions remain a core part of investor expectations, though timelines have repeatedly slipped." },
      ],
      profitDrivers: [
        { title: "Automotive margin is under sustained pressure", body: "Tesla cut vehicle prices repeatedly in 2023–2024 to defend market share against BYD and other Chinese manufacturers. Automotive gross margin fell from 28% (2022) to 17% (2024). Profitability now depends more on energy storage and regulatory credits." },
        { title: "The bet on software and services", body: "FSD subscriptions and autonomous taxi services are the central thesis for why Tesla's valuation exceeds Toyota's. If FSD achieves full autonomy, recurring software revenue could transform the margin structure. If it doesn't, the current multiple is hard to justify." },
      ],
      costStructure: {
        summary: "Tesla's largest costs are vehicle manufacturing, R&D, and the ongoing price war with Chinese EV makers. Labor at Gigafactories is the most direct cost pressure point.",
        items: [
          { label: "Manufacturing labor (Gigafactories)", body: "Tesla cut over 14,000 employees in April 2024 while eliminating the entire Supercharger team. The Fremont factory has faced NLRB complaints and racial harassment investigations. Tesla does not publish wages; estimates range $21–23/hr for factory workers.", issues: ["worker_treatment"] },
          { label: "Price competition with Chinese EV makers", body: "BYD and other Chinese manufacturers have eroded Tesla's price advantage. Tesla responded with repeated price cuts that compressed margins significantly. This creates structural pressure on everyone in the vehicle supply chain, including Tesla's own workforce.", issues: ["worker_treatment"] },
          { label: "R&D and CEO distraction costs", body: "Musk's simultaneous management of SpaceX, X, xAI, and The Boring Company is a governance risk cited in multiple shareholder lawsuits. Resources, leadership bandwidth, and Tesla engineers have been directed toward non-Tesla projects.", issues: ["corporate_power"] },
        ],
      },
      source: "Tesla 10-K 2024, Q4 2024 Earnings",
      issueLinks: ["environmental_sustainability", "health_wellbeing"],
    },
    labor: {
      headcountHistory: [
        { year: "2021", count: 99290 },
        { year: "2022", count: 127855 },
        { year: "2023", count: 140473, note: "Peak" },
        { year: "2024", count: 121500, note: "Post-layoffs" },
      ],
      layoffs: [
        { date: "Apr 2024", count: "14,000+", pct: "~10%", context: "Announced April 2024. Eliminated entire Supercharger team and multiple senior executives. Additional management-layer cuts followed in early 2025.", issues: ["worker_treatment"] },
      ],
      compensation: [
        { label: "Median Total Compensation (2024)", value: "$48,655", sub: "Reflects manufacturing-majority workforce", issues: ["worker_treatment"] },
        { label: "CEO Pay (Voided Package)", value: "See governance", sub: "Musk's $56B 2018 package voided by Delaware court; new shareholder vote passed in 2024", issues: ["worker_treatment", "corporate_power"] },
        { label: "Starting Factory Wage (Fremont)", value: "$21–23/hr", sub: "Reported estimate; Tesla does not publish wages", issues: ["worker_treatment"] },
      ],
      unionization: "Tesla's US workforce is not unionized. Tesla has repeatedly opposed UAW organizing efforts. The NLRB has issued multiple unfair labor practice complaints against Tesla, including for illegal firings and surveillance of union organizers at the Fremont factory. A Swedish labor dispute began in late 2023, with sympathy strikes continuing into 2025.",
      source: "Tesla Proxy Statement 2024, NLRB Records, Swedish Union Records",
      issueLinks: ["worker_treatment", "dei"],
    },
    environment: {
      emissions: [
        { label: "Scope 1 — Direct operations", value: "1.0M MT CO₂e", year: 2022, issues: ["environmental_sustainability"] },
        { label: "Scope 2 — Purchased energy", value: "0.7M MT CO₂e", year: 2022, issues: ["environmental_sustainability"] },
        { label: "Scope 3 — Supply chain + product use", value: "17.5M MT CO₂e", year: 2022, note: "Includes battery supply chain", issues: ["environmental_sustainability"] },
        { label: "Total", value: "19.2M MT CO₂e", year: 2022, issues: ["environmental_sustainability"] },
      ],
      targets: [
        { label: "Net Zero Target", value: "None committed", status: "No formal pledge", issues: ["environmental_sustainability"] },
        { label: "100% Renewable Manufacturing", value: "Partial — varies by facility", status: "Not stated", issues: ["environmental_sustainability"] },
        { label: "EV Lifecycle Impact", value: "Less CO₂ than ICE", status: "Third-party verified", note: "EVs produce less lifetime CO₂ than comparable ICE vehicles, including battery production", issues: ["environmental_sustainability"] },
      ],
      risks: [
        { title: "Battery supply chain impacts", body: "Lithium mining, cobalt sourcing, and battery manufacturing carry significant upstream emissions and environmental impacts. Tesla is vertically integrating battery production (4680 cells) partly to control this." },
        { title: "No formal net-zero commitment", body: "Unlike most large automakers, Tesla has not made a formal net-zero commitment. The company's stated position is that its products inherently reduce emissions, making a separate corporate pledge less necessary." },
      ],
      source: "Tesla 2022 Impact Report",
      issueLinks: ["environmental_sustainability"],
    },
    governance: {
      controlStructure: "Single-class share structure. Musk's ownership was ~13% as of end 2023, reduced from higher levels after stock sales. Musk has proposed a supervoting structure (28% voting control) to maintain control as he invests in AI ventures; shareholders voted June 2024.",
      boardComposition: [
        { label: "Board Size", value: "8 members", issues: ["corporate_power"] },
        { label: "Independent Directors", value: "5 of 8", issues: ["corporate_power"] },
        { label: "Women on Board", value: "2 of 8", issues: ["dei"] },
        { label: "CEO and Chair are separate roles", value: "Yes — Robyn Denholm is Chair", issues: ["corporate_power"] },
        { label: "Related-Party Concerns", value: "Ongoing — SpaceX, xAI, The Boring Company overlap", issues: ["corporate_power"] },
      ],
      shareholderResolutions: "Delaware court voided Musk's $56B compensation package in January 2024 for conflicted board approval process. Tesla moved incorporation to Texas; ratification vote held June 2024. Multiple shareholder lawsuits on SpaceX conflicts and Twitter distraction are active.",
      source: "Tesla 2024 Proxy Statement, Court Records",
      issueLinks: ["shareholder", "corporate_power"],
    },
    legal: {
      items: [
        { name: "Musk Compensation Package (Delaware)", status: "Ongoing", filed: "2018 / Voided 2024", amount: "$56B package", summary: "Delaware Chancery Court voided Musk's 2018 compensation package as unfair to shareholders. Tesla moved to Texas; ratification vote held June 2024.", issues: ["shareholder"] },
        { name: "NHTSA Autopilot/FSD Investigations", status: "Multiple Active", filed: "Ongoing", amount: "TBD", summary: "Multiple NHTSA investigations into Autopilot and FSD crash incidents. Tesla issued a 2M+ vehicle recall in 2023 for Autopilot software.", issues: ["safety"] },
        { name: "NLRB Unfair Labor Practices", status: "Multiple Active", filed: "Ongoing", amount: "TBD", summary: "Multiple NLRB complaints for alleged illegal anti-union activity, including firing of organizers at the Fremont factory.", issues: ["worker_treatment"] },
        { name: "Racial Harassment (DFEH/EEOC)", status: "Active / Partial settlement", filed: "2022", amount: "$3.2M (partial)", summary: "California DFEH found widespread racial harassment at Fremont. EEOC also filed suit. Partial settlement reached; broader state case ongoing.", issues: ["worker_treatment", "dei"] },
        { name: "Twitter/X Acquisition Scrutiny", status: "Various", filed: "2022", amount: "N/A", summary: "Multiple SEC and shareholder investigations into Musk's conduct around Twitter acquisition, including Tesla stock sales and disclosure obligations.", issues: ["shareholder", "corporate_power"] },
      ],
      source: "SEC Filings, NHTSA, NLRB, Court Records, DFEH",
      issueLinks: ["safety", "worker_treatment", "shareholder"],
    },
    political: {
      lobbyingTotal: "$10M+",
      lobbyingYears: "2015–2023",
      annualSpend: [
        { year: "2015", amt: 0.6 }, { year: "2016", amt: 0.8 }, { year: "2017", amt: 1.3 },
        { year: "2018", amt: 1.6 }, { year: "2019", amt: 2.1 }, { year: "2020", amt: 2.9 },
        { year: "2021", amt: 3.0 }, { year: "2022", amt: 2.1 }, { year: "2023", amt: 1.9 },
      ],
      keyIssues: [
        { label: "EV Tax Credits / Incentives", stance: "Supporting federal EV purchase credits; opposing dealer-franchise requirements that block direct sales", issues: ["environmental_sustainability"] },
        { label: "Autopilot / AV Regulation", stance: "Opposing stringent autonomous vehicle safety mandates; favoring industry self-certification", issues: ["health_wellbeing"] },
        { label: "NACS Charging Standard", stance: "Lobbying for NACS to become national standard (adopted by major automakers; included in federal charging grants)", issues: ["environmental_sustainability"] },
        { label: "Labor Law", stance: "Opposing PRO Act and related union-strengthening legislation", issues: ["worker_treatment"] },
      ],
      revolvingDoor: [
        { label: "Former Regulators Hired", value: "4+", sub: "NHTSA, DOT alumni" },
        { label: "Outside Lobbying Firms", value: "8+", sub: "On retainer, 2023" },
        { label: "Musk Personal Political Activity", value: "Separate", sub: "Not reported as Tesla corporate lobbying" },
      ],
      source: "OpenSecrets.org, Lobbying Disclosure Act",
      issueLinks: ["political_influence", "safety", "worker_treatment"],
    },
    dataPrivacy: {
      model: "Tesla collects substantial vehicle data including driving behavior, location history, and camera footage. This data is used for Autopilot/FSD AI training. Connectivity is required for software updates.",
      practices: [
        { label: "Driving data collected (default)", value: "Yes", valence: "flag", note: "Speed, acceleration, location, and driver behavior continuously recorded", issues: ["data_privacy"] },
        { label: "Camera footage collected", value: "Varies by feature", valence: "neutral", note: "Sentry Mode is opt-in; cabin camera use varies; policies differ by feature", issues: ["data_privacy"] },
        { label: "Data used for AI training", value: "Yes", valence: "neutral", note: "Fleet data is core to FSD development", issues: ["data_privacy"] },
        { label: "Opt-out of telemetry", value: "Partial", valence: "neutral", note: "Some telemetry can be disabled; not all data collection is optional", issues: ["data_privacy"] },
        { label: "China data localization", value: "Yes", valence: "neutral", note: "China-collected data stored in China per local law", issues: ["data_privacy"] },
      ],
      source: "Tesla Privacy Policy, NHTSA Filings, China MIIT Compliance",
      issueLinks: ["data_privacy"],
    },
  },
};

// ─── COMPANY OVERVIEW SUMMARIES ────────────────────────────────────────────────
// Plain-English "what is this company / who leads it" for the Overview tab
const COMPANY_OVERVIEWS = {
  meta: {
    what: "Meta Platforms operates five of the world's most-used apps — Facebook, Instagram, WhatsApp, Messenger, and Threads — alongside a hardware division building virtual reality headsets (Meta Quest). The company makes nearly all its money by selling targeted advertising: users get free access, and advertisers pay to reach them. Meta's AI systems now automate much of how those ads are matched to people. A separate division (Reality Labs) has lost $58B+ since 2020 building the metaverse.",
    who: {
      ceo: "Mark Zuckerberg",
      tenure: "Founded the company in 2004 at age 19; has been CEO continuously for 21 years",
      background: "Founder-operator. Computer science background; no prior corporate career.",
      founderStatus: true,
      chairSame: true,
      control: "Zuckerberg holds approximately 57% voting control through Class B shares (10× vote weight) while owning only ~13% of the economic value. No shareholder resolution has ever passed against his wishes — the math makes it impossible.",
    },
    lede: "Meta operates Facebook, Instagram, WhatsApp, and Messenger — reaching over 3 billion daily users. The majority of its revenue comes from targeted digital advertising.",
  },
  amazon: {
    what: "Amazon operates three main businesses: retail (selling goods directly and through a marketplace of third-party sellers), Amazon Web Services (cloud computing infrastructure used by companies worldwide), and a growing advertising operation. AWS generates the majority of Amazon's profit despite being less than 20% of revenue. Amazon also owns Whole Foods, One Medical, Twitch, Ring, and Amazon Studios. In 2024, AWS became the first cloud provider to cross $100B in annual revenue.",
    who: {
      ceo: "Andy Jassy",
      tenure: "CEO since July 2021; previously ran AWS from its founding",
      background: "Hired operator. Harvard MBA; joined Amazon in 1997 and built AWS from scratch.",
      founderStatus: false,
      chairSame: false,
      control: "Standard single-class share structure. Jeff Bezos (founder) retains approximately 9% economic ownership with no supervoting control. Andy Jassy has no unusual voting power. Shareholders can pass non-binding resolutions, though management has opposed most.",
    },
    lede: "Amazon operates across e-commerce, cloud computing (AWS), digital advertising, and logistics. AWS accounts for the majority of operating income, while retail remains its largest revenue segment.",
  },
  tesla: {
    what: "Tesla designs and sells electric vehicles, energy storage products (Powerwall, Megapack), and solar systems. Automotive revenue is the core of the business, but a growing energy segment contributed record profits in 2024. Tesla also earns significant revenue from selling zero-emission vehicle credits to other automakers. The company operates Gigafactories in the US, China, Germany, and Texas. CEO Elon Musk is separately developing AI, robotics, and autonomous driving under Tesla's umbrella while also running SpaceX, X, xAI, and The Boring Company.",
    who: {
      ceo: "Elon Musk",
      tenure: "CEO since 2008; though he was not a co-founder, he joined early and has led the company for 16 years",
      background: "Founder-equivalent. South African-born entrepreneur and engineer; co-founded PayPal; also runs SpaceX, X, xAI, and The Boring Company simultaneously.",
      founderStatus: false,
      chairSame: false,
      control: "Single-class shares; Robyn Denholm is board chair (separate from CEO). Musk owns approximately 13% of shares, but has sought a 28% supervoting structure. A Delaware court voided his $56B compensation package in 2024. Multiple shareholder lawsuits allege conflicts of interest with Musk's other ventures.",
    },
    lede: "Tesla designs and manufactures electric vehicles, battery storage systems, and solar products. It is the largest EV maker by volume in the US and operates a global charging network.",
  },
};

// ─── TRAJECTORY DATA ───────────────────────────────────────────────────────────
const TRAJECTORY_DATA = {
  meta: {
    rdSpend: { value: "$40B+", pct: "24% of revenue", trend: "Up from $35.3B in 2023; AI infrastructure is the primary driver", year: 2024 },
    strategicBets: [
      {
        name: "AI Infrastructure & Ad Optimization",
        capex: "$60–65B capex guided for 2025",
        thesis: "Meta's AI systems now automate ad targeting and creative selection. AI-driven campaigns outperform manual targeting, which raises advertiser willingness to pay and defends Meta's market position against Google and TikTok.",
        forUsers: "Ads become more precisely targeted and harder to escape. The AI system learns from everything you do across Meta's platforms and the wider web.",
        issues: ["data_privacy", "free_speech", "fact_checking"],
        status: "Core business — actively scaling",
      },
      {
        name: "AI Consumer Products (Meta AI, Llama)",
        capex: "Included in overall AI capex",
        thesis: "Meta AI assistant integrated into all apps; Llama open-source model builds developer ecosystem. Goal: become the default AI layer for social interaction.",
        forUsers: "AI assistants embedded in Instagram, WhatsApp, and Facebook. Llama's open release means the model can be used by anyone, including for purposes Meta doesn't control.",
        issues: ["free_speech", "fact_checking", "child_safety"],
        status: "Actively deploying",
      },
      {
        name: "Reality Labs / Metaverse",
        capex: "$17B spent in 2023; ongoing",
        thesis: "Long-term bet on VR/AR as the next computing platform. Quest headsets are the leading consumer VR device by market share.",
        forUsers: "Ads and data collection expanding into new physical/spatial environments. $58B in cumulative losses are fully funded by advertising revenue from existing users.",
        issues: ["data_privacy"],
        status: "Long-term bet — $58B in losses since 2020",
      },
      {
        name: "WhatsApp Monetization",
        capex: "Marginal — platform already built",
        thesis: "2B+ users with minimal monetization today. Click-to-WhatsApp ads and business messaging are the largest untapped revenue opportunity in Meta's portfolio.",
        forUsers: "Expect gradual advertising and business messaging increases in WhatsApp over the next 3–5 years.",
        issues: ["data_privacy"],
        status: "Early — business messaging launched",
      },
    ],
    killed: [
      { name: "Third-party fact-checking program", when: "Jan 2025", note: "Replaced with Community Notes-style system" },
      { name: "DEI programs and supplier diversity", when: "Jan 2025", note: "Reversed 2020 public commitments under political pressure" },
      { name: "News Tab / Facebook News", when: "2023", note: "Shut down in US, UK, France, Germany, Australia" },
    ],
    leadership: [
      { person: "Mark Zuckerberg", role: "CEO & Founder", statement: "\"The next major wave of technology is AI, and I believe Meta is well-positioned to lead it.\" — Q4 2024 earnings call", source: "Meta Q4 2024 Earnings" },
      { person: "Susan Li", role: "CFO", statement: "Guided $60–65B in capital expenditure for 2025, explicitly citing AI infrastructure as the primary driver.", source: "Meta Q4 2024 Earnings" },
      { person: "Board / Shareholders", statement: "Zero shareholder resolutions have ever passed over Zuckerberg's objection due to supervoting structure.", source: "Meta Proxy Statements 2004–2024" },
    ],
    source: "Meta 10-K 2024, Q4 2024 Earnings, Meta Newsroom",
  },
  amazon: {
    rdSpend: { value: "$85.6B", pct: "13% of revenue", trend: "Consistent 12–14% of revenue; largest R&D spender in the US by absolute dollars", year: 2023 },
    strategicBets: [
      {
        name: "AWS AI & Generative AI Services",
        capex: "$75B+ total capex guided for 2025",
        thesis: "AWS is embedding AI capabilities into its cloud infrastructure (Bedrock, SageMaker, Trainium chips). Goal: be the default cloud for companies building AI products. AWS revenue grew 17% in 2024.",
        forUsers: "AWS customers (businesses) get AI services. For consumers, this accelerates Alexa upgrades and Amazon's broader AI product integration.",
        issues: ["data_privacy"],
        status: "Core priority — scaling aggressively",
      },
      {
        name: "Logistics & Same-Day Delivery Network",
        capex: "Ongoing; $2B+ invested in same-day facilities 2023–2024",
        thesis: "Amazon is building a delivery network that competes with UPS and FedEx. Same-day delivery in major metros is now standard. The goal: make switching to competitors logistically inferior.",
        forUsers: "Faster delivery is genuinely useful. The logistics network employs 1.5M+ workers, and its injury and turnover rates remain significantly higher than industry averages.",
        issues: ["worker_treatment"],
        status: "Active expansion",
      },
      {
        name: "Healthcare (One Medical + Pharmacy)",
        capex: "$3.9B One Medical acquisition (2023)",
        thesis: "Amazon acquired One Medical (primary care clinics) and runs Amazon Pharmacy. Stated goal: make healthcare easier and cheaper. Unstated risk: health data integration with retail and ad infrastructure.",
        forUsers: "Potentially more convenient care. Privacy advocates have flagged risk of health data being integrated into Amazon's targeting and product recommendation infrastructure.",
        issues: ["data_privacy", "health_wellbeing"],
        status: "Expanding — 200+ One Medical locations",
      },
      {
        name: "Advertising Platform Expansion",
        capex: "Low incremental; high-margin on existing infrastructure",
        thesis: "Amazon's $56B advertising segment is its fastest-growing and highest-margin unit after AWS. Sponsored listings now appear throughout search results, and Amazon is expanding into streaming ads (Prime Video).",
        forUsers: "Organic search results on Amazon increasingly compete with paid placements. Prime Video now includes ads by default after years of being ad-free.",
        issues: ["data_privacy", "corporate_power"],
        status: "Prime Video ads launched Jan 2024",
      },
    ],
    killed: [
      { name: "Amazon Care telehealth service", when: "2022", note: "Shut down despite investment; replaced by One Medical acquisition" },
      { name: "Halo health wearable", when: "2023", note: "Discontinued; fitness tracking data not explained" },
      { name: "Warrantless police Ring access", when: "2022", note: "Ended after public outcry and congressional inquiry" },
    ],
    leadership: [
      { person: "Andy Jassy", role: "CEO", statement: "\"Generative AI may be the largest technology transformation since the cloud, and possibly since the internet.\" — 2023 Annual Shareholder Letter", source: "Amazon 2023 Annual Letter" },
      { person: "Andrew Jassy", role: "CEO", statement: "Described Amazon's plan to be 'the most customer-obsessed company in the world' while simultaneously cutting 27,000+ corporate jobs in 2022–2023.", source: "Amazon Q1 2023 Earnings" },
      { person: "Jeff Bezos", role: "Founder / Executive Chair", statement: "Stepped down as CEO in 2021; transitioned to Executive Chair. Still holds ~9% of shares. Widely seen as setting long-term strategic direction through Jassy.", source: "SEC Filings" },
    ],
    source: "Amazon 10-K 2023, Q4 2023 Earnings, Amazon Newsroom",
  },
  tesla: {
    rdSpend: { value: "$3.97B", pct: "4% of revenue", trend: "Down from 4.8% in 2022; substantially less than legacy automakers investing in EV transition", year: 2024 },
    strategicBets: [
      {
        name: "Full Self-Driving (FSD) & Robotaxi",
        capex: "R&D center; Dojo supercomputer investment",
        thesis: "FSD v13 is the current supervised autonomy system. Tesla plans an unsupervised robotaxi service ('Cybercab'). If achieved, recurring software revenue and a transportation network would transform Tesla's business model.",
        forUsers: "Timelines have slipped repeatedly since 2016. FSD costs $8,000 or $199/month and currently requires driver attention at all times. Safety investigators are actively reviewing FSD crash incidents.",
        issues: ["health_wellbeing", "data_privacy"],
        status: "Robotaxi announced for 2025; FSD supervised only as of 2024",
      },
      {
        name: "Energy Storage (Megapack / Powerwall)",
        capex: "Megapack factory expansion ongoing",
        thesis: "Tesla's energy segment grew 113% year-over-year in 2024. Megapack (utility-scale batteries) benefits from the grid transition to renewables. This is now a genuine profit driver, not just a side business.",
        forUsers: "Grid-scale storage accelerates renewable energy adoption. Powerwall home batteries give homeowners resilience against outages and rate increases.",
        issues: ["environmental_sustainability"],
        status: "Record revenue 2024 — actively scaling",
      },
      {
        name: "Optimus Humanoid Robot",
        capex: "Not separately disclosed; included in R&D",
        thesis: "Musk has called Optimus potentially more valuable than Tesla's vehicle business. Goal: general-purpose humanoid robot for factory and eventually consumer use.",
        forUsers: "Still in prototype stage. No commercial deployment as of 2024. Described by Musk as a key part of Tesla's future; described by analysts as speculative.",
        issues: ["worker_treatment"],
        status: "Prototype — no commercial timeline",
      },
      {
        name: "More Affordable Vehicle ($25K segment)",
        capex: "New platform development underway",
        thesis: "Tesla's current lineup starts around $35K. An affordable model would open a new market segment and compete with Chinese EV makers on price.",
        forUsers: "A $25K Tesla would make EVs accessible to a broader income range. No confirmed launch date as of late 2024.",
        issues: ["environmental_sustainability"],
        status: "Announced; no firm delivery date",
      },
    ],
    killed: [
      { name: "Entire Supercharger team", when: "Apr 2024", note: "Laid off abruptly; later partially rehired after partner automakers expressed alarm" },
      { name: "Public Relations department", when: "2020", note: "Tesla has not had a PR department since 2020; Musk communicates directly via X" },
      { name: "Cybertruck volume production timeline", when: "Ongoing", note: "Delivery slipped years beyond original 2021 target; structural issues reported" },
    ],
    leadership: [
      { person: "Elon Musk", role: "CEO", statement: "\"Tesla is not a car company. It is an AI and robotics company.\" — Multiple earnings calls and public statements", source: "Tesla Earnings Calls 2023–2024" },
      { person: "Elon Musk", role: "CEO", statement: "Proposed a 28% supervoting stake to maintain control while diverting company resources to AI ventures; framed as necessary to avoid AI development 'somewhere else.'", source: "Musk X posts, Jan 2024" },
      { person: "Vaibhav Taneja", role: "CFO", statement: "Guided for continued margin compression in 2024 as price cuts and competition persist; described energy segment as an increasingly important profit contributor.", source: "Tesla Q4 2024 Earnings" },
    ],
    source: "Tesla 10-K 2024, Q4 2024 Earnings, NHTSA Records",
  },
};

// ─── TABS CONFIG ─────────────────────────────────────────────────────────────
const TABS = [
  { id: "overview", label: "Overview" },
  { id: "business", label: "Business Model", dataKey: "business" },
  { id: "labor", label: "Labor", dataKey: "labor" },
  { id: "environment", label: "Environment", dataKey: "environment" },
  { id: "governance", label: "Governance", dataKey: "governance" },
  { id: "legal", label: "Legal Record", dataKey: "legal" },
  { id: "political", label: "Political", dataKey: "political" },
  { id: "privacy", label: "Data & Privacy", dataKey: "dataPrivacy" },
  { id: "trajectory", label: "Trajectory", dataKey: "trajectory" },
];

// Tab → which issues are relevant to it
const TAB_ISSUE_MAP = {
  business:    ["data_privacy", "corporate_power", "free_speech", "fact_checking", "animal_welfare", "health_wellbeing"],
  labor:       ["worker_treatment", "dei", "immigrant_rights", "lgbtq"],
  environment: ["environmental_sustainability", "animal_welfare"],
  governance:  ["corporate_power", "dei"],
  legal:       ["corporate_power", "data_privacy", "child_safety", "worker_treatment", "health_wellbeing"],
  political:   ["corporate_power", "data_privacy", "worker_treatment", "lgbtq", "immigrant_rights", "free_speech", "fact_checking"],
  privacy:     ["data_privacy", "child_safety"],
  trajectory:  ["environmental_sustainability", "worker_treatment", "data_privacy", "corporate_power", "health_wellbeing", "free_speech", "fact_checking"],
};

// ─── REUSABLE COMPONENTS ─────────────────────────────────────────────────────

// Helper: given a data item's issue ids and the user's selected issues, find matches
function getMatchedIssues(itemIssues, selectedIssues) {
  if (!itemIssues || !selectedIssues || selectedIssues.length === 0) return [];
  return itemIssues.filter(id => selectedIssues.includes(id));
}

// Returns dominant alignment across a set of issues for a company
// Priority: conflict > mixed > aligned > null
function getItemAlignment(itemIssues, companyId, selectedIssues, spectra) {
  const matched = getMatchedIssues(itemIssues, selectedIssues);
  if (!matched.length || !companyId) return null;
  const alignments = matched.map(id => getAlignment(id, companyId, spectra?.[id] ?? null)).filter(Boolean);
  if (!alignments.length) return null;
  if (alignments.includes("conflict")) return "conflict";
  if (alignments.includes("mixed"))    return "mixed";
  return "aligned";
}

// CSS class suffix for alignment
function alignClass(alignment) {
  if (alignment === "conflict") return "conflict";
  if (alignment === "mixed")    return "mixed";
  if (alignment === "aligned")  return "aligned";
  return null;
}

// Small inline pill that appears on flagged data items
function IssuePill({ issueIds, selectedIssues, companyId, spectra }) {
  const matched = getMatchedIssues(issueIds, selectedIssues);
  if (matched.length === 0) return null;
  return (
    <div className="issue-pill-row">
      {matched.map(id => {
        const issue = ISSUES.find(i => i.id === id);
        if (!issue) return null;
        const a = getAlignment(id, companyId, spectra?.[id] ?? null);
        const ac = alignClass(a);
        return (
          <span key={id} className={`issue-pill${ac ? ` ip-${ac}` : ""}`}>
            <span className="ip-icon">{issue.icon}</span>
            <span className="ip-label">{issue.label}</span>
          </span>
        );
      })}
    </div>
  );
}

const Bar = ({ label, pct, amt, note, sm, dark }) => (
  <div className={`bar${sm ? " sm" : ""}`}>
    <div className={`bar-lbl${sm ? " mono" : ""}`}>{label}</div>
    <div className="bar-bg">
      <div className="bar-fill" style={{ width: `${pct}%`, background: dark ? "#1A1A1A" : "#2563eb" }} />
    </div>
    <div className="bar-amt">{amt}</div>
    {note && <div className="bar-note">{note}</div>}
  </div>
);

// Combined revenue + profit chart
// One bar per segment: bar width = % of total revenue, bar interior splits black (cost) + green (profit)
function RevenueProfit({ revenueStreams, profitStreams, profitNote }) {
  const profitMap = {};
  (profitStreams || []).forEach(p => { profitMap[p.label] = p; });

  const maxRevPct = Math.max(...revenueStreams.map(r => r.pct));

  return (
    <div className="rp-chart">
      <div className="rp-legend">
        <span className="rp-leg-item"><span className="rp-leg-dot cost" />Cost</span>
        <span className="rp-leg-item"><span className="rp-leg-dot profit" />Profit</span>
        <span className="rp-leg-item"><span className="rp-leg-dot loss" />Loss</span>
      </div>

      {revenueStreams.map(r => {
        const p = profitMap[r.label];
        const isLoss = p && p.loss;
        const margin = p ? Math.max(0, Math.min(p.margin, 100)) : null;
        // Bar width scaled so largest segment = full width
        const barWidth = (r.pct / maxRevPct) * 100;
        // Within the bar: profit is margin%, cost is (100-margin)%
        const profitFill = margin !== null ? margin : null;
        const costFill   = margin !== null ? 100 - margin : 100;

        return (
          <div key={r.label} className="rp-row">
            <div className="rp-label">{r.label}</div>
            <div className="rp-bars">
              <div className="rp-bar-wrap">
                {/* Outer container scaled to revenue share */}
                <div className="rp-bar-outer">
                  <div className="rp-bar-inner" style={{ width: `${barWidth}%` }}>
                    {isLoss ? (
                      <div className="rp-bar-seg loss" style={{ width: "100%" }} />
                    ) : (
                      <>
                        <div className="rp-bar-seg cost" style={{ width: `${costFill}%` }} />
                        {profitFill > 0 && (
                          <div className={`rp-bar-seg profit${p.highlight ? " highlight" : ""}`} style={{ width: `${profitFill}%` }} />
                        )}
                      </>
                    )}
                  </div>
                </div>
                {/* Amounts */}
                <div className="rp-bar-labels">
                  <span className="rp-bar-rev">{r.amt}</span>
                  {p && (
                    <span className={`rp-bar-margin${isLoss ? " loss" : p.highlight ? " highlight" : ""}`}>
                      {p.amt}
                    </span>
                  )}
                </div>
              </div>
              {(p && p.note) && <div className="rp-row-note">{p.note}</div>}
            </div>
          </div>
        );
      })}

      {profitNote && <p className="profit-note">{profitNote}</p>}
    </div>
  );
}

const Stat = ({ label, value, sub }) => (
  <div className="stat">
    <div className="stat-val">{value}</div>
    <div className="stat-label">{label}</div>
    {sub && <div className="stat-sub">{sub}</div>}
  </div>
);

// DataRow now accepts issues + selectedIssues + companyId + spectra for alignment coloring
const DataRow = ({ label, value, note, issues, selectedIssues, companyId, spectra }) => {
  const a = getItemAlignment(issues, companyId, selectedIssues, spectra);
  const ac = alignClass(a);
  return (
    <div className={`data-row${ac ? ` flag-${ac}` : ""}`}>
      <div className="data-row-left">
        <div className="data-row-label">{label}</div>

      </div>
      <div className="data-row-right">
        <div className="data-row-value">{value}</div>
        {note && <div className="data-row-note">{note}</div>}
      </div>
    </div>
  );
};

const Explainer = ({ title, body, issues, selectedIssues, companyId, spectra }) => {
  const a = getItemAlignment(issues, companyId, selectedIssues, spectra);
  const ac = alignClass(a);
  return (
    <div className={`explainer${ac ? ` flag-${ac}` : ""}`}>
      <div className="explainer-title">{title}</div>
      <div className="explainer-body">{body}</div>

    </div>
  );
};

const SourceBadge = ({ source }) => <div className="source-badge">§ {source}</div>;

const SectionHead = ({ title, source }) => (
  <div className="sec-head">
    <h3 className="sec-title">{title}</h3>
    {source && <SourceBadge source={source} />}
  </div>
);

// ─── ISSUE CALLOUT (collapsible summary at top of relevant tabs) ──────────────
function IssueCallout({ companyId, selectedIssues, tabId, spectra }) {
  const [collapsed, setCollapsed] = useState(false);
  const relevantIssueIds = (TAB_ISSUE_MAP[tabId] || []).filter(id => selectedIssues.includes(id));
  if (relevantIssueIds.length === 0) return null;

  const relevanceData = ISSUE_RELEVANCE[companyId] || {};
  const items = relevantIssueIds.map(id => ({
    issue: ISSUES.find(i => i.id === id),
    data: relevanceData[id],
    alignment: getAlignment(id, companyId, spectra?.[id] ?? null),
  })).filter(i => i.issue && i.data);

  if (items.length === 0) return null;

  // Dominant alignment for the callout block
  const dominant = items.some(i => i.alignment === "conflict") ? "conflict"
    : items.some(i => i.alignment === "mixed") ? "mixed"
    : items.some(i => i.alignment === "aligned") ? "aligned"
    : null;

  return (
    <div className={`issue-callout-block${dominant ? ` icb-${dominant}` : ""}`}>
      <button className="icb-header" onClick={() => setCollapsed(c => !c)}>
        <div className="icb-header-left">
          <span className="icb-eyebrow">
            {dominant === "conflict" ? "✕ Conflicts with your values"
              : dominant === "mixed" ? "∼ Mixed record"
              : dominant === "aligned" ? "✓ Aligns with your values"
              : "Your issues"}
          </span>
          <div className="icb-issue-names">
            {items.map(({ issue }) => (
              <span key={issue.id} className="icb-issue-name">{issue.icon} {issue.label}</span>
            ))}
          </div>
        </div>
        <span className={`icb-chevron${collapsed ? " up" : ""}`}>
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 9L7 5L11 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/></svg>
        </span>
      </button>
      {!collapsed && (
        <div className="icb-body">
          {items.map(({ issue, data, alignment }) => {
            const ac = alignClass(alignment);
            return (
              <div key={issue.id} className={`icb-item${ac ? ` icb-item-${ac}` : ""}`}>
                {items.length > 1 && (
                  <div className="icb-item-issue-name">{issue.icon} {issue.label}</div>
                )}
                <p className="icb-item-headline">{data.headline}</p>
                <ul className="icb-points">
                  {data.dataPoints.map((pt, i) => <li key={i}>{pt}</li>)}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── TAB CONTENT WRAPPER (adds persistent left rail when issues match) ─────────
function TabContentWrapper({ tabId, selectedIssues, children }) {
  const hasRelevant = selectedIssues.length > 0 &&
    (TAB_ISSUE_MAP[tabId] || []).some(id => selectedIssues.includes(id));
  return (
    <div className={`tab-content${hasRelevant ? " has-flagged" : ""}`}>
      {children}
    </div>
  );
}

// ─── TAB CONTENT ─────────────────────────────────────────────────────────────

function BusinessTab({ company, selectedIssues, spectra }) {
  const d = company.business;
  return (
    <TabContentWrapper tabId="business" selectedIssues={selectedIssues}>
      <IssueCallout companyId={company.id} selectedIssues={selectedIssues} tabId="business" spectra={spectra} />
      <div className="summary-block"><p className="summary-text">{d.summary}</p></div>

      {/* Revenue + Profit combined chart */}
      <div className="section">
        <SectionHead title="Revenue vs. profit by segment" source={d.source} />
        <RevenueProfit
          revenueStreams={d.revenueStreams}
          profitStreams={d.profitStreams}
          profitNote={d.profitNote}
        />
      </div>

      <div className="section">
        <SectionHead title="Key metrics" source={d.source} />
        <div className="stat-grid">{d.keyMetrics.map(m => <Stat key={m.label} {...m} />)}</div>
      </div>
      {d.profitDrivers && (
        <div className="section">
          <SectionHead title="What drives their profit" />
          {d.profitDrivers.map(e => <Explainer key={e.title} {...e} selectedIssues={selectedIssues} companyId={company.id} spectra={spectra} />)}
        </div>
      )}
      <div className="section">
        <SectionHead title="How the business model works" />
        {d.modelExplainer.map(e => <Explainer key={e.title} {...e} selectedIssues={selectedIssues} companyId={company.id} spectra={spectra} />)}
      </div>
      {d.costStructure && (
        <div className="section">
          <SectionHead title="What costs do they need to minimize" />
          <p className="biz-cost-intro">{d.costStructure.summary}</p>
          {d.costStructure.items.map((c, i) => {
            const a = getItemAlignment(c.issues, company.id, selectedIssues, spectra);
            const ac = alignClass(a);
            return (
              <div key={i} className={`cost-item${ac ? ` flag-${ac}` : ""}`}>
                <div className="cost-label">{c.label}</div>
                <div className="cost-body">{c.body}</div>
              </div>
            );
          })}
        </div>
      )}
    </TabContentWrapper>
  );
}

function LaborTab({ company, selectedIssues, spectra }) {
  const d = company.labor;
  const maxCount = Math.max(...d.headcountHistory.map(h => h.count));
  return (
    <TabContentWrapper tabId="labor" selectedIssues={selectedIssues}>
      <IssueCallout companyId={company.id} selectedIssues={selectedIssues} tabId="labor" spectra={spectra} />
      <div className="section">
        <SectionHead title="Headcount history" source={d.source} />
        {d.headcountHistory.map(h => (
          <Bar key={h.year} label={h.year} pct={(h.count / maxCount) * 100} amt={h.count.toLocaleString()} note={h.note} dark sm />
        ))}
      </div>
      {d.layoffs.length > 0 && (
        <div className="section">
          <SectionHead title="Significant layoff events" />
          {d.layoffs.map((l, i) => {
            const a = getItemAlignment(l.issues, company.id, selectedIssues, spectra);
            const ac = alignClass(a);
            return (
              <div key={i} className={`event-card${ac ? ` flag-${ac}` : ""}`}>
                <div className="event-header">
                  <span className="event-date">{l.date}</span>
                  <span className="event-count">{l.count} employees</span>
                  <span className="event-pct">{l.pct} of workforce</span>
                </div>
                <p className="event-context">{l.context}</p>

              </div>
            );
          })}
        </div>
      )}
      <div className="section">
        <SectionHead title="Compensation" source={d.source} />
        {d.compensation.map(c => (
          <DataRow key={c.label} label={c.label} value={c.value} note={c.sub} issues={c.issues} selectedIssues={selectedIssues} companyId={company.id} spectra={spectra} />
        ))}
      </div>
      <div className="section">
        <SectionHead title="Union & labor relations" source={d.source} />
        <div className="prose-block">{d.unionization}</div>
      </div>
    </TabContentWrapper>
  );
}

function EnvironmentTab({ company, selectedIssues, spectra }) {
  const d = company.environment;
  return (
    <TabContentWrapper tabId="environment" selectedIssues={selectedIssues}>
      <IssueCallout companyId={company.id} selectedIssues={selectedIssues} tabId="environment" spectra={spectra} />
      <div className="section">
        <SectionHead title="Greenhouse gas emissions" source={d.source} />
        {d.emissions.map(e => (
          <DataRow key={e.label} label={`${e.label} (${e.year})`} value={e.value} note={e.note} issues={e.issues} selectedIssues={selectedIssues} companyId={company.id} spectra={spectra} />
        ))}
      </div>
      <div className="section">
        <SectionHead title="Stated commitments" source={d.source} />
        {d.targets.map(t => {
          const a = getItemAlignment(t.issues, company.id, selectedIssues, spectra);
          const ac = alignClass(a);
          return (
            <div key={t.label} className={`target-row${ac ? ` flag-${ac}` : ""}`}>
              <div className="target-label">{t.label}</div>
              <div className="target-right">
                <div className="target-value">{t.value}</div>
                <div className="target-status">{t.status}</div>
                {t.note && <div className="target-note">{t.note}</div>}
              </div>

            </div>
          );
        })}
      </div>
      {d.risks.length > 0 && (
        <div className="section">
          <SectionHead title="Context & methodological notes" />
          {d.risks.map(r => <Explainer key={r.title} {...r} selectedIssues={selectedIssues} companyId={company.id} spectra={spectra} />)}
        </div>
      )}
    </TabContentWrapper>
  );
}

function GovernanceTab({ company, selectedIssues, spectra }) {
  const d = company.governance;
  return (
    <TabContentWrapper tabId="governance" selectedIssues={selectedIssues}>
      <IssueCallout companyId={company.id} selectedIssues={selectedIssues} tabId="governance" spectra={spectra} />
      <div className="section">
        <SectionHead title="Share structure & voting control" source={d.source} />
        <div className="prose-block highlight">{d.controlStructure}</div>
      </div>
      <div className="section">
        <SectionHead title="Board composition" source={d.source} />
        {d.boardComposition.map(b => (
          <DataRow key={b.label} label={b.label} value={b.value} note={b.sub} issues={b.issues} selectedIssues={selectedIssues} companyId={company.id} spectra={spectra} />
        ))}
      </div>
      <div className="section">
        <SectionHead title="Shareholder resolutions" source={d.source} />
        <div className="prose-block">{d.shareholderResolutions}</div>
      </div>
    </TabContentWrapper>
  );
}

function LegalTab({ company, selectedIssues, spectra }) {
  const d = company.legal;
  const statusColor = {
    "Active": "#92400e", "Final": "#14532d", "Settled": "#1e3a5f",
    "Ongoing": "#92400e", "Multiple Active": "#92400e", "Various": "#374151",
    "Active / Partial settlement": "#92400e",
  };
  const relevantIssues = (TAB_ISSUE_MAP["legal"] || []).filter(id => selectedIssues.includes(id));
  return (
    <TabContentWrapper tabId="legal" selectedIssues={selectedIssues}>
      <IssueCallout companyId={company.id} selectedIssues={selectedIssues} tabId="legal" spectra={spectra} />
      {d.items.map(item => {
        const matchedIssues = relevantIssues.length > 0
          ? (item.issues || []).filter(id => relevantIssues.includes(id))
          : [];
        const isRelevant = matchedIssues.length > 0;
        const a = isRelevant ? getItemAlignment(matchedIssues, company.id, selectedIssues, spectra) : null;
        const ac = alignClass(a);
        return (
          <div key={item.name} className={`legal-card${isRelevant ? " relevant" : ""}${ac ? ` rel-${ac}` : ""}`}>
            {isRelevant && (
              <div className="legal-relevant-mark">
                <IssuePill issueIds={matchedIssues} selectedIssues={selectedIssues} companyId={company.id} spectra={spectra} />
              </div>
            )}
            <div className="legal-header">
              <div className="legal-name">{item.name}</div>
              <div className="legal-meta">
                <span className="legal-filed">Filed: {item.filed}</span>
                <span className="legal-amount">{item.amount}</span>
                <span className="legal-status" style={{ color: statusColor[item.status] || "#374151" }}>{item.status}</span>
              </div>
            </div>
            <p className="legal-summary">{item.summary}</p>
          </div>
        );
      })}
      <SourceBadge source={d.source} />
    </TabContentWrapper>
  );
}

function PoliticalTab({ company, selectedIssues, spectra }) {
  const d = company.political;
  const maxSpend = Math.max(...d.annualSpend.map(s => s.amt));
  return (
    <TabContentWrapper tabId="political" selectedIssues={selectedIssues}>
      <IssueCallout companyId={company.id} selectedIssues={selectedIssues} tabId="political" spectra={spectra} />
      <div className="stat-grid single">
        <Stat label={`Total lobbying spend, ${d.lobbyingYears}`} value={d.lobbyingTotal} />
      </div>
      <div className="section">
        <SectionHead title="Annual lobbying expenditure" source={d.source} />
        {d.annualSpend.map(s => (
          <Bar key={s.year} label={String(s.year)} pct={(s.amt / maxSpend) * 100} amt={`$${s.amt}M`} dark sm />
        ))}
      </div>
      <div className="section">
        <SectionHead title="Reported lobbying priorities" source={d.source} />
        {d.keyIssues.map(issue => {
          const a = getItemAlignment(issue.issues, company.id, selectedIssues, spectra);
          const ac = alignClass(a);
          return (
            <div key={issue.label} className={`lobby-row${ac ? ` flag-${ac}` : ""}`}>
              <div className="lobby-label-col">
                <div className="lobby-label">{issue.label}</div>

              </div>
              <div className="lobby-stance">{issue.stance}</div>
            </div>
          );
        })}
      </div>
      <div className="section">
        <SectionHead title="Industry relationships" source={d.source} />
        {d.revolvingDoor.map(r => <DataRow key={r.label} label={r.label} value={r.value} note={r.sub} />)}
      </div>
    </TabContentWrapper>
  );
}

function PrivacyTab({ company, selectedIssues, spectra }) {
  const d = company.dataPrivacy;
  return (
    <TabContentWrapper tabId="privacy" selectedIssues={selectedIssues}>
      <IssueCallout companyId={company.id} selectedIssues={selectedIssues} tabId="privacy" spectra={spectra} />
      <div className="summary-block"><p className="summary-text">{d.model}</p></div>
      <div className="section">
        <SectionHead title="Data practices" source={d.source} />
        {d.practices.map(p => {
          const a = getItemAlignment(p.issues, company.id, selectedIssues, spectra);
          const ac = alignClass(a);
          return (
            <div key={p.label} className={`privacy-row${ac ? ` flag-${ac}` : ""}`}>
              <div className="privacy-label-col">
                <div className="privacy-label">{p.label}</div>

              </div>
              <div className="privacy-right">
                <span className={`privacy-value pv-${p.valence || "neutral"}`}>{p.value}</span>
                {p.note && <div className="privacy-note">{p.note}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </TabContentWrapper>
  );
}

// ─── ALIGNMENT SCORING ────────────────────────────────────────────────────────
// Determines how a company's record maps to a user's issue position
// Returns: "conflict" | "aligned" | "mixed" | null
const ALIGNMENT_RULES = {
  // Spectrum issues: alignment depends on user's position (1-5 scale)
  // Left=1-2, neutral=3, right=4-5
  // We look up a static characterization per company × issue direction
  dei: {
    meta:   { left: "conflict",  right: "aligned",  note: "Meta ended DEI programs in 2025" },
    amazon: { left: "mixed",     right: "mixed",     note: "Amazon maintains programs; limited disclosure" },
    tesla:  { left: "conflict",  right: "mixed",     note: "No EEO-1 reporting; racial harassment case active" },
  },
  lgbtq: {
    meta:   { left: "mixed",     right: "mixed",     note: "Benefits maintained; equity rollback" },
    amazon: { left: "aligned",   right: "mixed",     note: "Benefits and programs in place" },
    tesla:  { left: "mixed",     right: "mixed",     note: "Standard benefits; no advocacy" },
  },
  reproductive: {
    meta:   { left: "conflict",  right: "aligned",   note: "Travel reimbursement scaled back 2025" },
    amazon: { left: "aligned",   right: "mixed",     note: "Travel reimbursement in place" },
    tesla:  { left: "aligned",   right: "mixed",     note: "Travel reimbursement in place" },
  },
  online_speech: {
    meta:   { left: "conflict",  right: "aligned",   note: "Ended fact-checking Jan 2025" },
    amazon: { left: "aligned",   right: "mixed",     note: "AWS terminated Parler; no consumer speech issues" },
    tesla:  { left: "aligned",   right: "aligned",   note: "Not a speech platform" },
  },
  free_speech: {
    meta:   "aligned",   // Ended fact-checking; shifted toward less moderation
    amazon: "mixed",     // AWS terminated Parler (infrastructure decision); no consumer speech platform
    tesla:  "aligned",   // Not a speech platform; Musk's X advocacy is separate
  },
  fact_checking: {
    meta:   "conflict",  // Ended third-party fact-checking Jan 2025; suppressed COVID info at WH request
    amazon: "mixed",     // AWS Parler termination; no active fact-checking program
    tesla:  "mixed",     // Not a platform; Musk's X dismantling of fact-checking is legally separate
  },
  // Universal issues: we assess the company's record independently
  environmental_sustainability: {
    meta:   "mixed",    // Claims 100% RE via RECs; AI growth undermines 2030 target
    amazon: "mixed",    // Absolute emissions grew; delivery fleet still mostly ICE
    tesla:  "aligned",  // Core product reduces emissions; no net-zero pledge
  },
  immigrant_rights: {
    meta:   "mixed",    // No direct contracts; but complied with DOJ/ICE requests to suppress protection tools
    amazon: "conflict", // AWS hosts ICE's core targeting database; CBP hosts 62% of systems on AWS; Ring/Flock Safety partnerships
    tesla:  "mixed",    // No direct contracts; Musk/DOGE connection to Palantir ICE infrastructure is indirect but material
  },
  child_safety: {
    meta:   "conflict", // Internal research suppressed; 1,400+ lawsuits active
    amazon: "mixed",    // Alexa COPPA settlement; Ring data issues resolved
    tesla:  "aligned",  // Not a children's platform
  },
  animal_welfare: {
    meta:   "aligned",  // Digital company; no supply chain animal exposure
    amazon: "mixed",    // Whole Foods sourcing claims; auditing varies
    tesla:  "aligned",  // EV company; no animal supply chain
  },
  data_privacy: {
    meta:   "conflict", // 98% revenue from tracking; €1.2B GDPR fine
    amazon: "mixed",    // Collects extensively; data not sold; Ring/Alexa issues
    tesla:  "mixed",    // Continuous vehicle data collection; used for AI training
  },
  health_wellbeing: {
    meta:   "conflict", // Active MDL; suppressed internal research on teen harm
    amazon: "mixed",    // One Medical privacy concerns; Alexa settlement
    tesla:  "mixed",    // Autopilot investigations; 2M+ vehicle recall
  },
  worker_treatment: {
    meta:   "mixed",    // 21K layoffs; contractor pay gaps; no unions
    amazon: "conflict", // 5,621:1 pay ratio; NLRB complaints; injury rates
    tesla:  "conflict", // NLRB complaints; racial harassment case; Nordic strikes
  },
  corporate_power: {
    meta:   "conflict", // FTC antitrust trial; supervoting; $185M lobbying
    amazon: "conflict", // FTC antitrust active; EU fine; marketplace dominance
    tesla:  "mixed",    // Governance concerns; Musk conflicts; not monopolistic
  },
};

function getAlignment(issueId, companyId, spectraVal) {
  const rules = ALIGNMENT_RULES[issueId];
  if (!rules) return null;
  const companyRule = rules[companyId];
  if (!companyRule) return null;
  if (typeof companyRule === "string") return companyRule;
  // Binary or spectrum issue: spectraVal is "left" | "right" or numeric 1-5
  if (spectraVal === null || spectraVal === undefined) return null;
  const side = (spectraVal === "left" || spectraVal <= 2) ? "left"
             : (spectraVal === "right" || spectraVal >= 4) ? "right"
             : null; // numeric 3 = neutral, no alignment
  if (!side) return null;
  return companyRule[side] || null;
}

function AlignmentTag({ alignment, note }) {
  if (!alignment) return null;
  const configs = {
    aligned:  { label: "Aligns with your values", cls: "align-tag aligned" },
    conflict: { label: "Conflicts with your values", cls: "align-tag conflict" },
    mixed:    { label: "Mixed record", cls: "align-tag mixed" },
  };
  const cfg = configs[alignment];
  if (!cfg) return null;
  return (
    <div className={cfg.cls} title={note || ""}>
      {alignment === "aligned" && "✓ "}
      {alignment === "conflict" && "✕ "}
      {alignment === "mixed" && "~ "}
      {cfg.label}
      {note && <span className="align-note"> · {note}</span>}
    </div>
  );
}

// ─── OVERVIEW TAB ─────────────────────────────────────────────────────────────
function OverviewTab({ company, selectedIssues, spectra, onTabChange }) {
  const [showFullWhat, setShowFullWhat] = useState(false);
  const overview = COMPANY_OVERVIEWS[company.id];
  const relevanceData = ISSUE_RELEVANCE[company.id] || {};
  const hasIssues = selectedIssues.length > 0;

  return (
    <div className="ov-root">
      {/* ── COMPANY SUMMARY ── */}
      {overview && (
        <div className="ov-company-block">
          <div className="ov-company-lede">{overview.lede}</div>

          <div className="ov-two-col">
            {/* What is this company */}
            <div className="ov-col">
              <div className="ov-col-label">What is this company?</div>
              <p className="ov-col-body">
                {showFullWhat ? overview.what : overview.what.slice(0, 220) + "…"}
                {" "}
                <button className="ov-show-more" onClick={() => setShowFullWhat(s => !s)}>
                  {showFullWhat ? "Show less" : "Read more"}
                </button>
              </p>
            </div>

            {/* Who leads it */}
            <div className="ov-col">
              <div className="ov-col-label">Who leads it?</div>
              <div className="ov-leader">
                <div className="ov-leader-name">{overview.who.ceo}</div>
                <div className="ov-leader-role">
                  {overview.who.founderStatus ? "Founder & CEO" : "CEO (hired operator)"} · {overview.who.tenure}
                </div>
                <div className="ov-leader-control">{overview.who.control}</div>
                {overview.who.chairSame && (
                  <div className="ov-control-flag">⚠ CEO and Board Chair are the same person</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ISSUE SECTION ── */}
      {!hasIssues ? (
        <div className="ov-empty">
          <div className="ov-empty-icon">◈</div>
          <h3>Personalize your view</h3>
          <p>Select issues during onboarding to see how {company.name}'s record intersects with what you care about — with color-coded alignment tags.</p>
        </div>
      ) : (
        <div className="ov-issues-section">
          <div className="ov-issues-label">
            Your issues · How {company.name}'s record compares
            <span className="ov-align-legend">
              <span className="ov-al-item"><span className="ov-align-dot ov-align-dot-aligned"/>aligns</span>
              <span className="ov-al-item"><span className="ov-align-dot ov-align-dot-conflict"/>conflicts</span>
              <span className="ov-al-item"><span className="ov-align-dot ov-align-dot-mixed"/>mixed</span>
            </span>
          </div>
          <div className="ov-content">
            {selectedIssues.map(issueId => {
              const issue = ISSUES.find(i => i.id === issueId);
              const rel = relevanceData[issueId];
              if (!issue || !rel) return null;
              const primaryTab = rel.tabs[0];
              const tabLabel = TABS.find(t => t.id === primaryTab)?.label || primaryTab;
              const alignment = getAlignment(issueId, company.id, spectra?.[issueId] ?? null);
              const alignRule = ALIGNMENT_RULES[issueId]?.[company.id];
              const alignNote = typeof alignRule === "object"
                ? (spectra?.[issueId] <= 2 ? alignRule.note : alignRule.note)
                : null;
              return (
                <div key={issueId} className={`ov-issue-card align-${alignment || "none"}`}>
                  <div className="ov-ic-header">
                    <div className="ov-ic-title">
                      <span className="ov-ic-icon">{issue.icon}</span>
                      <span className="ov-ic-label">{issue.label}</span>
                      {alignment && (
                        <span className={`ov-align-dot ov-align-dot-${alignment}`} title={alignNote || alignment} />
                      )}
                    </div>
                    <button className="ov-ic-link" onClick={() => onTabChange(primaryTab)}>
                      {tabLabel} →
                    </button>
                  </div>
                  <p className="ov-ic-headline">{rel.headline}</p>
                  <ul className="ov-ic-points">
                    {rel.dataPoints.map((pt, i) => <li key={i}>{pt}</li>)}
                  </ul>
                  {rel.tabs.length > 1 && (
                    <div className="ov-ic-also">
                      Also relevant:
                      {rel.tabs.slice(1).map(tid => {
                        const tl = TABS.find(t => t.id === tid)?.label || tid;
                        return (
                          <button key={tid} className="ov-ic-also-btn" onClick={() => onTabChange(tid)}>{tl}</button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TRAJECTORY TAB ────────────────────────────────────────────────────────────
function TrajectoryTab({ company, selectedIssues, spectra }) {
  const d = TRAJECTORY_DATA[company.id];
  if (!d) return <div className="ov-empty"><p>Trajectory data not available for this company.</p></div>;

  return (
    <TabContentWrapper tabId="trajectory" selectedIssues={selectedIssues}>
      <IssueCallout companyId={company.id} selectedIssues={selectedIssues} tabId="trajectory" spectra={spectra} />

      {/* R&D Spend */}
      <div className="section">
        <SectionHead title="Research & development investment" source={d.source} />
        <div className="stat-grid">
          <Stat label="R&D Spend" value={d.rdSpend.value} sub={`${d.rdSpend.year}`} />
          <Stat label="% of Revenue" value={d.rdSpend.pct} sub="R&D intensity" />
        </div>
        <p className="traj-rd-trend">{d.rdSpend.trend}</p>
      </div>

      {/* Strategic Bets */}
      <div className="section">
        <SectionHead title="Strategic bets — where capital is flowing" />
        {d.strategicBets.map(bet => {
          const a = getItemAlignment(bet.issues, company.id, selectedIssues, spectra);
          const ac = alignClass(a);
          return (
            <div key={bet.name} className={`traj-bet${ac ? ` flag-${ac}` : ""}`}>
              <div className="traj-bet-header">
                <div>
                  <div className="traj-bet-name">{bet.name}</div>
                  <div className="traj-bet-capex">{bet.capex}</div>
                </div>
                <div className="traj-bet-status">{bet.status}</div>
              </div>
              <p className="traj-bet-thesis"><strong>The thesis:</strong> {bet.thesis}</p>
              <div className="traj-bet-impact">
                <span className="traj-impact-label">What this means for you →</span>
                {bet.forUsers}
              </div>

            </div>
          );
        })}
      </div>

      {/* What they've killed / scaled back */}
      <div className="section">
        <SectionHead title="Recently killed or scaled back" />
        <p className="ov-intro" style={{marginBottom:"8px"}}>What a company stops doing is often more revealing than what it starts.</p>
        {d.killed.map((k, i) => (
          <div key={i} className="traj-killed">
            <div className="traj-killed-header">
              <span className="traj-killed-name">{k.name}</span>
              <span className="traj-killed-when">{k.when}</span>
            </div>
            <div className="traj-killed-note">{k.note}</div>
          </div>
        ))}
      </div>

      {/* Leadership & stated direction */}
      <div className="section">
        <SectionHead title="Leadership direction — what they've said publicly" source={d.source} />
        {d.leadership.map((l, i) => (
          <div key={i} className="traj-quote">
            <div className="traj-quote-person">
              <span className="traj-quote-name">{l.person}</span>
              {l.role && <span className="traj-quote-role">{l.role}</span>}
            </div>
            <p className="traj-quote-text">{l.statement}</p>
            {l.source && <div className="traj-quote-src">§ {l.source}</div>}
          </div>
        ))}
      </div>
    </TabContentWrapper>
  );
}

// ─── ONBOARDING HELPERS ───────────────────────────────────────────────────────

// Issue groups for the Pick screen
const ISSUE_GROUPS = [
  { id: "Workplace",  label: "Workplace & Labor" },
  { id: "Social",     label: "Social & Identity" },
  { id: "Tech",       label: "Tech, Safety & Markets" },
];

const ONBOARDING_ISSUES = [
  // ── Workplace & Labor ──
  { id:"worker_treatment", label:"Worker Treatment",              icon:"👷", group:"Workplace", type:"universal",
    summary:"Fair wages, union rights, layoff practices" },
  { id:"immigrant_rights", label:"Immigrant Rights",             icon:"🌐", group:"Workplace", type:"universal",
    summary:"ICE contracts, workforce protections, due process" },
  { id:"dei",              label:"Diversity & Inclusion",         icon:"🤝", group:"Workplace", type:"universal",
    summary:"Leadership diversity, pay equity, hiring" },
  // ── Social & Identity ──
  { id:"lgbtq",            label:"LGBTQ+ Advocacy",               icon:"🏳️‍🌈", group:"Social", type:"universal",
    summary:"Benefits, public advocacy, inclusivity" },
  { id:"environmental_sustainability", label:"Environmental Sustainability", icon:"🌱", group:"Social", type:"universal",
    summary:"Emissions targets, renewables, supply chain" },
  // ── Tech, Safety & Markets ──
  { id:"data_privacy",     label:"Personal Data & Privacy",      icon:"🔒", group:"Tech", type:"universal",
    summary:"Data collection, selling, user control" },
  { id:"free_speech",      label:"Free Speech",                  icon:"🗣️",  group:"Tech", type:"universal",
    summary:"Content removal, censorship, transparency" },
  { id:"fact_checking",    label:"Fact-Checking & Moderation",   icon:"🔍", group:"Tech", type:"universal",
    summary:"Misinformation, fact-checking, platform accountability" },
  { id:"child_safety",     label:"Child Safety",                 icon:"🧒", group:"Tech", type:"universal",
    summary:"Minors' data, mental health, advertising" },
  { id:"corporate_power",  label:"Political Collusion",              icon:"⚖️", group:"Tech", type:"universal",
    summary:"Market dominance, tax practices, political donations" },
  { id:"health_wellbeing", label:"Health & Well-being",          icon:"🧬", group:"Tech", type:"universal",
    summary:"Product transparency, drug pricing, harm" },
  { id:"animal_welfare",   label:"Animal Welfare",               icon:"🐾", group:"Tech", type:"universal",
    summary:"Supply chain, testing, welfare standards" },
];

// Screen wrapper with fade-up animation (faithful to v8)
function Screen({ children, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    requestAnimationFrame(() => { el.style.opacity = "1"; el.style.transform = "translateY(0)"; });
  }, []);
  return (
    <div ref={ref} className={`screen ${className}`}
      style={{ opacity: 0, transform: "translateY(20px)", transition: "opacity 0.45s ease, transform 0.45s ease" }}>
      {children}
    </div>
  );
}

// Spectrum slider (faithful to v8)
function SpectrumSlider({ cat, value, onChange }) {
  const chosen = value === 1 ? cat.left.desc
    : value === 2 ? cat.left.desc
    : value === 3 ? "Somewhere in the middle on this"
    : value === 4 ? cat.right.desc
    : value === 5 ? cat.right.desc : null;
  const leftActive  = value !== null && value <= 2;
  const rightActive = value !== null && value >= 4;
  return (
    <div className="slider">
      <div className="slider-poles">
        <div className={`slider-pole${leftActive ? " active" : ""}`}>
          <div className="pole-name">{cat.left.label}</div>
          <div className="pole-desc">{cat.left.desc}</div>
        </div>
        <div className="slider-vs">vs.</div>
        <div className={`slider-pole${rightActive ? " active" : ""}`}>
          <div className="pole-name">{cat.right.label}</div>
          <div className="pole-desc">{cat.right.desc}</div>
        </div>
      </div>
      <div className="slider-track-wrap">
        <div className="slider-track-line" />
        <div className="slider-dots">
          {[1,2,3,4,5].map(v => (
            <button key={v} className={`sdot${value===v?" sel":""}${v===3?" mid":""}`}
              onClick={() => onChange(value === v ? null : v)}>
              {value === v && <span className="sdot-fill" />}
            </button>
          ))}
        </div>
      </div>
      <div className="slider-foot">
        <span className="slider-end-label">{cat.left.label}</span>
        <span className="slider-center-label">Neutral</span>
        <span className="slider-end-label">{cat.right.label}</span>
      </div>
      <div className={`slider-result${chosen ? " show" : ""}`}>
        {chosen && <>
          <span className="slider-result-eyebrow">Your position</span>
          <span className="slider-result-text">"{chosen}"</span>
        </>}
      </div>
    </div>
  );
}

// ─── WELCOME HEADLINE ────────────────────────────────────────────────────────
const CYCLE_WORDS = ["dollars", "attention", "data", "labor", "silence"];

function WelcomeHed() {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const iv = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setIndex(i => (i + 1) % CYCLE_WORDS.length);
        setFading(false);
      }, 350);
    }, 2000);
    return () => clearInterval(iv);
  }, []);

  return (
    <h1 className="welcome-hed">
      We vote with<span className="hed-br-mobile"><br /></span> our<span className="hed-br-desktop"><br /></span> <span className={`hed-cycle-word${fading ? " fading" : ""}`}>{CYCLE_WORDS[index]}.</span>
    </h1>
  );
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
function Onboarding({ onComplete }) {
  const [screen,  setScreen]  = useState("welcome");
  const [selected, setSelected] = useState(new Set());
  const [spectra,  setSpectra]  = useState({});
  const toggle = id => setSelected(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const finish = () => onComplete({ selected: [...selected], spectra: {} });
  const skip   = () => onComplete({ selected: [], spectra: {} });

  // ── WELCOME ──
  if (screen === "welcome") return (
    <Screen className="welcome-screen">
      <div className="welcome-grain" />
      <div className="welcome-content">
        <div className="welcome-eyebrow">Transparent · Corporate Accountability</div>
        <WelcomeHed />
        <h1 className="welcome-hed welcome-hed-sub-line"><span className="welcome-hed-sub">See who we're voting for.</span></h1>
        <div className="welcome-rule" />
        <p className="welcome-dek">
          Companies spend millions shaping what you see. We show you what they don't want you to — sourced from public records, explained in plain English.
        </p>
        <button className="btn-cta" onClick={() => setScreen("pick")}>
          Get started <span className="cta-arrow">→</span>
        </button>
      </div>
    </Screen>
  );

  // ── PICK ──
  if (screen === "pick") return (
    <Screen className="pick-screen">
      <div className="pick-nav">
        <button className="pick-back" onClick={() => setScreen("welcome")}>← Back</button>
      </div>
      <div className="pick-header">
        <h2 className="pick-hed">What matters to you?</h2>
        <p className="pick-sub-note">We'll highlight decisions companies are making in these areas.</p>
      </div>

      <div className="pick-grid">
        {ONBOARDING_ISSUES.map((c, i) => {
          const sel = selected.has(c.id);
          return (
            <button key={c.id}
              className={`pick-card${sel ? " sel" : ""}`}
              style={{ animationDelay: `${i * 40}ms` }}
              onClick={() => toggle(c.id)}>
              <div className="pick-card-top">
                <span className="pick-card-icon">{c.icon}</span>
                <div className={`pick-card-check${sel ? " show" : ""}`}>
                  <svg width="9" height="7" viewBox="0 0 10 8">
                    <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </div>
              </div>
              <div className="pick-card-label">{c.label}</div>
              {c.summary && <div className="pick-card-summary">{c.summary}</div>}
            </button>
          );
        })}
      </div>

      <div className="pick-footer">
        <button className="pick-cta" disabled={selected.size === 0} onClick={() => setScreen("loop")}>
          Continue →
        </button>
        <button className="pick-skip" onClick={skip}>Skip — show everything</button>
      </div>
    </Screen>
  );



  // ── LOOP ──
  if (screen === "loop") return (
    <Screen className="loop-screen">
      <div className="loop-inner">
        <div className="loop-nav">
          <button className="pick-back loop-back" onClick={() => setScreen("pick")}>← Back</button>
        </div>
        <div className="loop-header">
          <h2 className="loop-hed">Stay in the loop</h2>
          <p className="loop-subhed">Two ways to track what companies do next.</p>
        </div>

        <div className="loop-cards">

          {/* Card 1: Extension */}
          <div className="loop-card">
            <div className="loop-card-body">
              <div className="loop-card-label">
                <span className="loop-card-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.5 11H19V7a2 2 0 0 0-2-2h-4V3.5a2.5 2.5 0 0 0-5 0V5H4a2 2 0 0 0-2 2v3.8h1.5a2.5 2.5 0 0 1 0 5H2V20a2 2 0 0 0 2 2h3.8v-1.5a2.5 2.5 0 0 1 5 0V22H17a2 2 0 0 0 2-2v-4h1.5a2.5 2.5 0 0 0 0-5Z"/>
                  </svg>
                </span>
                Browser Extension
              </div>
              <h3 className="loop-card-title">Get notified while you browse</h3>
              <p className="loop-card-desc">Surfaces a quick scorecard when you visit a company's site. Suggests alternatives when they don't align with your values.</p>
              <div className="loop-ext-badge">
                <span className="loop-ext-icon">◈</span>
                <span className="loop-ext-name">Transparent for Chrome</span>
                <span className="loop-ext-cta">Add to Chrome →</span>
              </div>
            </div>
            <div className="loop-card-visual ext-visual">
              <div className="ext-mockup">
                <div className="ext-popup">
                  <div className="ext-popup-header">
                    <span className="ext-popup-mark">◈</span>
                    <span className="ext-popup-brand">Transparent</span>
                    <span className="ext-popup-domain">amazon.com</span>
                  </div>
                  <div className="ext-popup-company">Amazon</div>
                  <div className="ext-popup-issues">
                    <div className="ext-issue-row ext-conflict">
                      <span className="ext-issue-dot" />
                      <span>Worker Treatment</span>
                      <span className="ext-issue-tag conflict">Conflict</span>
                    </div>
                    <div className="ext-issue-row ext-mixed">
                      <span className="ext-issue-dot" />
                      <span>Environmental Sustainability</span>
                      <span className="ext-issue-tag mixed">Mixed</span>
                    </div>
                    <div className="ext-issue-row ext-aligned">
                      <span className="ext-issue-dot" />
                      <span>Data & Privacy</span>
                      <span className="ext-issue-tag aligned">Aligned</span>
                    </div>
                  </div>
                  <div className="ext-popup-footer">
                    <span className="ext-alt-label">Alternatives</span>
                    <span className="ext-alt-tag">Thrive Market</span>
                    <span className="ext-alt-tag">Etsy</span>
                  </div>
                </div>
                <div className="ext-browser-bar">
                  <div className="ext-browser-dot" />
                  <div className="ext-browser-dot" />
                  <div className="ext-browser-dot" />
                  <div className="ext-browser-url">amazon.com</div>
                  <div className="ext-browser-icon">◈</div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Follow */}
          <div className="loop-card">
            <div className="loop-card-body">
              <div className="loop-card-label">
                <span className="loop-card-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </span>
                Email Updates
              </div>
              <h3 className="loop-card-title">Follow companies for email updates</h3>
              <p className="loop-card-desc">Follow any company profile and we'll email you when they make a major move on the issues you track.</p>
            </div>
            <div className="loop-card-visual follow-visual">
              <div className="email-client">
                <div className="email-client-bar">
                  <div className="email-client-dots">
                    <span className="ecd" /><span className="ecd" /><span className="ecd" />
                  </div>
                  <div className="email-client-title">Inbox</div>
                </div>
                <div className="email-inbox-row unread">
                  <div className="email-avatar">T</div>
                  <div className="email-row-body">
                    <div className="email-row-top">
                      <span className="email-sender">Transparent</span>
                      <span className="email-time">9:14 AM</span>
                    </div>
                    <div className="email-subject">Meta: new lobbying disclosure filed</div>
                    <div className="email-preview-text">Meta spent $7.2M lobbying on AI regulation this quarter — here's what it means for your tracked issues.</div>
                  </div>
                </div>
                <div className="email-open">
                  <div className="email-open-header">
                    <div className="email-open-subject">Meta: new lobbying disclosure filed</div>
                    <div className="email-open-meta">
                      <span className="email-open-from">◈ Transparent</span>
                      <span className="email-open-to">to me</span>
                    </div>
                  </div>
                  <div className="email-open-body">
                    <p>Meta filed a new lobbying disclosure this quarter, spending <strong>$7.2M</strong> on AI regulation, data privacy, and content moderation bills.</p>
                    <div className="email-open-issues">
                      <div className="email-issue-chip conflict">⚑ Free Speech — New risk</div>
                      <div className="email-issue-chip mixed">◐ Data & Privacy — Watch</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="pick-footer">
          <button className="pick-cta loop-cta" onClick={finish}>Take me to the profiles →</button>
          <button className="pick-skip" onClick={skip}>Skip</button>
        </div>
      </div>
    </Screen>
  );

  return null;
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [selectedIssues, setSelectedIssues] = useState(null); // null = not onboarded yet
  const [spectra, setSpectra] = useState({});
  const [companyId, setCompanyId] = useState("meta");
  const [tab, setTab] = useState("overview");
  const [deepTab, setDeepTab] = useState("labor");
  const [followed, setFollowed] = useState(new Set());
  const toggleFollow = id => setFollowed(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const companiesList = Object.values(COMPANIES);
  const searchResults = searchQuery.trim().length > 0
    ? companiesList.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.sector.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : companiesList;

  const company = COMPANIES[companyId];

  const handleCompanyChange = (id) => {
    setCompanyId(id);
    setTab(selectedIssues && selectedIssues.length > 0 ? "overview" : "business");
  };

  if (selectedIssues === null) {
    return (
      <>
        <style>{CSS}</style>
        <Onboarding onComplete={(prefs) => {
          const issues = prefs.selected || prefs || [];
          setSelectedIssues(Array.isArray(prefs) ? prefs : (prefs.selected || []));
          setSpectra(prefs.spectra || {});
          setTab(issues.length > 0 ? "overview" : "business");
        }} />
      </>
    );
  }

  const hasIssues = selectedIssues.length > 0;

  // Compute dominant alignment per tab (conflict > mixed > aligned > null)
  const tabRelevance = {};
  TABS.forEach(t => {
    if (t.id === "overview") return;
    const relevant = (TAB_ISSUE_MAP[t.id] || []).filter(id => selectedIssues.includes(id));
    if (!relevant.length) { tabRelevance[t.id] = null; return; }
    const alignments = relevant.map(id => getAlignment(id, companyId, spectra?.[id] ?? null)).filter(Boolean);
    if (alignments.includes("conflict"))     tabRelevance[t.id] = "conflict";
    else if (alignments.includes("mixed"))   tabRelevance[t.id] = "mixed";
    else if (alignments.includes("aligned")) tabRelevance[t.id] = "aligned";
    else                                     tabRelevance[t.id] = "flagged"; // selected but no position set
  });

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        {/* HEADER */}
        <header className="app-header">
          <div className="header-inner">
            <div className="header-brand">
              <span className="brand-mark">◈</span>
              <span className="brand-name">Transparent</span>
            </div>
            <div className="header-right">
              <div className="co-search-wrap">
                <div className="co-search-bar">
                  <span className="co-search-icon">
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                      <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </span>
                  <input
                    className="co-search-input"
                    type="text"
                    placeholder="Search companies…"
                    value={searchQuery}
                    onChange={e => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                    onFocus={() => setSearchOpen(true)}
                    onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
                  />
                  {searchQuery && (
                    <button className="co-search-clear" onClick={() => setSearchQuery("")}>✕</button>
                  )}
                </div>
                {searchOpen && (
                  <div className="co-search-results">
                    {searchResults.length > 0 ? searchResults.map(c => (
                      <button key={c.id} className={`co-result${companyId === c.id ? " active" : ""}`}
                        onMouseDown={() => { handleCompanyChange(c.id); setSearchQuery(""); setSearchOpen(false); }}>
                        <span className="co-result-ticker">{c.ticker}</span>
                        <span className="co-result-name">{c.name}</span>
                        <span className="co-result-sector">{c.sector.split(" / ")[0]}</span>
                      </button>
                    )) : (
                      <div className="co-result-empty">No companies found</div>
                    )}
                  </div>
                )}
              </div>
              {hasIssues && (
                <button className="header-edit" onClick={() => setSelectedIssues(null)}>Edit issues →</button>
              )}
            </div>
          </div>
        </header>

        <main className="app-main">

          {/* MASTHEAD */}
          <div className="masthead">
            <div className="masthead-grid">
              <div className="mast-left">
                <span className="mast-eyebrow">{company.sector}</span>
                <h1 className="mast-name">{company.name}</h1>
                <div className="mast-bottom">
                  <span>{company.exchange}: {company.ticker}</span>
                  <span className="mast-meta-sep">·</span>
                  <span>{company.hq}</span>
                  <span className="mast-meta-sep">·</span>
                  <span>Founded {company.founded}</span>
                  <span className="mast-meta-sep">·</span>
                  <button
                    className={`follow-btn${followed.has(companyId) ? " following" : ""}`}
                    onClick={() => toggleFollow(companyId)}>
                    {followed.has(companyId) ? "✓ Following" : "+ Follow"}
                  </button>
                </div>
              </div>
              <div className="mast-vitals">
                {company.vitals.map(v => (
                  <div key={v.label} className="mast-vital">
                    <div className="mv-value">{v.value}</div>
                    <div className="mv-label">{v.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* TABS */}
          <div className="tab-bar">
            <div className="tab-bar-inner">
              {TABS.filter(t => t.id !== "overview" || hasIssues).map(t => (
                <button
                  key={t.id}
                  className={`tab-btn${tab === t.id ? " active" : ""}`}
                  onClick={() => setTab(t.id)}
                >
                  {hasIssues && tabRelevance[t.id] && <span className="tab-dot" />}
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* TAB BODY */}
          <div className="tab-body" key={`${companyId}-${tab}`}>
            {tab === "overview"     && <OverviewTab company={company} selectedIssues={selectedIssues} spectra={spectra} onTabChange={setTab} />}
            {tab === "business"     && <BusinessTab company={company} selectedIssues={selectedIssues} spectra={spectra} />}
            {tab === "labor"        && <LaborTab company={company} selectedIssues={selectedIssues} spectra={spectra} />}
            {tab === "environment"  && <EnvironmentTab company={company} selectedIssues={selectedIssues} spectra={spectra} />}
            {tab === "governance"   && <GovernanceTab company={company} selectedIssues={selectedIssues} spectra={spectra} />}
            {tab === "legal"        && <LegalTab company={company} selectedIssues={selectedIssues} spectra={spectra} />}
            {tab === "political"    && <PoliticalTab company={company} selectedIssues={selectedIssues} spectra={spectra} />}
            {tab === "privacy"      && <PrivacyTab company={company} selectedIssues={selectedIssues} spectra={spectra} />}
            {tab === "trajectory"   && <TrajectoryTab company={company} selectedIssues={selectedIssues} spectra={spectra} />}
          </div>
        </main>

        <footer className="app-footer">
          <div className="footer-inner">
            <p>All data sourced from public records: SEC filings, regulatory agency records, court documents, and lobbying disclosures. Commentary is limited to explaining what data means.</p>
            <p className="footer-date">2024 reporting cycle</p>
          </div>
        </footer>
      </div>
    </>
  );
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #F7F6F3;
  --bg-2: #EEECEA;
  --bg-3: #E2DFD8;
  --ink: #1A1A1A;
  --ink-2: #3C3C3C;
  --ink-3: #6B6B6B;
  --ink-4: #AEAEB2;
  --blue: #2563eb;
  --blue-light: #EFF4FF;
  --blue-mid: #DBEAFE;
  --accent: #1d4ed8;
  --rule: #D5D2CB;
  --white: #FFFFFF;
  --ff-sans: 'Sora', system-ui, sans-serif;
  --ff-serif: 'Libre Baskerville', Georgia, serif;
  --ff-mono: 'JetBrains Mono', monospace;
  --r: 8px;
}

html, body {
  background: var(--bg);
  font-family: var(--ff-sans);
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
  font-size: 15px;
  line-height: 1.6;
}

/* ─── ONBOARDING: SCREEN WRAPPER ─── */
.screen { min-height: 100vh; }
@keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
@keyframes float { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(-5px)} }
@keyframes cardIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

/* ─── WELCOME ─── */
.welcome-screen {
  background: var(--ink);
  display: flex; align-items: center; justify-content: center;
  padding: 60px 32px; position: relative; overflow: hidden;
}
.welcome-grain {
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
  opacity: .5; pointer-events: none;
}
.welcome-content {
  position: relative; z-index: 1;
  max-width: 680px; width: 100%;
  border-top: 2px solid rgba(247,246,243,.12);
  padding-top: 40px;
}
.welcome-eyebrow {
  font-family: var(--ff-mono); font-size: 10px; letter-spacing: .22em; text-transform: uppercase;
  color: rgba(247,246,243,.35); margin-bottom: 32px; animation: fadeUp .6s .1s ease both;
}
.welcome-hed {
  font-family: var(--ff-serif); font-size: clamp(44px,6.5vw,76px); font-weight: 700;
  color: var(--bg); line-height: 1.05; letter-spacing: -1px; margin-bottom: 0;
  animation: fadeUp .7s .15s ease both;
}
.welcome-hed-sub-line {
  margin-bottom: 32px;
}
.welcome-hed-sub {
  display: block; font-size: .58em; font-weight: 400; font-style: italic;
  color: rgba(247,246,243,.45); letter-spacing: -.2px; margin-top: 4px;
}
.hed-cycle-word {
  display: inline-block; color: var(--blue);
  transition: opacity .35s ease, transform .35s ease;
  opacity: 1; transform: translateY(0);
}
.hed-cycle-word.fading {
  opacity: 0; transform: translateY(-8px);
}
/* Responsive headline breaks */
.hed-br-mobile { display: none; }
.hed-br-desktop { display: inline; }
@media (max-width: 500px) {
  .hed-br-mobile { display: inline; }
  .hed-br-desktop { display: none; }
}
.welcome-rule {
  height: 1px; background: rgba(247,246,243,.1); margin-bottom: 24px;
  animation: fadeUp .7s .18s ease both;
}
.welcome-dek {
  font-size: 15px; color: rgba(247,246,243,.6); line-height: 1.75; font-weight: 300;
  max-width: 480px; margin-bottom: 36px; animation: fadeUp .7s .2s ease both;
}
.welcome-sources {
  display: flex; flex-wrap: wrap; gap: 6px 20px; margin-bottom: 40px;
  animation: fadeUp .7s .25s ease both;
}
.welcome-source-item {
  display: flex; align-items: center; gap: 6px;
  font-family: var(--ff-mono); font-size: 10px; letter-spacing: .08em;
  color: rgba(247,246,243,.3);
}
.welcome-source-dot { font-size: 5px; color: var(--blue); opacity: .7; }
.btn-cta {
  display: inline-flex; align-items: center; gap: 10px;
  font-family: var(--ff-sans); font-size: 15px; font-weight: 600;
  background: var(--blue); color: white; border: none; padding: 14px 28px; border-radius: 40px;
  cursor: pointer; letter-spacing: .01em; box-shadow: 0 4px 24px rgba(37,99,235,.4); transition: all .22s ease;
}
.btn-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(37,99,235,.5); background: var(--accent); }
.cta-arrow { font-size: 18px; transition: transform .2s; }
.btn-cta:hover .cta-arrow { transform: translateX(4px); }
.btn-ghost-inv {
  font-family: var(--ff-sans); font-size: 14px; color: rgba(247,246,243,.35);
  background: none; border: none; cursor: pointer;
  text-decoration: underline; text-underline-offset: 3px; padding: 4px 0; transition: color .15s;
}
.btn-ghost-inv:hover { color: rgba(247,246,243,.6); }

/* ─── PICK SCREEN ─── */
.pick-screen {
  background: var(--bg); min-height: 100vh;
  padding: 0 24px 100px;
  display: flex; flex-direction: column; align-items: center;
}
.pick-screen > * { width: 100%; max-width: 800px; }

.pick-nav {
  padding: 20px 0 0; width: 100%; max-width: 800px;
}
.pick-header {
  padding: 20px 0 24px;
  border-bottom: 1px solid var(--rule);
  margin-bottom: 28px;
}
.pick-back {
  font-family: var(--ff-mono); font-size: 11px; letter-spacing: .06em;
  color: var(--ink-3); background: none; border: none; cursor: pointer;
  padding: 0; display: block; transition: color .12s;
}
.pick-back:hover { color: var(--ink); }
.pick-hed {
  font-family: var(--ff-serif); font-size: clamp(28px, 4vw, 40px); font-weight: 700;
  line-height: 1.1; margin-bottom: 10px; letter-spacing: -.5px;
}
.pick-sub {
  font-family: var(--ff-mono); font-size: 11px; color: var(--ink-4);
  letter-spacing: .03em; line-height: 1.7; margin-bottom: 6px;
}
.pick-sub-note {
  font-size: 13px; color: var(--ink-3); line-height: 1.5;
}

/* ─── PICK GRID ─── */
.pick-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 32px;
}
.pick-card {
  background: var(--white); border: 1.5px solid var(--rule); border-radius: 10px;
  padding: 14px 13px 13px; text-align: left; cursor: pointer;
  display: flex; flex-direction: column; gap: 7px;
  animation: cardIn .35s ease both;
  transition: border-color .15s, box-shadow .18s, transform .15s;
}
.pick-card:hover { border-color: var(--ink-3); transform: translateY(-1px); box-shadow: 0 4px 14px rgba(0,0,0,.07); }
.pick-card.sel { border-color: var(--ink); background: var(--ink); box-shadow: 0 4px 14px rgba(0,0,0,.14); }
.pick-card-top { display: flex; justify-content: space-between; align-items: flex-start; }
.pick-card-icon { font-size: 20px; line-height: 1; }
.pick-card-check {
  width: 16px; height: 16px; border-radius: 50%;
  background: var(--bg-2); border: 1.5px solid var(--rule);
  display: flex; align-items: center; justify-content: center;
  color: transparent; flex-shrink: 0;
  opacity: 0; transform: scale(.4);
  transition: opacity .15s, transform .22s cubic-bezier(.34,1.56,.64,1);
}
.pick-card-check.show { opacity: 1; transform: scale(1); background: var(--blue); border-color: var(--blue); color: white; }
.pick-card-label { font-size: 12.5px; font-weight: 600; color: var(--ink); line-height: 1.3; transition: color .15s; }
.pick-card.sel .pick-card-label { color: var(--bg); }
.pick-card-summary { font-size: 10.5px; color: var(--ink-3); line-height: 1.5; transition: color .15s; }
.pick-card.sel .pick-card-summary { color: rgba(247,246,243,.42); }

/* ─── PICK FOOTER ─── */
.pick-footer {
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  padding-top: 4px;
}
.pick-cta {
  font-family: var(--ff-sans); font-size: 14px; font-weight: 600;
  background: var(--ink); color: var(--bg);
  border: none; padding: 13px 32px; border-radius: 40px; cursor: pointer;
  transition: all .2s; letter-spacing: .01em; white-space: nowrap;
}
.pick-cta:hover:not(:disabled) { background: var(--ink-2); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,0,0,.18); }
.pick-cta:disabled { opacity: .28; cursor: not-allowed; }
.loop-cta { background: var(--bg); color: var(--ink); box-shadow: none; }
.loop-cta:hover { background: var(--bg-2); box-shadow: none; }
.pick-skip {
  font-family: var(--ff-sans); font-size: 12.5px; color: var(--ink-4);
  background: none; border: none; cursor: pointer;
  text-decoration: underline; text-underline-offset: 3px; padding: 2px 0;
  transition: color .12s;
}
.pick-skip:hover { color: var(--ink-3); }



/* ─── LOOP SCREEN ─── */
.loop-screen {
  min-height: 100vh; background: var(--ink);
  display: flex; align-items: flex-start; justify-content: center;
  padding: 0 24px 80px;
}
.loop-inner {
  width: 100%; max-width: 860px;
  display: flex; flex-direction: column; gap: 28px;
}
.loop-nav { padding: 20px 0 0; }
.loop-back { color: rgba(247,246,243,.35) !important; }
.loop-back:hover { color: rgba(247,246,243,.7) !important; }
.loop-header { display: flex; flex-direction: column; gap: 6px; }
.loop-hed {
  font-family: var(--ff-serif); font-size: clamp(28px, 4vw, 40px); font-weight: 700;
  color: var(--bg); letter-spacing: -.5px; line-height: 1.1;
}
.loop-subhed {
  font-family: var(--ff-mono); font-size: 11px; color: rgba(247,246,243,.35);
  letter-spacing: .04em;
}

.loop-cards { display: flex; flex-direction: column; gap: 12px; }

.loop-card {
  background: rgba(247,246,243,.05); border: 1px solid rgba(247,246,243,.1); border-radius: 12px;
  overflow: hidden; display: grid; grid-template-columns: 1fr 1fr; min-height: 240px;
}
.loop-card-body {
  padding: 28px 28px; display: flex; flex-direction: column; gap: 12px;
  border-right: 1px solid rgba(247,246,243,.08);
}
.loop-card-label {
  display: flex; align-items: center; gap: 8px;
  font-family: var(--ff-mono); font-size: 10px; letter-spacing: .14em;
  color: rgba(247,246,243,.3); text-transform: uppercase;
}
.loop-card-icon { color: rgba(247,246,243,.3); display: flex; align-items: center; }
.loop-card-title {
  font-family: var(--ff-serif); font-size: 19px; font-weight: 700;
  color: var(--bg); line-height: 1.2; letter-spacing: -.3px;
}
.loop-card-desc {
  font-size: 13px; color: rgba(247,246,243,.45); line-height: 1.7; flex: 1;
}

/* Extension badge */
.loop-ext-badge {
  display: inline-flex; align-items: center; gap: 8px; margin-top: 4px;
  background: rgba(247,246,243,.1); color: var(--bg); border-radius: 8px;
  padding: 10px 14px; width: fit-content; border: 1px solid rgba(247,246,243,.15);
}
.loop-ext-icon { font-size: 14px; color: var(--blue); }
.loop-ext-name { font-family: var(--ff-sans); font-size: 12px; font-weight: 600; }
.loop-ext-cta { font-family: var(--ff-mono); font-size: 10px; color: rgba(247,246,243,.45); letter-spacing: .06em; margin-left: 6px; }

/* Extension visual */
.loop-card-visual {
  background: rgba(247,246,243,.04); display: flex; align-items: center; justify-content: center; padding: 28px;
}
.ext-mockup { display: flex; flex-direction: column-reverse; gap: 0; width: 100%; max-width: 300px; }
.ext-browser-bar {
  background: #e8e6e0; border-radius: 8px 8px 0 0; padding: 8px 12px;
  display: flex; align-items: center; gap: 8px;
}
.ext-browser-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--rule); }
.ext-browser-url {
  flex: 1; background: white; border-radius: 4px; padding: 3px 10px;
  font-family: var(--ff-mono); font-size: 10px; color: var(--ink-3);
}
.ext-browser-icon { font-size: 14px; color: var(--blue); cursor: pointer; }
.ext-popup {
  background: white; border: 1px solid var(--rule);
  border-radius: 0 0 10px 10px; padding: 14px;
  box-shadow: 0 8px 28px rgba(0,0,0,.12);
}
.ext-popup-header {
  display: flex; align-items: center; gap: 7px; margin-bottom: 10px;
  padding-bottom: 8px; border-bottom: 1px solid var(--bg-2);
}
.ext-popup-mark { font-size: 12px; color: var(--blue); }
.ext-popup-brand { font-family: var(--ff-serif); font-size: 12px; font-weight: 700; color: var(--ink); }
.ext-popup-domain { font-family: var(--ff-mono); font-size: 9px; color: var(--ink-4); margin-left: auto; }
.ext-popup-company { font-family: var(--ff-serif); font-size: 17px; font-weight: 700; color: var(--ink); margin-bottom: 10px; }
.ext-issue-row {
  display: flex; align-items: center; gap: 7px; font-size: 11px; color: var(--ink-2);
  padding: 5px 0; border-bottom: 1px solid var(--bg-2);
}
.ext-issue-row:last-child { border-bottom: none; }
.ext-issue-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.ext-conflict .ext-issue-dot { background: #dc2626; }
.ext-mixed .ext-issue-dot { background: #ca8a04; }
.ext-aligned .ext-issue-dot { background: #16a34a; }
.ext-issue-tag {
  margin-left: auto; font-family: var(--ff-mono); font-size: 9px; letter-spacing: .04em;
  padding: 2px 7px; border-radius: 4px; font-weight: 500;
}
.ext-issue-tag.conflict { background: #fef2f2; color: #dc2626; }
.ext-issue-tag.mixed { background: #fefce8; color: #a16207; }
.ext-issue-tag.aligned { background: #f0fdf4; color: #16a34a; }
.ext-popup-footer {
  margin-top: 10px; padding-top: 8px; border-top: 1px solid var(--bg-2);
  display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
}
.ext-alt-label { font-family: var(--ff-mono); font-size: 9px; letter-spacing: .06em; color: var(--ink-4); text-transform: uppercase; margin-right: 2px; }
.ext-alt-tag { font-size: 10px; background: var(--bg-2); color: var(--ink-2); border-radius: 4px; padding: 2px 8px; font-weight: 500; }

/* Email client mockup */
.email-client {
  width: 100%; max-width: 300px; border-radius: 10px; overflow: hidden;
  border: 1px solid var(--rule); box-shadow: 0 8px 28px rgba(0,0,0,.12); background: white;
}
.email-client-bar {
  background: #f1efea; padding: 8px 12px;
  display: flex; align-items: center; gap: 8px; border-bottom: 1px solid var(--rule);
}
.email-client-dots { display: flex; gap: 5px; }
.ecd { width: 8px; height: 8px; border-radius: 50%; background: var(--rule); }
.email-client-title { font-family: var(--ff-sans); font-size: 11px; font-weight: 600; color: var(--ink-3); margin: 0 auto; padding-right: 26px; }
.email-inbox-row {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 10px 12px; border-bottom: 1px solid var(--bg-2);
  background: #fafaf8;
}
.email-inbox-row.unread { background: white; }
.email-avatar {
  width: 28px; height: 28px; border-radius: 50%; background: var(--blue);
  color: white; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; font-family: var(--ff-sans);
}
.email-row-body { flex: 1; min-width: 0; }
.email-row-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px; }
.email-sender { font-size: 11px; font-weight: 700; color: var(--ink); }
.email-time { font-family: var(--ff-mono); font-size: 9px; color: var(--ink-4); }
.email-subject { font-size: 11px; font-weight: 600; color: var(--ink); margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.email-preview-text { font-size: 10.5px; color: var(--ink-4); line-height: 1.4; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.email-open { padding: 12px 14px; }
.email-open-header { margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid var(--bg-2); }
.email-open-subject { font-size: 12px; font-weight: 700; color: var(--ink); margin-bottom: 4px; }
.email-open-meta { display: flex; align-items: center; gap: 8px; }
.email-open-from { font-family: var(--ff-mono); font-size: 9.5px; font-weight: 600; color: var(--blue); letter-spacing: .04em; }
.email-open-to { font-family: var(--ff-mono); font-size: 9px; color: var(--ink-4); }
.email-open-body p { font-size: 11.5px; color: var(--ink-2); line-height: 1.65; margin-bottom: 10px; }
.email-open-body strong { color: var(--ink); }
.email-open-issues { display: flex; flex-direction: column; gap: 5px; }
.email-issue-chip {
  font-family: var(--ff-mono); font-size: 9.5px; letter-spacing: .03em;
  padding: 4px 9px; border-radius: 5px; width: fit-content; font-weight: 500;
}
.email-issue-chip.conflict { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
.email-issue-chip.mixed { background: #fefce8; color: #a16207; border: 1px solid #fef08a; }

/* ─── APP SHELL ─── */
.app { min-height: 100vh; display: flex; flex-direction: column; }

.app-header {
  background: var(--ink); padding: 0 24px;
  height: 52px;
  position: sticky; top: 0; z-index: 100;
  display: flex; align-items: center;
}
.header-inner {
  max-width: 980px; margin: 0 auto; width: 100%;
  display: flex; justify-content: space-between; align-items: center; gap: 16px;
}
.header-brand { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.brand-mark { font-size: 15px; color: var(--blue); }
.brand-name { font-family: var(--ff-serif); font-size: 15px; color: rgba(247,246,243,.95); font-weight: 700; letter-spacing: -.2px; }
.header-right { display: flex; align-items: center; gap: 16px; }
.header-edit {
  font-family: var(--ff-mono); font-size: 10px; letter-spacing: .08em;
  color: rgba(247,246,243,.35); background: none; border: none;
  cursor: pointer; transition: color .15s; padding: 0; white-space: nowrap; flex-shrink: 0;
}
.header-edit:hover { color: rgba(247,246,243,.7); }

.app-main { flex: 1; max-width: 980px; margin: 0 auto; width: 100%; padding: 0 24px 80px; }

/* ─── COMPANY SEARCH (in header) ─── */
.co-search-wrap { position: relative; width: 220px; }
.co-search-bar {
  display: flex; align-items: center; gap: 8px;
  background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.15); border-radius: 8px;
  padding: 0 12px; height: 34px;
  transition: background .15s, border-color .15s;
}
.co-search-bar:focus-within {
  background: rgba(255,255,255,.18); border-color: rgba(255,255,255,.35);
}
.co-search-icon { color: rgba(247,246,243,.4); flex-shrink: 0; display: flex; align-items: center; }
.co-search-input {
  flex: 1; border: none; background: none; outline: none;
  font-family: var(--ff-sans); font-size: 13px; color: rgba(247,246,243,.9);
}
.co-search-input::placeholder { color: rgba(247,246,243,.3); }
.co-search-clear {
  background: none; border: none; cursor: pointer; color: rgba(247,246,243,.35);
  font-size: 11px; padding: 2px; transition: color .12s; line-height: 1;
}
.co-search-clear:hover { color: rgba(247,246,243,.7); }
.co-search-results {
  position: absolute; top: calc(100% + 6px); left: 0; right: 0; z-index: 300;
  background: var(--white); border: 1.5px solid var(--ink);
  border-radius: 10px; overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,.18);
  min-width: 260px;
}
.co-result {
  width: 100%; display: flex; align-items: center; gap: 10px;
  padding: 10px 14px; background: none; border: none; cursor: pointer;
  text-align: left; transition: background .1s; border-bottom: 1px solid var(--rule);
}
.co-result:last-child { border-bottom: none; }
.co-result:hover, .co-result.active { background: var(--bg-2); }
.co-result-ticker { font-family: var(--ff-mono); font-size: 10px; letter-spacing: .1em; color: var(--blue); width: 36px; flex-shrink: 0; }
.co-result-name { font-size: 13px; font-weight: 600; color: var(--ink); flex: 1; }
.co-result-sector { font-size: 11px; color: var(--ink-4); }
.co-result-empty { padding: 14px; font-size: 13px; color: var(--ink-4); text-align: center; }

/* ─── MASTHEAD ─── */
.masthead { padding: 36px 0 24px; border-bottom: 1px solid var(--rule); }
.masthead-grid { display: grid; grid-template-columns: 1fr auto; gap: 40px; align-items: start; }
.mast-left { display: flex; flex-direction: column; }
.mast-eyebrow { display: block; font-family: var(--ff-mono); font-size: 10px; letter-spacing: .18em; text-transform: uppercase; color: var(--ink-4); margin-bottom: 12px; }
.mast-name { font-family: var(--ff-serif); font-size: clamp(38px, 5.5vw, 62px); font-weight: 700; letter-spacing: -1.5px; line-height: 1; color: var(--ink); margin-bottom: 14px; }
.mast-bottom { display: flex; flex-wrap: wrap; align-items: center; gap: 0; font-family: var(--ff-mono); font-size: 11px; color: var(--ink-3); letter-spacing: .03em; }
.mast-meta-sep { margin: 0 10px; color: var(--ink-4); }
.mast-vitals { display: flex; flex-direction: column; gap: 18px; padding-top: 4px; }
.mast-vital { }
.mv-value { font-family: var(--ff-serif); font-size: 22px; font-weight: 700; line-height: 1; color: var(--ink); }
.mv-label { font-family: var(--ff-mono); font-size: 9.5px; letter-spacing: .08em; color: var(--ink-4); text-transform: uppercase; margin-top: 3px; }
.follow-btn {
  display: inline-flex; align-items: center; gap: 4px;
  font-family: var(--ff-mono); font-size: 10px; letter-spacing: .1em; text-transform: uppercase;
  padding: 3px 11px; border-radius: 20px; cursor: pointer;
  border: 1px solid var(--rule); background: transparent; color: var(--ink-3);
  transition: all .15s ease; flex-shrink: 0;
}
.follow-btn:hover { border-color: var(--ink-2); color: var(--ink); }
.follow-btn.following { border-color: var(--ink); background: var(--ink); color: var(--bg); }
.follow-btn.following:hover { background: transparent; border-color: var(--ink-3); color: var(--ink-3); }

/* ─── TABS ─── */
.tab-bar {
  position: sticky; top: 52px; z-index: 90;
  background: var(--bg); border-bottom: 1px solid var(--rule);
}
.tab-bar-inner {
  display: flex; align-items: center; overflow-x: auto; scrollbar-width: none;
  max-width: 980px; margin: 0 auto; padding: 0 24px;
}
.tab-bar-inner::-webkit-scrollbar { display: none; }
.tab-btn {
  padding: 13px 16px; font-size: 12.5px; font-weight: 500; font-family: var(--ff-sans);
  background: none; border: none; cursor: pointer; color: var(--ink-3);
  border-bottom: 2px solid transparent; margin-bottom: -1px;
  white-space: nowrap; transition: color .12s; letter-spacing: .01em;
  display: flex; align-items: center; gap: 6px;
}
.tab-btn:first-child { padding-left: 0; }
.tab-btn:hover { color: var(--ink); }
.tab-btn.active { color: var(--blue); border-bottom-color: var(--blue); font-weight: 600; }

.tab-dot {
  width: 6px; height: 6px; border-radius: 50%; background: var(--blue); flex-shrink: 0;
  animation: pulse-dot 2.5s ease-in-out infinite;
}
@keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:.35} }

/* ─── TAB BODY ─── */
.tab-body { padding-top: 32px; animation: tabIn .3s ease both; }
@keyframes tabIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }

.tab-content {
  display: flex; flex-direction: column; gap: 44px;
  position: relative;
}

/* ─── PERSISTENT RAIL (left stripe on flagged tabs) ─── */
.tab-content.has-flagged {
  padding-left: 20px;
  border-left: 2px solid var(--blue);
  margin-left: 4px;
}

/* ─── NEW COLLAPSIBLE ISSUE CALLOUT ─── */
.issue-callout-block {
  background: var(--bg-2);
  border: 1px solid var(--rule);
  border-left: 3px solid var(--blue);
  border-radius: 0 var(--r) var(--r) 0;
  overflow: hidden;
}
.issue-callout-block.icb-aligned  { border-color: var(--align-green-border); }
.issue-callout-block.icb-mixed    { background: var(--align-yellow-bg); border-color: var(--align-yellow-border); }
.issue-callout-block.icb-conflict { background: var(--align-red-bg);    border-color: var(--align-red-border); }
.icb-header {
  width: 100%; display: flex; align-items: center; justify-content: space-between;
  padding: 13px 16px; gap: 12px; background: none; border: none; cursor: pointer;
  text-align: left;
}
.icb-header-left { display: flex; flex-direction: column; gap: 7px; }
.icb-eyebrow {
  font-family: var(--ff-mono); font-size: 9px; letter-spacing: .16em; text-transform: uppercase;
  color: var(--ink-3);
}
.icb-conflict .icb-eyebrow { color: var(--align-red); }
.icb-mixed    .icb-eyebrow { color: var(--align-yellow); }
.icb-aligned  .icb-eyebrow { color: var(--align-green); }
.icb-issue-names { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 3px; }
.icb-issue-name {
  font-family: var(--ff-sans); font-size: 12px; color: var(--ink-3); white-space: nowrap;
}
.icb-conflict .icb-issue-name { color: var(--align-red); opacity: .8; }
.icb-mixed    .icb-issue-name { color: var(--align-yellow); opacity: .8; }
.icb-aligned  .icb-issue-name { color: var(--align-green); opacity: .8; }
.icb-chevron { color: var(--ink-3); flex-shrink: 0; transition: transform .2s ease; }
.icb-chevron.up { transform: rotate(180deg); }
.icb-body { padding: 0 16px 16px; display: flex; flex-direction: column; gap: 16px; }
.icb-item { padding-top: 14px; border-top: 1px solid var(--rule); }
.icb-item.icb-item-aligned  { border-top-color: var(--align-green-border); }
.icb-item.icb-item-mixed    { border-top-color: var(--align-yellow-border); }
.icb-item.icb-item-conflict { border-top-color: var(--align-red-border); }
.icb-item-issue-name {
  font-family: var(--ff-mono); font-size: 9px; letter-spacing: .12em; text-transform: uppercase;
  color: var(--ink-4); margin-bottom: 6px;
}
.icb-item-headline { font-size: 13.5px; font-weight: 600; color: var(--ink); line-height: 1.4; margin-bottom: 8px; }
.icb-points { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 5px; }
.icb-points li {
  font-size: 12.5px; color: var(--ink-2); line-height: 1.65; padding-left: 14px; position: relative;
}
.icb-points li::before { content: "–"; position: absolute; left: 0; color: var(--ink-3); }

/* ─── ISSUE PILLS (inline flagging on data items) ─── */
.ip-aligned  { background: var(--align-green-bg);  color: var(--align-green);  border-color: var(--align-green-border) !important; }
.ip-mixed    { background: var(--align-yellow-bg); color: var(--align-yellow); border-color: var(--align-yellow-border) !important; }
.ip-conflict { background: var(--align-red-bg);    color: var(--align-red);    border-color: var(--align-red-border) !important; }
.ip-aligned .ip-label, .ip-mixed .ip-label, .ip-conflict .ip-label { color: inherit; }
.issue-pill-row { display: flex; gap: 5px; flex-wrap: wrap; margin-top: 5px; }
.issue-pill {
  display: inline-flex; align-items: center; gap: 4px;
  font-family: var(--ff-mono); font-size: 9px; letter-spacing: .06em;
  background: var(--bg-3); color: var(--ink-3);
  border: 1px solid var(--rule); border-radius: 20px;
  padding: 2px 8px; white-space: nowrap;
}
.ip-icon { font-size: 10px; line-height: 1; }
.ip-label { font-size: 9px; }

/* ─── FLAGGED STATE (items that match your issues) ─── */
/* Alignment color tokens */
:root {
  --align-green: #166534;
  --align-green-bg: #f0fdf4;
  --align-green-border: #bbf7d0;
  --align-yellow: #854d0e;
  --align-yellow-bg: #fefce8;
  --align-yellow-border: #fef08a;
  --align-red: #991b1b;
  --align-red-bg: #fef2f2;
  --align-red-border: #fecaca;
}

/* Generic flag variants — applied to any flaggable row/card */
.flag-aligned  { border-left: 3px solid var(--align-green)  !important; }
.flag-mixed    { border-left: 3px solid var(--align-yellow) !important; background: var(--align-yellow-bg) !important; }
.flag-conflict { border-left: 3px solid var(--align-red)    !important; background: var(--align-red-bg)    !important; }

.data-row.flag-aligned, .data-row.flag-mixed, .data-row.flag-conflict {
  border-radius: 4px; padding: 8px 10px; margin: 0 -10px;
}
.target-row.flag-aligned, .target-row.flag-mixed, .target-row.flag-conflict {
  border-radius: 4px; padding: 8px 10px; margin: 0 -10px;
}
.lobby-row.flag-aligned, .lobby-row.flag-mixed, .lobby-row.flag-conflict {
  border-radius: 4px; padding: 12px 10px; margin: 0 -10px;
}
.privacy-row.flag-aligned, .privacy-row.flag-mixed, .privacy-row.flag-conflict {
  border-radius: 4px; padding: 9px 10px; margin: 0 -10px;
}

/* ─── OVERVIEW TAB ─── */
.ov-empty {
  padding: 72px 0; text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: 14px;
}
.ov-empty-icon { font-size: 32px; color: var(--ink-4); }
.ov-empty h3 { font-family: var(--ff-serif); font-size: 26px; font-weight: 400; }
.ov-empty p { font-size: 14px; color: var(--ink-3); max-width: 340px; line-height: 1.6; }

.ov-content { display: flex; flex-direction: column; gap: 4px; }
.ov-intro { font-size: 14px; color: var(--ink-3); margin-bottom: 16px; font-style: italic; line-height: 1.65; }

.ov-issue-card {
  background: var(--white); border: 1px solid var(--rule); border-radius: var(--r);
  padding: 18px 20px; margin-bottom: 10px;
  animation: fadeUp .35s ease both;
}
.ov-ic-header {
  display: flex; justify-content: space-between; align-items: flex-start;
  margin-bottom: 10px; gap: 12px;
}
.ov-ic-title { display: flex; align-items: center; gap: 10px; }
.ov-ic-icon { font-size: 20px; line-height: 1; }
.ov-ic-label { font-size: 14px; font-weight: 600; color: var(--ink); }
.ov-ic-link {
  font-family: var(--ff-mono); font-size: 11px; letter-spacing: .04em;
  color: var(--ink-3); background: none; border: 1px solid var(--rule);
  padding: 4px 12px; border-radius: 20px; cursor: pointer; white-space: nowrap;
  transition: all .15s; flex-shrink: 0;
}
.ov-ic-link:hover { background: var(--bg-3); border-color: var(--ink-3); color: var(--ink); }
.ov-ic-headline { font-size: 14px; color: var(--ink-2); line-height: 1.55; margin-bottom: 10px; }
.ov-ic-points {
  list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 5px;
}
.ov-ic-points li {
  font-size: 13px; color: var(--ink-3); line-height: 1.6; padding-left: 14px; position: relative;
}
.ov-ic-points li::before { content: "–"; position: absolute; left: 0; color: var(--ink-4); }
.ov-ic-also {
  margin-top: 12px; padding-top: 10px; border-top: 1px solid var(--bg-2);
  font-family: var(--ff-mono); font-size: 10px; color: var(--ink-4); letter-spacing: .04em;
  display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
}
.ov-ic-also-btn {
  font-family: var(--ff-mono); font-size: 10px; letter-spacing: .04em;
  color: var(--ink-3); background: var(--bg-2); border: none;
  padding: 3px 10px; border-radius: 4px; cursor: pointer; transition: all .15s;
}
.ov-ic-also-btn:hover { background: var(--bg-3); color: var(--ink); }

/* ─── SECTION ─── */
.section { display: flex; flex-direction: column; gap: 14px; }
.sec-head {
  display: flex; justify-content: space-between; align-items: baseline;
  padding-bottom: 12px; border-bottom: 2px solid var(--ink); flex-wrap: wrap; gap: 8px;
}
.sec-title { font-family: var(--ff-serif); font-size: 19px; font-weight: 700; color: var(--ink); letter-spacing: -.2px; }
.source-badge {
  font-family: var(--ff-mono); font-size: 10px; letter-spacing: .04em;
  color: var(--ink-4); background: var(--bg-2); border: 1px solid var(--rule);
  padding: 3px 9px; border-radius: 4px;
}

/* ─── SUMMARY BLOCK ─── */
.summary-block {
  background: var(--white); border: 1px solid var(--bg-3); border-radius: var(--r); padding: 20px 22px;
  box-shadow: 0 1px 3px rgba(0,0,0,.04);
}
.summary-text { font-size: 14.5px; color: var(--ink-2); line-height: 1.8; }

/* ─── BAR ─── */
.bar { display: grid; grid-template-columns: 168px 1fr 90px; align-items: center; gap: 10px; padding: 9px 0; border-bottom: 1px solid var(--rule); }
.bar.sm { grid-template-columns: 44px 1fr 72px; }
.bar-lbl { font-size: 13px; font-weight: 500; color: var(--ink-2); }
.bar-lbl.mono { font-family: var(--ff-mono); font-size: 11px; color: var(--ink-3); font-weight: 400; }
.bar-bg { background: var(--bg-3); height: 17px; border-radius: 3px; overflow: hidden; }
.bar.sm .bar-bg { height: 13px; }
.bar-fill { height: 100%; border-radius: 3px; transition: width .7s cubic-bezier(.4,0,.2,1); }
.bar-amt { font-family: var(--ff-mono); font-size: 11.5px; text-align: right; color: var(--ink-2); }
.bar-note { grid-column: 1 / -1; font-size: 11px; color: var(--ink-3); font-style: italic; margin-top: -4px; }

/* ─── STAT GRID ─── */
.stat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(155px, 1fr)); gap: 1px; background: var(--rule); border: 1px solid var(--rule); border-radius: var(--r); overflow: hidden; }
.stat-grid.single { grid-template-columns: auto; background: none; border: none; display: flex; }
.stat { background: var(--white); padding: 14px 16px; }
.stat-val { font-family: var(--ff-serif); font-size: 26px; font-weight: 700; line-height: 1; color: var(--ink); margin-bottom: 5px; }
.stat-label { font-family: var(--ff-mono); font-size: 10.5px; letter-spacing: .04em; color: var(--ink-3); line-height: 1.5; }
.stat-sub { font-size: 11px; color: var(--ink-4); margin-top: 2px; }

/* ─── DATA ROW ─── */
.data-row {
  display: flex; justify-content: space-between; align-items: flex-start;
  padding: 11px 0; border-bottom: 1px solid var(--rule); gap: 20px;
}
.data-row-left { flex: 1; }
.data-row-label { font-size: 13.5px; color: var(--ink); font-weight: 500; }
.data-row-right { text-align: right; flex-shrink: 0; }
.data-row-value { font-family: var(--ff-mono); font-size: 13px; color: var(--ink); }
.data-row-note { font-size: 11px; color: var(--ink-4); margin-top: 2px; max-width: 260px; text-align: right; }

/* ─── EXPLAINER ─── */
.explainer {
  border-left: 2px solid var(--bg-3); padding: 12px 16px;
  background: var(--white); border-radius: 0 var(--r) var(--r) 0;
}
.explainer-title { font-size: 13px; font-weight: 600; color: var(--ink); margin-bottom: 5px; }
.explainer-body { font-size: 13.5px; color: var(--ink-2); line-height: 1.7; }

/* ─── EVENT CARD ─── */
.event-card { background: var(--white); border: 1px solid var(--rule); border-radius: var(--r); padding: 14px 16px; }
.event-header { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin-bottom: 7px; }
.event-date { font-family: var(--ff-mono); font-size: 11px; color: var(--ink-4); }
.event-count { font-size: 14px; font-weight: 600; color: var(--ink); }
.event-pct { font-family: var(--ff-mono); font-size: 11px; background: var(--bg-2); color: var(--ink-3); padding: 2px 8px; border-radius: 4px; }
.event-context { font-size: 13px; color: var(--ink-2); line-height: 1.65; }

/* ─── PROSE BLOCK ─── */
.prose-block { font-size: 14px; color: var(--ink-2); line-height: 1.8; }
.prose-block.highlight { background: var(--bg-2); border: 1px solid var(--rule); border-radius: var(--r); padding: 14px 18px; }

/* ─── TARGET ROW ─── */
.target-row { display: flex; justify-content: space-between; align-items: flex-start; padding: 11px 0; border-bottom: 1px solid var(--rule); gap: 16px; flex-wrap: wrap; }
.target-label { font-size: 13.5px; font-weight: 500; color: var(--ink-2); flex: 1; }
.target-right { text-align: right; }
.target-value { font-family: var(--ff-mono); font-size: 13px; color: var(--ink); margin-bottom: 3px; }
.target-status { font-family: var(--ff-mono); font-size: 10px; letter-spacing: .05em; color: var(--ink-3); }
.target-note { font-size: 11px; color: var(--ink-4); margin-top: 3px; max-width: 240px; text-align: right; }

/* ─── LEGAL CARD ─── */
.legal-card {
  background: var(--white); border: 1px solid var(--rule); border-radius: var(--r); padding: 16px; margin-bottom: 10px;
  transition: border-color .15s;
}
.legal-card.relevant { border-color: var(--rule); background: var(--bg-2); }
.legal-card.rel-aligned  { border-color: var(--align-green-border);  background: var(--align-green-bg); }
.legal-card.rel-mixed    { border-color: var(--align-yellow-border); background: var(--align-yellow-bg); }
.legal-card.rel-conflict { border-color: var(--align-red-border);    background: var(--align-red-bg); }
.legal-relevant-mark { margin-bottom: 10px; }
.legal-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 9px; flex-wrap: wrap; gap: 8px; }
.legal-name { font-size: 14px; font-weight: 600; color: var(--ink); }
.legal-meta { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
.legal-filed { font-family: var(--ff-mono); font-size: 10px; color: var(--ink-4); }
.legal-amount { font-family: var(--ff-mono); font-size: 12px; font-weight: 500; color: var(--ink-2); }
.legal-status { font-family: var(--ff-mono); font-size: 11px; font-weight: 500; }
.legal-summary { font-size: 13.5px; color: var(--ink-2); line-height: 1.65; }

/* ─── LOBBY ROW ─── */
.lobby-row { padding: 12px 0; border-bottom: 1px solid var(--rule); display: grid; grid-template-columns: 220px 1fr; gap: 16px; }
.lobby-label-col { display: flex; flex-direction: column; }
.lobby-label { font-size: 13px; font-weight: 600; color: var(--ink); line-height: 1.4; }
.lobby-stance { font-size: 13px; color: var(--ink-2); line-height: 1.6; }

/* ─── PRIVACY ROW ─── */
.privacy-row { display: flex; justify-content: space-between; align-items: flex-start; padding: 11px 0; border-bottom: 1px solid var(--rule); gap: 16px; }
.privacy-label-col { flex: 1; display: flex; flex-direction: column; }
.privacy-label { font-size: 13.5px; font-weight: 500; color: var(--ink-2); }
.privacy-right { text-align: right; flex-shrink: 0; }
.privacy-value { font-family: var(--ff-mono); font-size: 12.5px; font-weight: 500; display: block; margin-bottom: 3px; }
.pv-flag { color: #92400e; }
.pv-neutral { color: var(--ink-2); }
.privacy-note { font-size: 11px; color: var(--ink-4); max-width: 260px; text-align: right; }

/* ─── FOOTER ─── */
.app-footer { background: var(--bg-2); border-top: 1px solid var(--rule); padding: 28px 24px; }
.footer-inner { max-width: 980px; margin: 0 auto; display: flex; flex-direction: column; gap: 6px; }
.app-footer p { font-size: 12px; color: var(--ink-4); line-height: 1.65; }
.footer-date { font-family: var(--ff-mono); font-size: 10px; }

/* ─── ALIGNMENT TAGS ─── */
/* Alignment dot — replaces verbose tag on overview cards */
.ov-align-dot {
  width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; display: inline-block;
}
.ov-align-dot-aligned  { background: #16a34a; }
.ov-align-dot-conflict { background: #dc2626; }
.ov-align-dot-mixed    { background: #ca8a04; }

/* Alignment tag — kept for any explicit labelling contexts */
.align-tag {
  display: inline-flex; align-items: center; gap: 5px;
  font-family: var(--ff-mono); font-size: 9px; letter-spacing: .08em; text-transform: uppercase;
  padding: 3px 9px; border-radius: 20px; white-space: nowrap; font-weight: 500; flex-shrink: 0;
}
.align-tag.aligned  { background: #ecfdf5; color: #166534; border: 1px solid #bbf7d0; }
.align-tag.conflict { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
.align-tag.mixed    { background: #fefce8; color: #854d0e; border: 1px solid #fef08a; }
.align-note { font-weight: 400; opacity: .8; }

/* ─── OVERVIEW ROOT ─── */
.ov-root { display: flex; flex-direction: column; gap: 36px; }

/* ─── COMPANY BLOCK ─── */
.ov-company-block {
  background: var(--white); border: 1px solid var(--rule); border-radius: var(--r);
  overflow: hidden;
}
.ov-company-lede {
  background: var(--ink); color: var(--bg);
  font-family: var(--ff-serif); font-size: 16px; font-style: italic; font-weight: 400;
  padding: 20px 24px; line-height: 1.5;
}
.ov-two-col {
  display: grid; grid-template-columns: 1fr 1fr; gap: 0;
}
.ov-col {
  padding: 20px 22px;
  border-right: 1px solid var(--rule);
}
.ov-col:last-child { border-right: none; }
.ov-col-label {
  font-family: var(--ff-mono); font-size: 9px; letter-spacing: .18em; text-transform: uppercase;
  color: var(--ink-4); margin-bottom: 10px;
}
.ov-col-body { font-size: 13px; color: var(--ink-2); line-height: 1.7; }
.ov-show-more {
  font-family: var(--ff-mono); font-size: 10px; color: var(--blue);
  background: none; border: none; cursor: pointer; padding: 0; letter-spacing: .04em;
  text-decoration: underline; text-underline-offset: 2px;
}
.ov-leader { display: flex; flex-direction: column; gap: 7px; }
.ov-leader-name { font-family: var(--ff-serif); font-size: 18px; font-weight: 700; color: var(--ink); }
.ov-leader-role { font-family: var(--ff-mono); font-size: 10px; color: var(--ink-3); letter-spacing: .04em; }
.ov-leader-control { font-size: 12.5px; color: var(--ink-2); line-height: 1.65; }
.ov-control-flag {
  font-family: var(--ff-mono); font-size: 9.5px; letter-spacing: .06em;
  background: #fefce8; color: #854d0e; border: 1px solid #fef08a;
  border-radius: 4px; padding: 4px 9px; width: fit-content;
}

/* ─── ISSUES SECTION ─── */
.ov-issues-section { display: flex; flex-direction: column; gap: 12px; }
.ov-issues-label {
  font-family: var(--ff-mono); font-size: 10px; letter-spacing: .12em; text-transform: uppercase;
  color: var(--ink-4); display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
}
.ov-align-legend { display: flex; gap: 8px; align-items: center; }
.ov-al-item {
  font-family: var(--ff-mono); font-size: 9px; letter-spacing: .06em; color: var(--ink-4);
  display: inline-flex; align-items: center; gap: 5px;
}

.ov-content { display: flex; flex-direction: column; gap: 8px; }
.ov-issue-card {
  background: var(--white); border: 1px solid var(--rule); border-radius: var(--r);
  padding: 16px 18px; animation: fadeUp .35s ease both;
  transition: border-color .2s;
}
.ov-issue-card.align-aligned  { border-left: 3px solid #16a34a; }
.ov-issue-card.align-conflict { border-left: 3px solid #dc2626; background: #fef2f2; }
.ov-issue-card.align-mixed    { border-left: 3px solid #ca8a04; background: #fefce8; }
.ov-ic-header {
  display: flex; justify-content: space-between; align-items: flex-start;
  margin-bottom: 10px; gap: 10px; flex-wrap: wrap;
}
.ov-ic-header-right { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; flex-shrink: 0; }
.ov-ic-title { display: flex; align-items: center; gap: 10px; }
.ov-ic-icon { font-size: 20px; line-height: 1; }
.ov-ic-label { font-size: 14px; font-weight: 600; color: var(--ink); }
.ov-ic-link {
  font-family: var(--ff-mono); font-size: 11px; letter-spacing: .04em;
  color: var(--ink-3); background: none; border: 1px solid var(--rule);
  padding: 4px 12px; border-radius: 20px; cursor: pointer; white-space: nowrap;
  transition: all .15s; flex-shrink: 0;
}
.ov-ic-link:hover { background: var(--bg-3); border-color: var(--ink-3); color: var(--ink); }
.ov-ic-headline { font-size: 13.5px; color: var(--ink-2); line-height: 1.55; margin-bottom: 10px; }
.ov-ic-points { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 5px; }
.ov-ic-points li {
  font-size: 12.5px; color: var(--ink-3); line-height: 1.6; padding-left: 14px; position: relative;
}
.ov-ic-points li::before { content: "–"; position: absolute; left: 0; color: var(--ink-4); }
.ov-ic-also {
  margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--bg-2);
  font-family: var(--ff-mono); font-size: 10px; color: var(--ink-4); letter-spacing: .04em;
  display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
}
.ov-ic-also-btn {
  font-family: var(--ff-mono); font-size: 10px; letter-spacing: .04em;
  color: var(--ink-3); background: var(--bg-2); border: none;
  padding: 3px 10px; border-radius: 4px; cursor: pointer; transition: all .15s;
}
.ov-ic-also-btn:hover { background: var(--bg-3); color: var(--ink); }

/* ─── BUSINESS: COST STRUCTURE ─── */
/* ── Revenue vs Profit chart ── */
.rp-chart { display: flex; flex-direction: column; gap: 0; }
.rp-legend {
  display: flex; gap: 20px; align-items: center;
  margin-bottom: 18px; flex-wrap: wrap;
}
.rp-leg-item {
  display: flex; align-items: center; gap: 7px;
  font-family: var(--ff-mono); font-size: 10px;
  letter-spacing: .08em; color: var(--ink-3);
}
.rp-leg-dot {
  width: 12px; height: 12px; border-radius: 2px; flex-shrink: 0;
}
.rp-leg-dot.cost   { background: #1A1A1A; }
.rp-leg-dot.profit { background: #166534; }
.rp-leg-dot.loss   { background: #fca5a5; border: 1px solid #f87171; }

.rp-row {
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 8px 14px;
  align-items: start;
  padding: 11px 0;
  border-bottom: 1px solid var(--bg-3);
}
.rp-row:last-of-type { border-bottom: none; }
.rp-label {
  font-size: 13px; font-weight: 500; color: var(--ink-2);
  line-height: 1.4; padding-top: 6px;
}
.rp-bars { display: flex; flex-direction: column; gap: 4px; }

.rp-bar-wrap { display: flex; flex-direction: column; gap: 3px; }

/* Outer track = full width reference; inner fills to revenue % */
.rp-bar-outer {
  width: 100%; height: 22px;
  background: var(--bg-3); border-radius: 4px;
  overflow: hidden;
}
.rp-bar-inner {
  height: 100%; display: flex;
  transition: width .7s cubic-bezier(.4,0,.2,1);
  border-radius: 4px; overflow: hidden;
}
/* Segments inside the bar */
.rp-bar-seg {
  height: 100%;
  transition: width .7s cubic-bezier(.4,0,.2,1);
}
.rp-bar-seg.cost   { background: #1A1A1A; }
.rp-bar-seg.profit { background: #166534; }
.rp-bar-seg.profit.highlight { background: #2563eb; }
.rp-bar-seg.loss   { background: #fca5a5; }

/* Amount labels row */
.rp-bar-labels {
  display: flex; justify-content: space-between; align-items: baseline;
  gap: 8px;
}
.rp-bar-rev {
  font-family: var(--ff-mono); font-size: 11px; color: var(--ink-3);
}
.rp-bar-margin {
  font-family: var(--ff-mono); font-size: 11px;
  color: #166534; font-weight: 500;
}
.rp-bar-margin.loss      { color: #b91c1c; font-style: italic; }
.rp-bar-margin.highlight { color: #2563eb; font-weight: 600; }

.rp-row-note {
  font-size: 11.5px; color: var(--ink-4);
  line-height: 1.5; margin-top: 1px;
}
.profit-note {
  font-size: 13px; color: var(--ink-3); line-height: 1.65;
  margin-top: 16px; padding: 12px 14px;
  background: var(--bg-2); border-radius: 6px; font-style: italic;
}
@media (max-width: 560px) {
  .rp-row { grid-template-columns: 1fr; gap: 4px; }
  .rp-label { padding-top: 0; }
}
.biz-cost-intro { font-size: 13.5px; color: var(--ink-3); font-style: italic; margin-bottom: 8px; line-height: 1.6; }
.cost-item {
  border-left: 2px solid var(--bg-3); padding: 12px 16px;
  background: var(--white); border-radius: 0 var(--r) var(--r) 0; margin-bottom: 8px;
}
/* cost-item alignment colors handled by .flag-* generics */
.cost-label { font-size: 13px; font-weight: 600; color: var(--ink); margin-bottom: 5px; }
.cost-body { font-size: 13.5px; color: var(--ink-2); line-height: 1.7; }

/* ─── TRAJECTORY TAB ─── */
.traj-rd-trend { font-size: 13px; color: var(--ink-3); font-style: italic; margin-top: 8px; line-height: 1.6; }
.traj-bet {
  background: var(--white); border: 1px solid var(--rule); border-radius: var(--r);
  padding: 16px 18px; margin-bottom: 10px; transition: border-color .15s;
}
/* traj-bet alignment colors handled by .flag-* generics */
.traj-bet-header {
  display: flex; justify-content: space-between; align-items: flex-start;
  margin-bottom: 12px; gap: 12px; flex-wrap: wrap;
}
.traj-bet-name { font-size: 14px; font-weight: 600; color: var(--ink); margin-bottom: 3px; }
.traj-bet-capex { font-family: var(--ff-mono); font-size: 10px; color: var(--ink-3); letter-spacing: .04em; }
.traj-bet-status {
  font-family: var(--ff-mono); font-size: 9px; letter-spacing: .08em; text-transform: uppercase;
  background: var(--bg-2); color: var(--ink-3); border: 1px solid var(--rule);
  padding: 3px 10px; border-radius: 4px; white-space: nowrap; flex-shrink: 0;
}
.traj-bet-thesis { font-size: 13.5px; color: var(--ink-2); line-height: 1.7; margin-bottom: 10px; }
.traj-bet-impact {
  font-size: 12.5px; color: var(--ink); background: var(--bg); border-radius: 4px;
  padding: 8px 12px; line-height: 1.65;
}
.traj-impact-label {
  font-family: var(--ff-mono); font-size: 9px; letter-spacing: .1em; text-transform: uppercase;
  color: var(--blue); display: block; margin-bottom: 4px;
}
.traj-killed {
  padding: 10px 0; border-bottom: 1px solid var(--bg-2);
}
.traj-killed-header { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; margin-bottom: 4px; }
.traj-killed-name { font-size: 13.5px; font-weight: 600; color: var(--ink); }
.traj-killed-when { font-family: var(--ff-mono); font-size: 10px; color: var(--ink-4); flex-shrink: 0; }
.traj-killed-note { font-size: 12.5px; color: var(--ink-3); }
.traj-quote {
  background: var(--white); border: 1px solid var(--rule); border-left: 3px solid var(--ink);
  border-radius: 0 var(--r) var(--r) 0; padding: 14px 18px; margin-bottom: 10px;
}
.traj-quote-person { display: flex; align-items: center; gap: 10px; margin-bottom: 9px; }
.traj-quote-name { font-size: 13px; font-weight: 600; color: var(--ink); }
.traj-quote-role { font-family: var(--ff-mono); font-size: 9.5px; color: var(--ink-4); letter-spacing: .04em; }
.traj-quote-text { font-size: 13.5px; color: var(--ink-2); line-height: 1.7; margin-bottom: 8px; }
.traj-quote-src { font-family: var(--ff-mono); font-size: 10px; color: var(--ink-4); letter-spacing: .04em; }

/* ─── RESPONSIVE ─── */
@media (max-width: 640px) {
  .ob-content { padding: 36px 20px 60px; }
  .ob-grid { grid-template-columns: 1fr 1fr; }
  .mast-name { font-size: 40px; letter-spacing: -1px; }
  .co-search-wrap { max-width: 100%; }
  .tab-bar-inner { padding: 0 16px; }
  .bar { grid-template-columns: 100px 1fr 60px; }
  .lobby-row { grid-template-columns: 1fr; gap: 5px; }
  .data-row { flex-direction: column; gap: 4px; }
  .data-row-right { text-align: left; }
  .ov-two-col { grid-template-columns: 1fr; }
  .ov-col { border-right: none; border-bottom: 1px solid var(--rule); }
  .ov-ic-header-right { flex-direction: column; align-items: flex-start; }
  .traj-bet-header { flex-direction: column; }
  .app-main { padding: 0 16px 60px; }
}
`;