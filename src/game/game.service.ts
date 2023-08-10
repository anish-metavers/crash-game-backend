import { Injectable } from '@nestjs/common';
import { ConnectedSocket } from '@nestjs/websockets';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Socket } from 'socket.io';
@Injectable()
export class GameService {
  joinGame(@ConnectedSocket() socket: Socket) {
    socket.emit('alsdfjklaskdjf', { data: 'asdflkjlaksdjflkasjd' });
    return { message: 'Game server create successfully' };
  }

  // findAll() {
  //   return `This action returns all game`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} game`;
  // }

  // update(id: number, updateGameDto: UpdateGameDto) {
  //   return `This action updates a #${id} game`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} game`;
  // }
}
