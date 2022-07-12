import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCardDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  description: string;
}
