import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from '../cards/entities/card.entity';
import { CreateCommentDto, UpdateCommentDto } from './dtos';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentrepository: Repository<Comment>,
    @InjectRepository(Card)
    private readonly cardrepository: Repository<Card>,
  ) {}

  async createComment(
    userId: string,
    dto: CreateCommentDto,
    cardId: string,
  ): Promise<Comment> {
    const card = await this.cardrepository.findOne({ id: cardId });

    if (!card) {
      throw new NotFoundException('Card not found');
    }
    const comment = this.commentrepository.create({
      ...dto,
      userId,
      cardId,
    });
    return this.commentrepository.save(comment);
  }

  async updateComment(
    commentId: string,
    dto: UpdateCommentDto,
  ): Promise<Comment> {
    const comment = await this.commentrepository.findOne({ id: commentId });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    comment.comment = dto.comment;
    return this.commentrepository.save(comment);
  }

  async getComments(cardId: string): Promise<Comment[]> {
    const card = await this.cardrepository.findOne({ id: cardId });
    if (!card) {
      throw new NotFoundException('Card not found');
    }
    return this.commentrepository.find({ cardId });
  }

  async deleteComment(
    userId: string,
    commentId: string,
  ): Promise<{ message: string }> {
    const comment = await this.commentrepository.findOne({
      id: commentId,
      userId,
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    await this.commentrepository.remove(comment);

    return { message: 'Comment deleted' };
  }
}
