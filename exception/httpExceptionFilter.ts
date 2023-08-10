import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
  } from '@nestjs/common';
  import { Response } from 'express';
  // import { ErrorConfig } from 'common-services/utils/config';
  
  @Catch(HttpException)
  export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const status = exception.getStatus();
  
      const resObj = exception.getResponse();
      console.log(resObj);
  
      if (
        !exception.getResponse()['errorCode'] &&
        Array.isArray(exception.getResponse()['message'])
      ) {
        resObj['errorCode'] =
          // ErrorConfig.API_BODY_BASIC_VALIDATION.errorCode;
          // console.log(exception.getResponse()['message']);
          resObj['message'] = exception.getResponse()['message'][0].toString();
      }
      response.status(status).json(
        typeof exception.getResponse() === 'string'
          ? {
              message: exception.getResponse(),
              statusCode: exception.getStatus(),
            }
          : resObj, //exception.getResponse(),
      );
    }
  }
  