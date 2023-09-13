import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Post,
  Delete,
  UseGuards,
  UseFilters,
  Req,
} from '@nestjs/common';
import { GameApisService } from './game-apis.service';
import { CreateGameApiDto } from './dto/create-game-api.dto';
import { UpdateGameApiDto } from './dto/update-game-api.dto';
import { HttpExceptionFilter } from 'exception/httpExceptionFilter';
import { AuthGuard } from 'guard/authGuard';

@UseFilters(HttpExceptionFilter)
@Controller('/game')
export class GameApisController {
  constructor(private readonly gameApisService: GameApisService) {}

  //@Post()
  // create(@Body() createGameApiDto: CreateGameApiDto) {
  //   return this.gameApisService.create(createGameApiDto);
  // }

  @Get('/list')
  findAllGameList() {
    return this.gameApisService.findAllGameList();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.gameApisService.findOne(+id);
  // }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGameApiDto: UpdateGameApiDto,
  ) {
    return this.gameApisService.update(+id, updateGameApiDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.gameApisService.remove(+id);
  // }
}
