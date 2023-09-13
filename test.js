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