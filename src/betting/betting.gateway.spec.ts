import { Test, TestingModule } from '@nestjs/testing';
import { BettingGateway } from './betting.gateway';
import { BettingService } from './betting.service';

describe('BettingGateway', () => {
  let gateway: BettingGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BettingGateway, BettingService],
    }).compile();

    gateway = module.get<BettingGateway>(BettingGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
