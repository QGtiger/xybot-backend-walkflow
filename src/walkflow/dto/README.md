在 NestJS 中结合 `class-validator` 对 JSON 结构进行自定义校验，可以通过以下步骤实现：

---

### 1. **定义自定义校验装饰器**

创建校验规则，确保 `schema` 字段符合 `SchemaV1` 接口结构：

```typescript
// src/decorators/is-schema-v1.decorator.ts
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsSchemaV1(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isSchemaV1',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          // 1. 基础类型校验：必须是对象
          if (typeof value !== 'object' || value === null) {
            return false;
          }

          // 2. 校验必填字段 screenshotUrl
          if (typeof value.screenshotUrl !== 'string' || !value.screenshotUrl) {
            return false;
          }

          // 3. 校验 clicks 数组
          if (!Array.isArray(value.clicks)) {
            return false;
          }

          // 4. 遍历 clicks 中的每个对象
          for (const click of value.clicks) {
            const requiredKeys = [
              'x',
              'y',
              'w',
              'h',
              't',
              'innerText',
              'screenshotUrl',
            ];
            // 检查必填字段是否存在且类型正确
            if (
              !requiredKeys.every((key) => key in click) ||
              typeof click.x !== 'number' ||
              typeof click.y !== 'number' ||
              typeof click.w !== 'number' ||
              typeof click.h !== 'number' ||
              typeof click.t !== 'number' ||
              typeof click.innerText !== 'string' ||
              typeof click.screenshotUrl !== 'string'
            ) {
              return false;
            }
          }

          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `字段 ${args.property} 必须符合 SchemaV1 结构`;
        },
      },
    });
  };
}
```

---

### 2. **在 DTO 中使用自定义校验**

为 `schema` 字段应用校验：

```typescript
import { IsNotEmpty, Validate } from 'class-validator';
import { IsSchemaV1 } from '../decorators/is-schema-v1.decorator';

interface SchemaV1 {
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
  @IsNotEmpty({ message: '用户ID不能为空' })
  userId: string;

  @Validate(IsSchemaV1, {
    message: (args) => {
      // 动态错误消息（可选）
      const errors = [];
      const schema = args.value;

      if (!schema?.screenshotUrl) {
        errors.push('screenshotUrl 不能为空');
      }
      if (!Array.isArray(schema?.clicks)) {
        errors.push('clicks 必须是数组');
      } else {
        schema.clicks.forEach((click, index) => {
          if (!click.screenshotUrl) {
            errors.push(`clicks[${index}].screenshotUrl 不能为空`);
          }
        });
      }

      return errors.join('; ');
    },
  })
  schema: SchemaV1;
}
```

---

### 3. **增强校验（可选）**

若需要更细粒度的校验（例如字段类型、范围），可结合其他装饰器：

```typescript
import { IsNumber, IsString, IsArray, ValidateNested } from 'class-validator';

class ClickValidator {
  @IsNumber()
  x: number;

  @IsNumber()
  y: number;

  @IsNumber()
  w: number;

  @IsNumber()
  h: number;

  @IsNumber()
  t: number;

  @IsString()
  innerText: string;

  @IsString()
  screenshotUrl: string;
}

class SchemaV1Validator {
  @IsString()
  screenshotUrl: string;

  @IsArray()
  @ValidateNested({ each: true })
  clicks: ClickValidator[];
}

export class CreateUserWalkflowDto {
  @IsNotEmpty({ message: '用户ID不能为空' })
  userId: string;

  @ValidateNested()
  schema: SchemaV1Validator;
}
```

---

### 4. **全局启用校验**

在 `main.ts` 中启用 NestJS 的全局管道：

```typescript
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(3000);
}
```

---

### 关键点说明

| 方法                | 适用场景                       | 优点                         | 缺点           |
| ------------------- | ------------------------------ | ---------------------------- | -------------- |
| **自定义装饰器**    | 复杂嵌套结构的快速校验         | 灵活控制校验逻辑             | 代码量较大     |
| **嵌套类 + 装饰器** | 需要字段级校验（如类型、范围） | 可复用、清晰的字段级错误提示 | 需定义多个子类 |
| **混合使用**        | 平衡灵活性和校验粒度           | 兼顾两种方案优势             | 配置复杂度稍高 |

---

### 错误示例

当校验失败时，返回的错误信息示例：

```json
{
  "statusCode": 400,
  "message": [
    "字段 schema 必须符合 SchemaV1 结构; clicks[0].screenshotUrl 不能为空"
  ],
  "error": "Bad Request"
}
```

---

通过以上方法，可以实现对 JSON 结构的精细化校验，确保数据符合业务要求的格式和内容。
