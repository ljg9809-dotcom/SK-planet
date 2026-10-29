'use strict';
const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');
const { Writable } = require('node:stream');

const target = path.join(__dirname, '..', '.env.local');
console.log('Korea Tourism Organization API key setup');
console.log('Enter the Decoding service key, then press Enter. Input is hidden.');
console.log('The key is saved only in the Git-ignored .env.local file.');
process.stdout.write('TOURISM_API_KEY: ');
const silentOutput = new Writable({ write(chunk, encoding, done) { done(); } });
const prompt = readline.createInterface({input: process.stdin, output: silentOutput, terminal: true});
prompt.on('SIGINT', () => { prompt.close(); console.log('\nCancelled.'); process.exitCode = 1; });
prompt.question('', answer => {
  try {
    const key = answer.trim();
    if (!key || /[\r\n]/.test(key)) throw new Error('Enter a nonempty single-line key.');
    const existing = fs.existsSync(target) ? fs.readFileSync(target, 'utf8').split(/\r?\n/).filter(line => line && !/^TOURISM_API_KEY=/.test(line)) : [];
    fs.writeFileSync(target, [...existing, `TOURISM_API_KEY=${key}`, ''].join('\n'), {mode: 0o600});
    console.log('\nSaved locally. API integration has not been enabled yet.');
  } catch (error) {
    console.error('\nCould not save key:', error.message);
    process.exitCode = 1;
  } finally { prompt.close(); }
});
