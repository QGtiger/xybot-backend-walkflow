import { IsNotEmpty, Validate } from 'class-validator';
import { IsSchemaV1 } from 'src/decorators/is-schema-v1.decorator';

export interface ExtensionSchemaV1 {
  screenshotUrl: string;
  clicks: {
    x: number;
    y: number;
    w: number;
    h: number;
    t: number;
    innerText: string;
    screenshotUrl: string;
  }[];
}

export class CreateUserWalkflowDto {
  @IsSchemaV1()
  schema: ExtensionSchemaV1;
}
