import { UseCaseError } from '../../../../../shared/core/UseCaseError';
import { Result } from '../../../../../shared/core/Result';

export class NameIsRequired extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: 'Name is required',
    } as UseCaseError);
  }
}

export class DatabaseError extends Result<UseCaseError> {
  constructor(msg: string) {
    super(false, {
      message: `Database error: ${msg}`,
    } as UseCaseError);
  }
}
