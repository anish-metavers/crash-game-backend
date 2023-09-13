import { Test, TestingModule } from '@nestjs/testing';
import { GameApisController } from './game-apis.controller';
import { GameApisService } from './game-apis.service';

describe('GameApisController', () => {
  let controller: GameApisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameApisController],
      providers: [GameApisService],
    }).compile();

    controller = module.get<GameApisController>(GameApisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
