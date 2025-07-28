const crypto = require('crypto');

const generateSeed = () => crypto.randomBytes(16).toString('hex');

const generateCrashPoint = (seed, roundNumber) => {
  const hash = crypto.createHash('sha256').update(seed + roundNumber).digest('hex');
  const num = parseInt(hash.slice(0, 8), 16);
  return Math.max(1.0, (num % 10000) / 100 + 1);
};

module.exports = { generateSeed, generateCrashPoint };
