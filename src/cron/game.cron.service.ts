import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
// const CryptoJS = require('crypto-js');

@Injectable()
export class GameCronService {
  private readonly logger = new Logger(GameCronService.name);

  @Cron('*/1 * * * * *')
  handleCron() {
    // try {
    //   function gameResultGenrator() {
    //     const gameAmountInput = 100;
    //     const gameHashInput =
    //       '81d28271c1b24ca64e9e103f300a7fc17b4e2494a84f041440b6ee99f5c2134e';
    //     const gameSaltInput =
    //       '0000000000000000000301e2801a9a9598bfb114e574a91a887f2132f33047e6';
    //     let prevHash = null;
    //     for (let i = 0; i < gameAmountInput; i++) {
    //       let hash = String(
    //         prevHash ? CryptoJS.SHA256(String(prevHash)) : gameHashInput,
    //       );
    //       console.log(hash);
    //       gameResult(hash, gameSaltInput);
    //       prevHash = hash;
    //     }
    //     // console.log('Games verification completed.');
    //   }
    //   function gameResult(seed, salt) {
    //     const nBits = 52; // number of most significant bits to use
    //     if (salt) {
    //       const hmac = CryptoJS.HmacSHA256(CryptoJS.enc.Hex.parse(seed), salt);
    //       seed = hmac.toString(CryptoJS.enc.Hex);
    //     }
    //     seed = seed.slice(0, nBits / 4);
    //     const r = parseInt(seed, 16);
    //     let X = r / Math.pow(2, nBits);
    //     X = parseFloat(X.toPrecision(9));
    //     X = 99 / (1 - X);
    //     const result = Math.floor(X);
    //     console.log(Math.max(1, result / 100));
    //     return Math.max(1, result / 100);
    //   }
    //   gameResultGenrator();
    //   this.logger.debug('Called when the current second is 1');
    // } catch (error) {
    //   console.log(error);
    // }
  }
}
