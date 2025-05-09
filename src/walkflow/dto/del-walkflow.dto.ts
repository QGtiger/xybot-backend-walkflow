import { IsNotEmpty } from 'class-validator';

export class DelUserWalkflowDto {
  @IsNotEmpty()
  flowId: string;
}
