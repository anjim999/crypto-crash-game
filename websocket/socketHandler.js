const GameRound = require('../models/GameRound');
const { generateSeed, generateCrashPoint } = require('../utils/fairAlgorithm');

let currentRound = null;
let currentMultiplier = 1;
let interval;

function startGame(io) {
  setInterval(async () => {
    const roundId = "r" + Date.now();
    const seed = generateSeed();
    const crashPoint = generateCrashPoint(seed, roundId);
    const seedHash = require('crypto').createHash('sha256').update(seed).digest('hex');

    currentRound = new GameRound({
      roundId,
      startTime: new Date(),
      crashPoint,
      seed,
      seedHash,
      bets: []
    });

    await currentRound.save();

    currentMultiplier = 1;
    io.emit("round_start", { roundId, crashPoint, seedHash });

    interval = setInterval(() => {
      if (currentMultiplier >= crashPoint) {
        clearInterval(interval);
        io.emit("round_crash", { crashPoint });
        return;
      }

      currentMultiplier += 0.1;
      io.emit("multiplier_update", { multiplier: currentMultiplier.toFixed(2) });
    }, 100);
  }, 10000);
}

function handleSocketConnection(socket) {
  socket.on("message", async (message) => {
    const data = JSON.parse(message);
    if (data.type === "cashout") {
      socket.send(JSON.stringify({ type: "cashout_received", ...data }));
    }
  });
}

module.exports = { startGame, handleSocketConnection };
