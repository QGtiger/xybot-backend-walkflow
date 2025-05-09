import { IsNotEmpty } from 'class-validator';

export class QueryWalkflowDto {
  @IsNotEmpty({
    message: 'walkflow id不能为空',
  })
  flowId: string;
}
