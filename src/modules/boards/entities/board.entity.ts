import { User } from '../../users/entities/user.entity';
import {
  Entity,
  BaseEntity,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { List } from '../../lists/entities/list.entity';
import { Privacy } from '../dtos';

@Entity()
export class Board extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  title: string;

  @Column()
  privacy: Privacy;

  @Column({ default: '' })
  background: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.boards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => List, (list) => list.board)
  lists: List[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
