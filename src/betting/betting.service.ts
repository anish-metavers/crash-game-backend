import { Injectable } from '@nestjs/common';
import { CreateBettingDto } from './dto/create-betting.dto';
import { UpdateBettingDto } from './dto/update-betting.dto';

@Injectable()
export class BettingService {
  create(createBettingDto: CreateBettingDto) {
    return 'This action adds a new betting';
  }

  findAll() {
    return `This action returns all betting`;
  }

  findOne(id: number) {
    return `This action returns a #${id} betting`;
  }

  update(id: number, updateBettingDto: UpdateBettingDto) {
    return `This action updates a #${id} betting`;
  }

  remove(id: number) {
    return `This action removes a #${id} betting`;
  }
}
