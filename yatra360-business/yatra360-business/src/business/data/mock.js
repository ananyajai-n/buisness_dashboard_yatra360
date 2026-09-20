/** Deterministic stand-in for the FastAPI intelligence endpoints. */
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const curve = (peaks, base, noise) =>
  HOURS.map((h) => {
    let v = base;
    peaks.forEach(([c, amp, w]) => { v += amp * Math.exp(-((h - c) ** 2) / (2 * w * w)); });
    return Math.max(0, Math.round(v + Math.sin(h * 2.1) * noise));
  });

export const SEGMENT_META = {
  family: { name: "Family", color: "var(--gold)", hex: "#C98A2B" },
  solo: { name: "Solo & couples", color: "var(--teal)", hex: "#2C6E63" },
  transit: { name: "In transit", color: "var(--paper)", hex: "#EEF0EA" },
};

export const SCENARIOS = {
  weekend: {
    label: "Sat 26 Sep",
    series: HOURS.map((h) => ({
      hour: h,
      family: curve([[12, 140, 2.2], [18, 180, 2.6]], 28, 6)[h],
      solo: curve([[10, 70, 2.4], [20, 110, 2]], 18, 5)[h],
      transit: curve([[9, 60, 1.5], [17, 85, 1.8]], 22, 7)[h],
    })),
    kpi: { footfall: "7,420", peak: "17:40–19:20", segment: "Family", share: "46% of arrivals", spill: "+38%", spillTone: "bad" },
    spillNote: "Shaniwar Wada breaches safe capacity at 16:50; overflow routes down Bajirao Rd.",
    comfort: [
      { label: "Willing to walk >1.2 km", value: 78 },
      { label: "Tolerates queueing", value: 54 },
      { label: "Prioritises speed", value: 31 },
      { label: "Weather-sensitive", value: 63 },
      { label: "Price-led", value: 41 },
    ],
    heat: [[.30,.42,1],[.36,.45,.92],[.44,.40,.7],[.52,.52,.85],[.62,.58,.6],[.47,.66,.55],[.70,.40,.4],[.26,.60,.45],[.58,.30,.5]],
    origin: [
      { node: "Shaniwar Wada", visitors: 2410, share: 1 },
      { node: "Pune Station (rail)", visitors: 1180, share: .49 },
      { node: "Swargate interchange", visitors: 960, share: .4 },
      { node: "Deccan Gymkhana", visitors: 720, share: .3 },
      { node: "Koregaon Park", visitors: 430, share: .18 },
    ],
    alerts: [
      { at: "16:12", sev: "hi", title: "Waterlogging reported on Laxmi Rd near your block", sub: "4 tourist reports in the last 40 min · access from the north is slow" },
      { at: "15:48", sev: "md", title: "Shaniwar Wada crowd index at 0.91", sub: "Authority has flagged redistribution toward Kasba Peth" },
      { at: "14:05", sev: "lo", title: "Metro Line 1 running at normal headway", sub: "Aqua line, 6 min frequency" },
    ],
  },
  weekday: {
    label: "Wed 23 Sep",
    series: HOURS.map((h) => ({
      hour: h,
      family: curve([[13, 52, 2.4], [19, 64, 2.4]], 14, 4)[h],
      solo: curve([[11, 44, 2.6], [20, 58, 2.2]], 13, 4)[h],
      transit: curve([[9, 96, 1.3], [18, 104, 1.5]], 20, 6)[h],
    })),
    kpi: { footfall: "2,960", peak: "18:20–19:10", segment: "In transit", share: "51% of arrivals", spill: "+6%", spillTone: "good" },
    spillNote: "No capacity breach forecast. Demand is commuter-led rather than destination-led.",
    comfort: [
      { label: "Prioritises speed", value: 81 },
      { label: "Price-led", value: 58 },
      { label: "Willing to walk >1.2 km", value: 34 },
      { label: "Tolerates queueing", value: 22 },
      { label: "Weather-sensitive", value: 47 },
    ],
    heat: [[.33,.48,.62],[.40,.46,.5],[.50,.50,.45],[.60,.56,.35],[.28,.56,.3],[.66,.44,.25]],
    origin: [
      { node: "Pune Station (rail)", visitors: 860, share: 1 },
      { node: "Swargate interchange", visitors: 640, share: .74 },
      { node: "Shaniwar Wada", visitors: 410, share: .48 },
      { node: "Deccan Gymkhana", visitors: 300, share: .35 },
      { node: "Koregaon Park", visitors: 180, share: .21 },
    ],
    alerts: [
      { at: "17:30", sev: "md", title: "Peak-hour congestion on Shivaji Rd", sub: "Expect slower last-100m access until 19:00" },
      { at: "11:20", sev: "lo", title: "Air quality in Kasba Peth: moderate", sub: "No advisory for outdoor seating" },
    ],
  },
};

export const OPPORTUNITIES = {
  weekend: [
    { id: "o1", title: "Run a family meal bundle from 14:00", window: "14:00–17:00", confidence: 86,
      body: "Severe overcrowding is forecast at Shaniwar Wada from 16:50. Redistribution will push roughly 640 family-segment visitors through Kasba Peth, and 46% of them arrive with children under twelve. A visible fixed-price family plate, held between 14:00 and 17:00, converts the overflow before the group settles somewhere else.",
      signal: "Signal: capacity breach + segment mix + 1.1 km walking radius" },
    { id: "o2", title: "Hold two staff back for the 17:40 wave", window: "17:40–19:20", confidence: 79,
      body: "Projected footfall inside your 1.5 km radius peaks at 7,420 with the sharpest gradient after 17:40. Comparable vendors lose an estimated 18% of the evening wave to service time rather than price. Staffing the counter through the wave is the cheapest available intervention.",
      signal: "Signal: demand gradient + service-time benchmark" },
    { id: "o3", title: "List on the Kasba Peth corridor", window: "This weekend", confidence: 71,
      body: "The authority dashboard has proposed a new tourism corridor linking Shaniwar Wada to the Kasba Peth food cluster. Businesses listed on a corridor appear inside tourist itineraries at the redistribution step, ahead of general search results. Listing is free for the MVP period.",
      signal: "Signal: corridor proposal, pending authority approval" },
  ],
  weekday: [
    { id: "o4", title: "Move the offer to the 08:30 commuter window", window: "08:30–10:00", confidence: 74,
      body: "Midweek demand in your radius is commuter-led: 51% of nearby movement is in-transit rather than destination-bound. A quick-service morning item priced for a single traveller matches this profile far better than the weekend family bundle.",
      signal: "Signal: segment inversion vs weekend baseline" },
    { id: "o5", title: "Rest inventory ahead of Saturday", window: "Wed–Thu", confidence: 68,
      body: "Forecast midweek footfall is 2,960 against 7,420 on Saturday. Perishable stock ordered for the weekend wave should land Friday evening rather than Wednesday, cutting spoilage risk without capping the Saturday ceiling.",
      signal: "Signal: weekday/weekend demand ratio 1:2.5" },
  ],
};
