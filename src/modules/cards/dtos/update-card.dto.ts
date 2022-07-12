import { IsOptional } from 'class-validator';

export class UpdateCardDto {
  @IsOptional()
  title: string;

  @IsOptional()
  description: string;
}
