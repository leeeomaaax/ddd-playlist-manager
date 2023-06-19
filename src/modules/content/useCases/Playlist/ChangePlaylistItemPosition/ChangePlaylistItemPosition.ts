import { UseCase } from '../../../../../shared/core/UseCase';
import { ChangePlaylistItemPositionDTO } from './ChangePlaylistItemPositionDTO';
import * as ChangePlaylistItemPositionErrors from './ChangePlaylistItemPositionErrors';
import { Either, left, right } from '../../../../../shared/core/Result';
import { UniqueEntityId } from '../../../../../shared/domain/UniqueEntityId';
import { PlaylistRepoInterface } from '../../../repos/PlaylistRepoInterface';
import { ReorderPlaylistItem } from '../../../domain/ReorderPlaylistItem';

type PossibleErrors =
  | ChangePlaylistItemPositionErrors.DatabaseError
  | ChangePlaylistItemPositionErrors.InvalidPlaylistItemId
  | ChangePlaylistItemPositionErrors.InvalidPlaylistId
  | ChangePlaylistItemPositionErrors.PlaylistNotFound
  | ChangePlaylistItemPositionErrors.EpisodeOrPodcastNotFound;

type Response = Either<PossibleErrors, void>;

export class ChangePlaylistItemPosition
  implements UseCase<ChangePlaylistItemPositionDTO, Promise<Response>>
{
  private repo: PlaylistRepoInterface;

  constructor(repo: PlaylistRepoInterface) {
    this.repo = repo;
  }

  async execute(request: ChangePlaylistItemPositionDTO): Promise<Response> {
    let playlistId: UniqueEntityId;
    try {
      playlistId = UniqueEntityId.create(request.playlistId);
    } catch (e) {
      return left(new ChangePlaylistItemPositionErrors.InvalidPlaylistId());
    }

    let itemId: UniqueEntityId;
    try {
      itemId = UniqueEntityId.create(request.itemId);
    } catch (e) {
      return left(new ChangePlaylistItemPositionErrors.InvalidPlaylistItemId());
    }

    if (!Number.isInteger(request.position) || request.position < 0) {
      return left(new ChangePlaylistItemPositionErrors.InvalidPosition());
    }

    const playlistOrError = await this.repo.findPlaylistById(playlistId);
    if (playlistOrError.isFailure) {
      return left(
        new ChangePlaylistItemPositionErrors.DatabaseError(
          playlistOrError.error as string,
        ),
      );
    }
    const playlist = playlistOrError.getValue();
    if (playlist === null) {
      return left(new ChangePlaylistItemPositionErrors.PlaylistNotFound());
    }

    const playlistSizeOrError = await this.repo.getPlaylistSizeById(playlistId);
    if (playlistSizeOrError.isFailure) {
      return left(
        new ChangePlaylistItemPositionErrors.DatabaseError(
          playlistSizeOrError.error as string,
        ),
      );
    }
    const playlistSize = playlistSizeOrError.getValue();

    const itemOrError = await this.repo.findItemById(itemId);
    if (itemOrError.isFailure) {
      return left(
        new ChangePlaylistItemPositionErrors.DatabaseError(
          itemOrError.error as string,
        ),
      );
    }
    const item = itemOrError.getValue();
    if (item === null) {
      return left(new ChangePlaylistItemPositionErrors.PlaylistItemNotFound());
    }

    const reorderPlaylistItemOrError =
      ReorderPlaylistItem.createReorderPlaylistItemAggregate({
        playlistId: playlistId,
        itemId: itemId,
        playlistSize: playlistSize,
        oldPosition: item.position,
        newPosition: request.position,
        isDynamicPlaylist: playlist.dynamic,
      });
    if (reorderPlaylistItemOrError.isFailure) {
      return left(
        new ChangePlaylistItemPositionErrors.ReorderValidationError(
          reorderPlaylistItemOrError.error as string,
        ),
      );
    }
    const reorderPlaylistItemAggregate = reorderPlaylistItemOrError.getValue();

    const resultOrError = await this.repo.saveReorderPlaylistItemAggregate(
      reorderPlaylistItemAggregate,
    );
    if (resultOrError.isFailure) {
      return left(
        new ChangePlaylistItemPositionErrors.DatabaseError(
          resultOrError.error as string,
        ),
      );
    }

    return right(undefined);
  }
}
