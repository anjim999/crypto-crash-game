const axios = require('axios');
let cache = { BTC: null, ETH: null, timestamp: 0 };

const getCryptoPrice = async (currency) => {
  const now = Date.now();
  if (cache[currency] && now - cache.timestamp < 10000) {
    return cache[currency];
  }
  const { data } = await axios.get(
    `${process.env.CRYPTO_API_URL}?ids=bitcoin,ethereum&vs_currencies=usd`
  );
  cache = {
    BTC: data.bitcoin.usd,
    ETH: data.ethereum.usd,
    timestamp: now
  };
  return cache[currency];
};

module.exports = { getCryptoPrice };
