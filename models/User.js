const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  wallets: {
    BTC: { type: Number, default: 1 },
    ETH: { type: Number, default: 1 }
  }
});

module.exports = mongoose.model('User', userSchema);
