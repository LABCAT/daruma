import gplay from 'google-play-scraper';

async function run() {
  try {
    const res = await gplay.search({ term: 'menu planner restaurant', num: 5 });
    console.log(`Success! Found ${res.length} apps:`, res.map(a => a.title).join(', '));
  } catch (err) {
    console.error("Failed:", err);
  }
}
run();
