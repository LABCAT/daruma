const fs = require('fs');

async function fetchTanuki() {
  const htmlRes = await fetch('https://tanuki-toolbox-design-system.vercel.app/');
  const html = await htmlRes.text();
  
  const cssMatches = html.match(/href="(\/_next\/static\/[^"]+\.css)"/g);
  let allCss = '';
  
  if (cssMatches) {
    for (const match of cssMatches) {
      const url = match.match(/href="([^"]+)"/)[1];
      const cssRes = await fetch(`https://tanuki-toolbox-design-system.vercel.app${url}`);
      allCss += await cssRes.text() + '\n';
    }
  }
  
  // Extract CSS variables
  const vars = new Set();
  const varMatches = allCss.match(/--[a-zA-Z0-9_-]+:[^;}]+/g);
  if (varMatches) {
    varMatches.forEach(v => vars.add(v));
  }
  
  fs.writeFileSync('tanuki_vars.txt', Array.from(vars).join('\n'));
  console.log('Variables extracted!');
}

fetchTanuki().catch(console.error);
