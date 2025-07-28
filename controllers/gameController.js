const GameRound = require('../models/GameRound');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { getCryptoPrice } = require('../services/cryptoPriceService');
const { v4: uuidv4 } = require('uuid');

exports.placeBet = async (req, res) => {
  try {
    const { userId, usdAmount, currency } = req.body;
    if (usdAmount <= 0) return res.status(400).json({ error: 'Invalid amount' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const price = await getCryptoPrice(currency);
    const cryptoAmount = usdAmount / price;

    if (user.wallets[currency] < cryptoAmount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    user.wallets[currency] -= cryptoAmount;
    await user.save();

    const round = await GameRound.findOne().sort({ startTime: -1 });
    round.bets.push({
      userId,
      usdAmount,
      cryptoAmount,
      currency,
      cashoutMultiplier: null
    });
    await round.save();

    const transaction = new Transaction({
      playerId: userId,
      usdAmount,
      cryptoAmount,
      currency,
      transactionType: 'bet',
      transactionHash: uuidv4(),
      priceAtTime: price
    });
    await transaction.save();

    res.json({ message: 'Bet placed', cryptoAmount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.cashOut = async (req, res) => {
  try {
    const { userId, roundId, multiplier } = req.body;
    const round = await GameRound.findOne({ roundId });
    if (!round) return res.status(404).json({ error: 'Round not found' });

    const bet = round.bets.find(b => b.userId === userId && b.cashoutMultiplier === null);
    if (!bet) return res.status(400).json({ error: 'No active bet found' });

    if (multiplier >= round.crashPoint) {
      return res.status(400).json({ error: 'Game already crashed' });
    }

    const price = await getCryptoPrice(bet.currency);
    const payout = bet.cryptoAmount * multiplier;

    const user = await User.findById(userId);
    user.wallets[bet.currency] += payout;
    await user.save();

    bet.cashoutMultiplier = multiplier;
    await round.save();

    const transaction = new Transaction({
      playerId: userId,
      usdAmount: payout * price,
      cryptoAmount: payout,
      currency: bet.currency,
      transactionType: 'cashout',
      transactionHash: uuidv4(),
      priceAtTime: price
    });
    await transaction.save();

    res.json({ message: 'Cashout successful', payout, usdValue: payout * price });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
