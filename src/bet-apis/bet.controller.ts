import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  UseFilters,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BetService } from './bet.service';
import { CreateBetDto } from './dto/create-bet.dto';
import { UpdateBetDto } from './dto/update-bet.dto';
import { HttpExceptionFilter } from 'exception/httpExceptionFilter';
import { AuthGuard } from 'guard/authGuard';

@Controller('bet')
@UseFilters(HttpExceptionFilter)
export class BetController {
  constructor(private readonly betService: BetService) {}

  @UseGuards(AuthGuard)
  @Post('/create')
  create(@Body() createBetDto: CreateBetDto, @Req() req: Request) {
    return this.betService.create(req, createBetDto);
  }

  // @Get()
  // findAll() {
  //   return this.betService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.betService.findOne(+id);
  // }

  // @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBetDto: UpdateBetDto,
    @Req() req: Request,
  ) {
    return this.betService.update(id, updateBetDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.betService.remove(+id);
  // }
}
