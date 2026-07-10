import fs from 'fs';

const scoredData = JSON.parse(fs.readFileSync('c:/Users/shane/Documents/www/daruma/tools/opportunity-engine/research-runs/2026-07-09/02-scored.json', 'utf8'));

const EXCLUDED_GENRES = [
  'action', 'adventure', 'arcade', 'board', 'card', 'casino', 'casual', 
  'educational', 'music', 'puzzle', 'racing', 'role playing', 'simulation', 
  'sports', 'strategy', 'trivia', 'word', 'entertainment', 'music & audio',
  'comics', 'dating', 'events', 'beauty'
];

const UTILITY_INTENT_TERMS = [
  'invoice', 'schedule', 'booking', 'tracker', 'inventory', 'calculator',
  'planner', 'diary', 'quote', 'estimate', 'timesheet', 'manager',
  'form', 'receipt', 'reminder', 'billing', 'pos', 'accounting',
  'client', 'appointment', 'roster', 'checklist', 'log'
];

let out = '';

// 5. Specific report on "tradie invoice"
out += "\n=== SPECIFIC REPORT: tradie invoice ===\n";
const ambiguous = scoredData.find(d => d.keyword === "tradie invoice");
if (ambiguous) {
  out += `Keyword analyzed: ${ambiguous.keyword}\n`;
  out += "Competitor apps feeding Discovery (relevance):\n";
  
  const keywordTerms = ambiguous.normalizedKeyword.split(' ');
  const keywordIntents = keywordTerms.filter(t => UTILITY_INTENT_TERMS.includes(t));
  const intentsToCheck = keywordIntents.length > 0 ? keywordIntents : UTILITY_INTENT_TERMS;

  ambiguous.playStoreApps.forEach(app => {
    let relevanceScore = 0.0;
    const genre = (app.genre || '').toLowerCase();
    if (!EXCLUDED_GENRES.includes(genre)) {
      const text = `${app.name} ${app.description || ''} ${genre}`.toLowerCase();
      const matched = intentsToCheck.filter(i => text.includes(i)).length;
      relevanceScore = matched / intentsToCheck.length;
    }
    out += `  - ${app.name} | Genre: ${app.genre} | Relevance Score: ${relevanceScore.toFixed(2)}\n`;
  });
  out += `Discovery Score: ${ambiguous.scores.discovery}\n`;
  out += `Relevance Confidence: ${ambiguous.scores.relevanceConfidence.toFixed(2)}\n`;
}

fs.writeFileSync('c:/Users/shane/Documents/www/daruma/tools/opportunity-engine/report_specific_utf8.txt', out, 'utf8');
