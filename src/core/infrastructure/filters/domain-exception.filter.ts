import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import {
  DomainException,
  ValidationException,
  BusinessRuleViolationException,
  EntityNotFoundException,
} from '../../domain/exceptions/domain.exception';

/**
 * Global Exception Filter for Domain Exceptions
 *
 * Translates domain exceptions to appropriate HTTP responses
 */
@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof ValidationException) {
      status = HttpStatus.BAD_REQUEST;
    } else if (exception instanceof BusinessRuleViolationException) {
      status = HttpStatus.UNPROCESSABLE_ENTITY;
    } else if (exception instanceof EntityNotFoundException) {
      status = HttpStatus.NOT_FOUND;
    }

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      error: exception.name,
      timestamp: new Date().toISOString(),
    });
  }
}
