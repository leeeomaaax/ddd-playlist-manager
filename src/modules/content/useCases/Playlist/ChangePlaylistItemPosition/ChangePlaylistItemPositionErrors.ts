import { UseCaseError } from '../../../../../shared/core/UseCaseError';
import { Result } from '../../../../../shared/core/Result';

export class InvalidPlaylistId extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: 'Invalid playlist id',
    } as UseCaseError);
  }
}

export class InvalidPlaylistItemId extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: 'Invalid playlist item id',
    } as UseCaseError);
  }
}

export class InvalidPosition extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: 'Invalid position',
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

export class EpisodeOrPodcastNotFound extends Result<UseCaseError> {
  constructor(msg?: string) {
    super(false, {
      message: msg,
    } as UseCaseError);
  }
}
