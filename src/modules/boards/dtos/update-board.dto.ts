import { IsOptional } from 'class-validator';

export class UpdateBoardDto {
  @IsOptional()
  title: string;

  @IsOptional()
  background: string;
}
