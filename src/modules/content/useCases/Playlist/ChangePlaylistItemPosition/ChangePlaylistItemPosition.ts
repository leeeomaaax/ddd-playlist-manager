import { UseCase } from '../../../../../shared/core/UseCase';
import { ChangePlaylistItemPositionDTO } from './ChangePlaylistItemPositionDTO';
import * as ChangePlaylistItemPositionErrors from './ChangePlaylistItemPositionErrors';
import { Either, left, right } from '../../../../../shared/core/Result';
import { UniqueEntityId } from '../../../../../shared/domain/UniqueEntityId';
import { PlaylistRepoInterface } from '../../../repos/PlaylistRepoInterface';
import { PlaylistItemMap } from '../../../mappers/PlaylistItemMap';
import { PlaylistItemDTO } from '../../../dtos/PlaylistItemDTO';

type PossibleErrors =
  | ChangePlaylistItemPositionErrors.DatabaseError
  | ChangePlaylistItemPositionErrors.InvalidPlaylistItemId
  | ChangePlaylistItemPositionErrors.InvalidPlaylistId
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

    return right(undefined);
  }
}
