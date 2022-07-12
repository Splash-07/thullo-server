import { Board } from '../../boards/entities/board.entity';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Card } from '../../cards/entities/card.entity';

@Entity()
export class List extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  boardId: string;

  @Column({ default: 0 })
  position: number;

  @ManyToOne(() => Board, (board) => board.lists, { onDelete: 'CASCADE' })
  board: Board;

  @OneToMany(() => Card, (card) => card.list)
  cards: Card[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
