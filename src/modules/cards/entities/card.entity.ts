import { List } from '../../lists/entities/list.entity';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Comment } from '../../comments/entities/comment.entity';

@Entity()
export class Card extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ default: '' })
  description: string;

  @Column()
  listId: string;

  @Column({ default: 0 })
  position: number;

  @ManyToOne(() => List, (list) => list.cards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'listId' })
  list: List;

  @OneToMany(() => Comment, (comment) => comment.card)
  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
