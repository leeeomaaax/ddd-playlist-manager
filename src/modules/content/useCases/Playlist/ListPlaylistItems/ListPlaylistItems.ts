import { UseCase } from '../../../../../shared/core/UseCase';
import { ListPlaylistItemsDTO } from './ListPlaylistItemsDTO';
import * as ListPlaylistItemsErrors from './ListPlaylistItemsErrors';
import { Either, left, right } from '../../../../../shared/core/Result';
import { UniqueEntityId } from '../../../../../shared/domain/UniqueEntityId';
import { PaginationPage } from '../../../../../shared/domain/PaginationPage';
import { PlaylistRepoInterface } from '../../../repos/PlaylistRepoInterface';
import { PlaylistItemMap } from '../../../mappers/PlaylistItemMap';
import { PlaylistItemDTO } from '../../../dtos/PlaylistItemDTO';

type PossibleErrors =
  | ListPlaylistItemsErrors.DatabaseError
  | ListPlaylistItemsErrors.InvalidPage
  | ListPlaylistItemsErrors.InvalidPlaylistId
  | ListPlaylistItemsErrors.EpisodeOrPodcastNotFound;

type Response = Either<PossibleErrors, PlaylistItemDTO[]>;

export class ListPlaylistItems
  implements UseCase<ListPlaylistItemsDTO, Promise<Response>>
{
  private repo: PlaylistRepoInterface;

  constructor(repo: PlaylistRepoInterface) {
    this.repo = repo;
  }

  async execute(request: ListPlaylistItemsDTO): Promise<Response> {
    let playlistId: UniqueEntityId;
    try {
      playlistId = UniqueEntityId.create(request.playlistId);
    } catch (e) {
      return left(new ListPlaylistItemsErrors.InvalidPlaylistId());
    }

    const pageOrError = PaginationPage.create(request.page);
    if (pageOrError.isFailure) {
      return left(new ListPlaylistItemsErrors.InvalidPage());
    }
    const pageSize = 100;
    const page = pageOrError.getValue();
    const offset = page.offset(pageSize);

    const itemsOrError = await this.repo.listItems(
      offset,
      pageSize,
      playlistId,
    );

    if (itemsOrError.isFailure) {
      return left(
        new ListPlaylistItemsErrors.DatabaseError(itemsOrError.error as string),
      );
    }

    const items = itemsOrError.getValue();

    return right(items.map(PlaylistItemMap.toDTO));
  }
}
