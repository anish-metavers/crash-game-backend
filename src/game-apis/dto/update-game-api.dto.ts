import { PartialType } from '@nestjs/mapped-types';
import { CreateGameApiDto } from './create-game-api.dto';

export class UpdateGameApiDto extends PartialType(CreateGameApiDto) {
    gameId: string;
    wallId: string;
    gameCrashNumber: number;
    
}
