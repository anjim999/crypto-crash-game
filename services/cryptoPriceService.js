const axios = require('axios');

// Simple cache to reduce API calls
let cache = {
  BTC: null,
  ETH: null,
  timestamp: 0
};

const getCryptoPrice = async (currency) => {
  const now = Date.now();
  
  // Use cached price if within 10 seconds
  if (cache[currency] && (now - cache.timestamp < 10000)) {
    return cache[currency];
  }

  try {
    const { data } = await axios.get(
      `${process.env.CRYPTO_API_URL}?ids=bitcoin,ethereum&vs_currencies=usd`
    );

    cache = {
      BTC: data.bitcoin.usd,
      ETH: data.ethereum.usd,
      timestamp: now
    };

    return cache[currency];
  } catch (err) {
    console.error('Failed to fetch crypto price:', err.message);
    throw new Error('Unable to get crypto price');
  }
};

module.exports = { getCryptoPrice };
