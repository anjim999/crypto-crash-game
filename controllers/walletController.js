const User = require('../models/User');
const { getCryptoPrice } = require('../services/cryptoPriceService');

exports.getWallet = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const btcPrice = await getCryptoPrice('BTC');
    const ethPrice = await getCryptoPrice('ETH');

    res.json({
      BTC: {
        crypto: user.wallets.BTC,
        usd: user.wallets.BTC * btcPrice
      },
      ETH: {
        crypto: user.wallets.ETH,
        usd: user.wallets.ETH * ethPrice
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
