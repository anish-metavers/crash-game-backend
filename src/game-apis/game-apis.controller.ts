import {
  Controller,
  Get,
  Body,
  Put,
  Param,
  UseFilters,
} from '@nestjs/common';
import { GameApisService } from './game-apis.service';
import { UpdateGameApiDto } from './dto/update-game-api.dto';
import { HttpExceptionFilter } from 'exception/httpExceptionFilter';
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

  @Put(':id')
  update(@Param('id') id: string, @Body() updateGameApiDto: UpdateGameApiDto) {
    return this.gameApisService.updateGameLogic(id, updateGameApiDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.gameApisService.remove(+id);
  // }
}
