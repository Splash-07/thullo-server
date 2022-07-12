import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { List } from '../lists/entities/list.entity';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { Card } from './entities/card.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Card, List])],
  controllers: [CardsController],
  providers: [CardsService],
})
export class CardsModule {}
