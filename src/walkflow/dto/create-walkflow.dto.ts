import { IsNotEmpty, Validate } from 'class-validator';
import { IsSchemaV1 } from '../../decorators/is-schema-v1.decorator';

export class CreateUserWalkflowDto {
  @IsSchemaV1()
  schema: ExtensionSchemaV1;
}
