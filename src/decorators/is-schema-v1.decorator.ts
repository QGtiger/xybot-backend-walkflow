// src/decorators/is-schema-v1.decorator.ts
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsSchemaV1(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
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

          // 2. 校验必填字段 screenRecordingUrl
          if (
            typeof value.screenRecordingUrl !== 'string' ||
            !value.screenRecordingUrl
          ) {
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
