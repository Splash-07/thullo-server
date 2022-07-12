import { IsNotEmpty } from 'class-validator';

export class UpdateListDto {
  @IsNotEmpty()
  title: string;
}
