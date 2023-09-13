import { Test, TestingModule } from '@nestjs/testing';
import { GameApisService } from './game-apis.service';

describe('GameApisService', () => {
  let service: GameApisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameApisService],
    }).compile();

    service = module.get<GameApisService>(GameApisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
