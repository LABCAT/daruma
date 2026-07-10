import fs from 'fs';

const scoredData = JSON.parse(fs.readFileSync('c:/Users/shane/Documents/www/daruma/tools/opportunity-engine/research-runs/2026-07-09/02-scored.json', 'utf8'));
let out = '';

// 1. Keyword Source
out += "=== KEYWORD SOURCE ===\n";
out += "Total Keywords Scored: " + scoredData.length + "\n";
// Check which ones are in discovered_keywords.json
const discovered = JSON.parse(fs.readFileSync('c:/Users/shane/Documents/www/daruma/tools/opportunity-engine/discovered_keywords.json', 'utf8'));
const discoveredFlat = new Set();
Object.values(discovered).forEach(arr => arr.forEach(k => discoveredFlat.add(k)));

let discoveredCount = 0;
scoredData.forEach(d => {
  if (discoveredFlat.has(d.keyword)) discoveredCount++;
});
out += `Keywords found in discovered_keywords.json: ${discoveredCount}\n`;


// 3. Full score table
out += "\n=== FULL SCORE TABLE ===\n";
out += "Keyword | Relevance Confidence | Pain | WTP | Discovery | Build Speed | Subtotal\n";
const sortedData = [...scoredData].sort((a,b) => (b.scores?.subtotal || 0) - (a.scores?.subtotal || 0));
sortedData.forEach(d => {
  const s = d.scores;
  if (!s) return;
  out += `${d.keyword} | ${s.relevanceConfidence.toFixed(2)} | ${s.pain} | ${s.wtp} | ${s.discovery} | ${s.buildSpeed} | ${s.subtotal}\n`;
});

// 4. Raw signal data for 5 keywords (lowest, low-mid, mid, high-mid, highest)
out += "\n=== RAW SIGNAL DATA (5 KEYWORDS) ===\n";
const indices = [
  sortedData.length - 1, // lowest
  Math.floor(sortedData.length * 0.75), // low-mid
  Math.floor(sortedData.length * 0.5), // mid
  Math.floor(sortedData.length * 0.25), // high-mid
  0 // highest
];

indices.forEach(idx => {
  const d = sortedData[idx];
  out += `\n--- Keyword: ${d.keyword} ---\n`;
  out += `Subtotal Score: ${d.scores.subtotal}\n`;
  
  out += "Competitor Apps Returned:\n";
  d.playStoreApps.forEach(app => {
    out += `  - ${app.name} (Genre: ${app.genre || 'N/A'}, Relevance: ${app.relevanceScore !== undefined ? app.relevanceScore.toFixed(2) : 'N/A'})\n`;
  });
  
  out += `Reviews Sampled: ${d.playStoreReviews.length}\n`;
  
  // Pain Hits
  const PAIN_LEXICON = ["hard", "annoying", "frustrating", "broken", "useless", "crash", "bug", "terrible", "worst", "waste", "slow", "doesn't work", "does not work", "fix", "awful", "horrible", "stuck", "error", "fail", "joke", "garbage", "trash"]; 
  let painHits = 0;
  const WTP_LEXICON = ["pay", "premium", "subscribe", "subscription", "pro", "expensive", "cost", "price", "money", "worth", "refund", "charge", "bought", "purchase"];
  let wtpHits = 0;
  
  const allText = d.playStoreReviews.map(r => r.text.toLowerCase()).join(' ');
  PAIN_LEXICON.forEach(term => {
    const regex = new RegExp(term.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 'gi');
    const matches = allText.match(regex);
    if (matches) painHits += matches.length;
  });
  WTP_LEXICON.forEach(term => {
    const regex = new RegExp(term.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 'gi');
    const matches = allText.match(regex);
    if (matches) wtpHits += matches.length;
  });
  
  out += `Raw Pain Hits: ${painHits} (Rate: ${(d.playStoreReviews.length ? painHits/d.playStoreReviews.length : 0).toFixed(2)})\n`;
  out += `Raw WTP Hits: ${wtpHits} (Rate: ${(d.playStoreReviews.length ? wtpHits/d.playStoreReviews.length : 0).toFixed(2)})\n`;
});

// 5. Specific report on "trade point invoice" or equivalent
out += "\n=== SPECIFIC REPORT ===\n";
const ambiguous = sortedData.find(d => d.keyword.toLowerCase().includes("invoice") || d.keyword.toLowerCase().includes("trade point") || d.keyword.toLowerCase().includes("builder") || d.keyword.toLowerCase().includes("tracker")) || sortedData[10];
out += `Keyword analyzed: ${ambiguous.keyword}\n`;
out += "Competitor apps feeding Discovery (relevance):\n";
ambiguous.playStoreApps.forEach(app => {
  out += `  - ${app.name} | Genre: ${app.genre} | Relevance Score: ${app.relevanceScore !== undefined ? app.relevanceScore.toFixed(2) : 'N/A'}\n`;
});
out += `Discovery Score: ${ambiguous.scores.discovery}\n`;
out += `Relevance Confidence: ${ambiguous.scores.relevanceConfidence.toFixed(2)}\n`;

fs.writeFileSync('c:/Users/shane/Documents/www/daruma/tools/opportunity-engine/report_output_utf8.txt', out, 'utf8');
