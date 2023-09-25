import {
  Controller,
  Post,
  Body,
  UseFilters,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BetService } from './bet.service';
import { CreateBetDto } from './dto/create-bet.dto';
import { HttpExceptionFilter } from 'exception/httpExceptionFilter';
import { AuthGuard } from 'guard/authGuard';
@Controller('bet')
@UseFilters(HttpExceptionFilter)
export class BetController {
  constructor(private readonly betService: BetService) {}

  @UseGuards(AuthGuard)
  @Post('/create')
  create(@Body() createBetDto: CreateBetDto, @Req() req: Request) {
    return this.betService.createBet(req, createBetDto);
  }

  @UseGuards(AuthGuard)
  @Post('/crash-out')
  crashOut(@Req() req: Request) {
    return this.betService.crashOut(req);
  }
}
