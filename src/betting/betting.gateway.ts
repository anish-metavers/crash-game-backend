import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { BettingService } from './betting.service';
import { CreateBettingDto } from './dto/create-betting.dto';
import { UpdateBettingDto } from './dto/update-betting.dto';

@WebSocketGateway()
export class BettingGateway {
  constructor(private readonly bettingService: BettingService) {}

  @SubscribeMessage('createBetting')
  create(@MessageBody() createBettingDto: CreateBettingDto) {
    return this.bettingService.create(createBettingDto);
  }

  @SubscribeMessage('findAllBetting')
  findAll() {
    return this.bettingService.findAll();
  }

  @SubscribeMessage('findOneBetting')
  findOne(@MessageBody() id: number) {
    return this.bettingService.findOne(id);
  }

  @SubscribeMessage('updateBetting')
  update(@MessageBody() updateBettingDto: UpdateBettingDto) {
    return this.bettingService.update(updateBettingDto.id, updateBettingDto);
  }

  @SubscribeMessage('removeBetting')
  remove(@MessageBody() id: number) {
    return this.bettingService.remove(id);
  }
}
