const mongoose = require('mongoose');

const gameRoundSchema = new mongoose.Schema({
  roundId: String,
  startTime: Date,
  crashPoint: Number,
  seedHash: String,
  seed: String,
  bets: [{
    userId: String,
    usdAmount: Number,
    cryptoAmount: Number,
    currency: String,
    cashoutMultiplier: Number
  }]
});

module.exports = mongoose.model('GameRound', gameRoundSchema);
