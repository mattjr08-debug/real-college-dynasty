// Player NIL Market Valuations (October 2026)
// Separate market value estimates from actual contract offers.
// High school recruits: ranked 1-300 nationally, plus unranked
// Transfer portal: ranked by production and college performance

// National recruiting ranking -> typical NIL market value (in thousands)
const RECRUIT_RANKINGS = [
  { rank: 5, typical: 1500, low: 750, high: 3000 },   // #1-5
  { rank: 15, typical: 650, low: 300, high: 1500 },   // #6-15
  { rank: 30, typical: 300, low: 125, high: 750 },    // #16-30
  { rank: 50, typical: 150, low: 60, high: 350 },     // #31-50
  { rank: 100, typical: 75, low: 25, high: 175 },     // #51-100
  { rank: 150, typical: 35, low: 10, high: 90 },      // #101-150
  { rank: 250, typical: 15, low: 2, high: 50 },       // #151-250
  { rank: 400, typical: 7, low: 0, high: 25 },        // #251-400
  { rank: Infinity, typical: 2, low: 0, high: 15 },   // Unranked
];

const PORTAL_RANKINGS = [
  { rank: 10, typical: 2500, low: 1000, high: 5000 },   // #1-10
  { rank: 25, typical: 1300, low: 600, high: 3000 },    // #11-25
  { rank: 50, typical: 750, low: 350, high: 1600 },     // #26-50
  { rank: 100, typical: 400, low: 175, high: 900 },     // #51-100
  { rank: 200, typical: 175, low: 60, high: 450 },      // #101-200
  { rank: 350, typical: 75, low: 20, high: 200 },       // #201-350
  { rank: 500, typical: 30, low: 5, high: 100 },        // #351-500
  { rank: 750, typical: 12, low: 0, high: 50 },         // #501-750
  { rank: Infinity, typical: 3, low: 0, high: 20 },     // #751+
];

// Gaussian random number (mean 0, stddev 1)

// Get the bracket for a ranking
function getRankingBracket(rank, brackets) {
  return brackets.find((b) => rank <= b.rank);
}

// Calculate NIL market value for a high school recruit
// rankPos: position in the 300-recruit pyramid (0-299)
function W_nilMarketHS(e, rankPos) {
  // Map rank position to a recruiting rank (1-300, or 301+ for unranked)
  const recruitRank = rankPos < 300 ? rankPos + 1 : 301;
  
  const bracket = getRankingBracket(recruitRank, RECRUIT_RANKINGS);
  if (!bracket) return { rank: recruitRank, market: 2000 }; // fallback
  
  // Apply individual variation using Gaussian distribution
  // Most players near their typical value, some higher/lower
  const variation = W_gauss(e); // stddev ~1, mean 0
  const ratio = Math.exp(variation * 0.15); // 15% stddev in log space
  
  const market = bracket.typical * ratio;
  const clamped = Math.max(bracket.low, Math.min(bracket.high, Math.round(market)));
  
  return {
    recruitRank,
    nilMarket: clamped,
  };
}

// Calculate NIL market value for a transfer
// starPro: the player's production-based star rating (0-5)
// year: college year (1-4+)
function W_nilMarketTransfer(e, starPro, year, stats) {
  // Portal ranking estimate based on star rating, college production, and age
  let portalRank = 1000; // worst
  
  if (starPro >= 5) {
    portalRank = j(e, 1, 10); // elite transfers
  } else if (starPro >= 4) {
    portalRank = j(e, 11, 25); // very good transfers
  } else if (starPro >= 3) {
    portalRank = j(e, 26, 50); // good transfers
  } else if (starPro >= 2) {
    portalRank = j(e, 51, 100); // decent transfers
  } else if (starPro >= 1) {
    portalRank = j(e, 101, 200); // lower-tier transfers
  } else {
    portalRank = j(e, 201, 500);
  }
  
  // Adjust ranking based on production stats
  if (stats && stats.pts > 0) {
    const productivity = (stats.pts * 0.3 + stats.reb * 0.2 + stats.ast * 0.2) / (stats.gp || 1);
    if (productivity > 15) portalRank = Math.max(1, portalRank - 20);
    else if (productivity > 10) portalRank = Math.max(1, portalRank - 10);
  }
  
  // Younger players with years left are more valuable
  if (year <= 2) portalRank = Math.max(1, portalRank - 5);
  else if (year >= 4) portalRank = Math.min(750, portalRank + 30);
  
  const bracket = getRankingBracket(portalRank, PORTAL_RANKINGS);
  const variation = W_gauss(e);
  const ratio = Math.exp(variation * 0.15);
  const market = bracket.typical * ratio;
  const clamped = Math.max(bracket.low, Math.min(bracket.high, Math.round(market)));
  
  return {
    portalRank,
    nilMarket: clamped,
  };
}

// Assign NIL market values to a recruit pool
// Modifies players in place, adding nilMarket, recruiting rank, and updating ask
function W_nilAssignMarkets(e, prospects) {
  // Create a shuffled ranking for high school recruits (1-300)
  const hsPlayers = prospects.filter((p) => p.origin === "High school");
  const rankIndices = hsPlayers.map((_, i) => i);
  
  // Fisher-Yates shuffle within each star tier to create randomized national rankings
  for (let i = rankIndices.length - 1; i > 0; i--) {
    const j_idx = Math.floor(ne(e) * (i + 1));
    [rankIndices[i], rankIndices[j_idx]] = [rankIndices[j_idx], rankIndices[i]];
  }
  
  // Assign national recruiting rankings to HS players
  let rankCounter = 0;
  for (const idx of rankIndices) {
    const p = hsPlayers[idx];
    const valuation = W_nilMarketHS(e, rankCounter);
    p.recruitRank = valuation.recruitRank;
    p.nilMarket = valuation.nilMarket;
    
    // Update ask to be based on market value with modest variation
    // The ask should reflect the market value, not a fixed minimum
    const askVariation = W_gauss(e) * 0.12; // ±12% variation
    const newAsk = Math.round(p.nilMarket * (1 + askVariation) / 100) * 100;
    // Set minimum to 100 (in thousands) which is $100K
    p.ask = Math.max(100, newAsk);
    
    rankCounter++;
  }
  
  // Assign portal rankings to transfers
  const transferPlayers = prospects.filter((p) => p.origin === "Transfer");
  for (const p of transferPlayers) {
    const prodStats = p.history?.[0]?.stats || {};
    const valuation = W_nilMarketTransfer(e, p.sg || p.stars, p.year, prodStats);
    p.portalRank = valuation.portalRank;
    p.nilMarket = valuation.nilMarket;
    
    // Update ask for transfers
    const askVariation = W_gauss(e) * 0.12;
    const newAsk = Math.round(p.nilMarket * (1 + askVariation) / 100) * 100;
    p.ask = Math.max(100, newAsk);
  }
}
