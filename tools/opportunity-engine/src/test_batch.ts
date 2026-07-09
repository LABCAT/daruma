import { collect } from './collect/index.js';
import { score } from './score/index.js';
import { log } from './utils/logger.js';

async function main() {
  const categories = {
    'test': [
      'trade point invoice', 
      'tradie invoice gst', 
      'tradie invoice odt', 
      'trade depot invoice', 
      'plumber schedule'
    ]
  };
  const outputDir = 'research-runs/test-batch';
  
  log.info('COLLECT', 'Starting test batch collection...');
  const rawRecords = await collect({ categories, noSerp: true, outputDir, force: true });
  
  log.info('SCORE', 'Starting test batch scoring...');
  await score(rawRecords, { outputDir });
  
  log.info('SCORE', 'Test batch complete.');
}

main().catch(err => console.error(err));
