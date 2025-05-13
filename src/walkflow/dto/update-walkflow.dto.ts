import { IsNotEmpty, Validate } from 'class-validator';
import { QueryWalkflowDto } from './query-walkflow.dto';

export class UpdateWalkflowDto extends QueryWalkflowDto {
  name?: string;

  schema?: FlowSchemaV1;
}
