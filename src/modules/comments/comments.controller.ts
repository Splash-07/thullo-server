import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetCurrentUser } from '../../common/decorators';
import { AuthenticatedGuard } from '../../common/guards';
import { User } from '../users/entities/user.entity';
import { CommentsService } from './comments.service';
import { CreateCommentDto, UpdateCommentDto } from './dtos';
import { Comment } from './entities/comment.entity';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(AuthenticatedGuard)
  @Post(':cardId')
  createComment(
    @GetCurrentUser() user: User,
    @Body() dto: CreateCommentDto,
    @Param('cardId') cardId: string,
  ): Promise<Comment> {
    return this.commentsService.createComment(user.id, dto, cardId);
  }

  @UseGuards(AuthenticatedGuard)
  @Patch(':commentId')
  updateComment(
    @Param('commentId') commentId: string,
    @Body() dto: UpdateCommentDto,
  ): Promise<Comment> {
    return this.commentsService.updateComment(commentId, dto);
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':cardId')
  getComments(@Param('cardId') cardId: string): Promise<Comment[]> {
    return this.commentsService.getComments(cardId);
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':commentId')
  deleteComment(
    @GetCurrentUser() user: User,
    @Param('commentId') commentId: string,
  ): Promise<{ message: string }> {
    return this.commentsService.deleteComment(user.id, commentId);
  }
}
