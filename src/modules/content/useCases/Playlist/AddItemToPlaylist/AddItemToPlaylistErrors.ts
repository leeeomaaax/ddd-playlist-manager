import { UseCaseError } from '../../../../../shared/core/UseCaseError'
import { Result } from '../../../../../shared/core/Result'

export class InvalidPlaylistId extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: 'Invalid playlist ID',
    } as UseCaseError)
  }
}

export class InvalidEpisodeId extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: 'Invalid episode ID',
    } as UseCaseError)
  }
}

export class PlaylistNotFound extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: 'Playlist not found',
    } as UseCaseError)
  }
}

export class EpisodeNotFound extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: 'Episode not found',
    } as UseCaseError)
  }
}

export class PodcastNotFound extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: 'Podcast not found',
    } as UseCaseError)
  }
}

export class DatabaseError extends Result<UseCaseError> {
  constructor(msg: string) {
    super(false, {
      message: `Database error: ${msg}`,
    } as UseCaseError)
  }
}

export class CannotAddItemToDynamicPlaylist extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: 'Cannot add item to dynamic playlist',
    } as UseCaseError)
  }
}
