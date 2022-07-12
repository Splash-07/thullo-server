import { IsNotEmpty } from 'class-validator';

export type Privacy = 'PRIVATE' | 'PUBLIC';

export class CreateBoardDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  privacy: Privacy;
}
