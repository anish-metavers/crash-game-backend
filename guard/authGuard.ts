// import {
//     Injectable,
//     CanActivate,
//     ExecutionContext,
//     HttpException,
//   } from '@nestjs/common';
//   import * as jwt from 'jsonwebtoken';
  
//   @Injectable()
//   export class AuthGuard implements CanActivate {
//     async canActivate(context: ExecutionContext) {
//       const req = context.switchToHttp().getRequest();
//       let token = null;
//       if (
//         req.headers.authorization &&
//         req.headers.authorization.startsWith('Bearer')
//       ) {
//         token = req.headers.authorization.split(' ')[1];
//       }
//       if (!token) {
//         throw new HttpException(
//           {
//             message: 'No token found',
//             statusCode: 401,
//           },
//           401,
//         );
//       }
//       let userid: number;
//       try {
//         const decoded = jwt.verify(token, 'secret');
//         userid = decoded.userid;
//       } catch (error) {
//         throw new HttpException(
//           {
//             message: 'Invalid token',
//             statusCode: 401,
//           },
//           401,
//         );
//       }
  
//       const AerospikeClient = Aerospike.client({
//         hosts: [
//           {
//             addr: 'localhost',
//             port: Number(3000),
//           },
//         ],
//       });
  
//       const client = await AerospikeClient.connect();
  
//       const aeroKey = new Aerospike.Key('test', 'helperuser', userid);
  
//       let exists = await client.exists(aeroKey);
  
//       if (!exists) {
//         throw new HttpException({ message: 'No User Found' }, 404);
//       }
  
//       let record = await client.get(aeroKey);
  
//       if (!record)
//         throw new HttpException(
//           {
//             message: 'No user found',
//             statusCode: 401,
//           },
//           401,
//         );
//       req['user'] = record.bins;
//       return true;
//     }
//   }
  