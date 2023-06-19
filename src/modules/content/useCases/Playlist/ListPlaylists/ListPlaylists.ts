import { UseCase } from '../../../../../shared/core/UseCase';
import { ListPlaylistsDTO } from './ListPlaylistsDTO';
import * as ListPlaylistsErrors from './ListPlaylistsErrors';
import { Either, left, right } from '../../../../../shared/core/Result';
import { PlaylistRepoInterface } from '../../../repos/PlaylistRepoInterface';
import { PlaylistMap } from '../../../mappers/PlaylistMap';
import { PlaylistDTO } from '../../../dtos/PlaylistDTO';
import { PaginationPage } from '../../../../../shared/domain/PaginationPage';

const PAGE_SIZE = 100;

type PossibleErrors =
  | ListPlaylistsErrors.DatabaseError
  | ListPlaylistsErrors.InvalidPage;

type Response = Either<PossibleErrors, PlaylistDTO[]>;

export class ListPlaylists
  implements UseCase<ListPlaylistsDTO, Promise<Response>>
{
  private repo: PlaylistRepoInterface;

  constructor(repo: PlaylistRepoInterface) {
    this.repo = repo;
  }

  async execute(request: ListPlaylistsDTO): Promise<Response> {
    const pageOrError = PaginationPage.create(request.page);
    if (pageOrError.isFailure) {
      return left(new ListPlaylistsErrors.InvalidPage());
    }
    const page = pageOrError.getValue();
    const offset = page.offset(PAGE_SIZE);

    const playlistsOrError = await this.repo.listPlaylists(offset, PAGE_SIZE);

    if (playlistsOrError.isFailure) {
      return left(
        new ListPlaylistsErrors.DatabaseError(playlistsOrError.error as string),
      );
    }

    const playlists = playlistsOrError.getValue();

    return right(playlists.map(PlaylistMap.toPlaylistDTO));
  }
}
