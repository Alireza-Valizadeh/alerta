import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}
  transform(value: any) {
    try {
      const parsedVal = this.schema.parse(value);
      return parsedVal;
    } catch (error) {
      console.log({ error });
      if (error instanceof ZodError) {
        const humanReadableErrors = error.issues
          .map((issue) => {
            return `'${issue.path.join('.')}' is ${issue.message.toLowerCase()}`;
          })
          .join(' - ');
        throw new BadRequestException(
          `Validation failed: ${humanReadableErrors}.`,
        );
      }
      console.error('An unexpected validation error occurred:', error);
      throw new BadRequestException(
        'Validation failed due to an unexpected error.',
      );
    }
  }
}
