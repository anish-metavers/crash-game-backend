import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Socket, Server } from 'socket.io';
@WebSocketGateway()
export class GameGateway {
  createSocketGateway(): any {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly gameService: GameService) {}

  @SubscribeMessage('joinRoom')
  create(@ConnectedSocket() socket: Socket) {
    return this.gameService.joinGame(socket);
  }

  @WebSocketServer()
  server: Server;

  getSocketServer() {
    return this.server;
  }

  // @SubscribeMessage('findAllGame')
  // findAll() {
  //   return this.gameService.findAll();
  // }

  // @SubscribeMessage('findOneGame')
  // findOne(@MessageBody() id: number) {
  //   return this.gameService.findOne(id);
  // }

  // @SubscribeMessage('updateGame')
  // update(@MessageBody() updateGameDto: UpdateGameDto) {
  //   return this.gameService.update(updateGameDto.id, updateGameDto);
  // }

  // @SubscribeMessage('removeGame')
  // remove(@MessageBody() id: number) {
  //   return this.gameService.remove(id);
  // }
}
