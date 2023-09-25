const CryptoJS = require('crypto-js');
let resultx = [];
let hashx = [];
let multipliers = 1
let serverSpeed = 0.00001
let lastTime = Date.now();
let id = 0;
let countdownTimer = null

const gameLoop = async () => {
  let now = Date.now();
  let deltaTime = (now - lastTime) / 1000; // in seconds
  lastTime = now;
  deltaTime = deltaTime * 30;
  serverSpeed = serverSpeed + 0.0001

  multipliers = multipliers + serverSpeed;
  
  // serverSpeed = serverSpeed + (serverSpeed / (200 * 4)) * deltaTime;
  console.log(multipliers.toFixed(2) , "crash at", resultx[id]);
  // Reset game if crashed
  if (multipliers >= resultx[id]) {
    let data = resultx[id];
    gameStatus = 0;

    console.log("crashed at", multipliers);
    console.log("hash value", hashx[id]);
    multipliers = 1.0;

    console.log("this is id", id);
    serverSpeed = 0.0014;

    // Stop the game loop temporarily
    clearTimeout(countdownTimer);
   
    id = id + 1;
    let bettingTime = 10;
    gameStatus = 1;
    data = 0;
  
    normalBet = [];
    countdownTimer = setInterval(() => {
      console.log(`Resuming game in ${bettingTime} seconds...`);
      bettingTime--;
      if (bettingTime === 0) {
        clearInterval(countdownTimer);
        gameStatus = 2;
       
        gameLoop(); // Resume the game loop after the countdown
      }
    }, 1000);
  } else {
    setTimeout(gameLoop, 1000/15); // 15 frames per second
  }
};

const gameResultGenrator = async () => {
  const gameAmountInput = 100;
  const gameHashInput = "exampledssdhash";
  const gameSaltInput = "exampefrflesalt";
  let prevHash = null;
  for (let i = 0; i < gameAmountInput; i++) {
    let hash = String(
      prevHash ? CryptoJS.SHA256(String(prevHash)) : gameHashInput
    );
    hashx.push(hash);
    gameResult(hash, gameSaltInput);
    prevHash = hash;
  }
  resultx = resultx.reverse();
  hashx = hashx.reverse();
  console.log("Game hash data", hashx);
  console.log("Game data", resultx);
  gameLoop()
};


const gameResult = (seed, salt) => {
  const nBits = 52; // number of most significant bits to use
  if (salt) {
    const hmac = CryptoJS.HmacSHA256(CryptoJS.enc.Hex.parse(seed), salt);
    seed = hmac.toString(CryptoJS.enc.Hex);
  }
  seed = seed.slice(0, nBits / 4);
  const r = parseInt(seed, 16);
  let X = r / Math.pow(2, nBits);
  X = parseFloat(X.toPrecision(9));
  X = 99 / (1 - X);
  const result = Math.floor(X);
  // console.log(Math.max(1, result / 100));
  resultx.push(Math.max(1, result / 100));
  // resultx.push(2);
  return Math.max(1, result / 100);
};
gameResultGenrator()

const cashOut = async (userId) => {
  // Find the user's bet in the normalBet array
  const userBetIndex = normalBet.findIndex(
    (bet) => bet.userId.userId === userId
  );
  // If the user is found and has not cashed out yet
  if (userBetIndex !== -1) {
    const userBet = normalBet[userBetIndex];
    // Calculate the cashed out amount (for simplicity, let's assume it's the amount multiplied by the current multiplier)
    const cashedOutAmount = userBet.userId.amount * multipliers;
    // Remove the user's bet from the normalBet array
    normalBet.splice(userBetIndex, 1);
    const testDb = `${userBet.userId.name} cash out at ${multipliers.toFixed(
      2
    )}X`;
    (userBet.userId.cashOut = true),
      (userBet.userId.cashOutAmount = cashedOutAmount);
    userBet.userId.cashOutAt = multipliers;
    await betHistoryModal.updateOne(
      { betId: userBet.userId.betId },
      { $set: { profitAmount: cashedOutAmount, profit: true } }
    );
    const fieldToUpdate = `balance.$[element].balance`;
    const updateValue = {};
    updateValue[fieldToUpdate] = cashedOutAmount.toFixed(2);
    console.log("update value", updateValue);
    await userModal.findByIdAndUpdate(
      userBet.userId.userId,
      {
        $inc: updateValue,
      },
      {
        arrayFilters: [{ "element.currencyId": Number(userBet.userId.coinId) }],
        new: true,
      }
    );
    // Emit an event to notify all clients that the user has cashed out
    ioInstance.emit("testSocket", { testDb, userBet });
    const obj = {
      succes: true,
      cashOutAmount: cashedOutAmount,
      coinId: userBet.userId.coinId,
    };
    return obj;
    // TODO: You might want to update the user's balance or perform other related tasks here
  } else {
    // Handle the case where the user is not found or has already cashed out
    console.error(
      `User with ID ${userId} not found or has already cashed out.`
    );
    const obj = {
      succes: false,
    };
    return obj;
  }
};

