import { UseCase } from '../../../../../shared/core/UseCase';
import { AddItemToPlaylistDTO } from './AddItemToPlaylistDTO';
import * as AddItemToPlaylistErrors from './AddItemToPlaylistErrors';
import { Either, left, right } from '../../../../../shared/core/Result';
import { UniqueEntityId } from '../../../../../shared/domain/UniqueEntityId';
import { PlaylistRepoInterface } from '../../../repos/PlaylistRepoInterface';
import { PlaylistItem } from '../../../domain/PlaylistItem';

type PossibleErrors =
  | AddItemToPlaylistErrors.DatabaseError
  | AddItemToPlaylistErrors.EpisodeNotFound
  | AddItemToPlaylistErrors.InvalidEpisodeId
  | AddItemToPlaylistErrors.InvalidPlaylistId
  | AddItemToPlaylistErrors.PlaylistNotFound
  | AddItemToPlaylistErrors.PodcastNotFound
  | AddItemToPlaylistErrors.CannotAddItemToDynamicPlaylist;

type Response = Either<PossibleErrors, void>;

export class AddItemToPlaylist
  implements UseCase<AddItemToPlaylistDTO, Promise<Response>>
{
  private repo: PlaylistRepoInterface;

  constructor(repo: PlaylistRepoInterface) {
    this.repo = repo;
  }

  async execute(request: AddItemToPlaylistDTO): Promise<Response> {
    let playlistId: UniqueEntityId;
    try {
      playlistId = UniqueEntityId.create(request.playlistId);
    } catch (e) {
      return left(new AddItemToPlaylistErrors.InvalidPlaylistId());
    }

    let episodeId: UniqueEntityId;
    try {
      episodeId = UniqueEntityId.create(request.episodeId);
    } catch (e) {
      return left(new AddItemToPlaylistErrors.InvalidEpisodeId());
    }

    const playlistOrError = await this.repo.findPlaylistById(playlistId);

    if (playlistOrError.isFailure) {
      return left(
        new AddItemToPlaylistErrors.DatabaseError(
          playlistOrError.error as string,
        ),
      );
    }
    const playlist = playlistOrError.getValue();
    if (playlist === null) {
      return left(new AddItemToPlaylistErrors.PlaylistNotFound());
    }

    if (playlist.dynamic) {
      return left(new AddItemToPlaylistErrors.CannotAddItemToDynamicPlaylist());
    }

    // leaving this here as an example of more validation that should be made in a production ready app
    // let episode: Episode | null;
    // try {
    //   episode = await this.episodeRepo.findById(episodeId, request.profile);
    // } catch (e) {
    //   return left(new AddItemToPlaylistErrors.DatabaseError(e as string));
    // }
    // if (!episode) {
    //   return left(new AddItemToPlaylistErrors.EpisodeNotFound());
    // }

    // let podcast: Podcast | null;
    // try {
    //   podcast = await this.podcastRepo.findById(episode.podcast);
    // } catch (e) {
    //   return left(new AddItemToPlaylistErrors.DatabaseError(e as string));
    // }
    // if (!podcast) {
    //   return left(new AddItemToPlaylistErrors.PodcastNotFound());
    // }

    const positionOrError = await this.repo.getNextPosition(playlistId);
    if (positionOrError.isFailure) {
      return left(
        new AddItemToPlaylistErrors.DatabaseError(
          positionOrError.error as string,
        ),
      );
    }
    const position = positionOrError.getValue();

    const item = PlaylistItem.create({
      playlistId,
      episodeId,
      position,
    });

    const resOrError = await this.repo.saveItem(item);

    if (resOrError.isFailure) {
      return left(
        new AddItemToPlaylistErrors.DatabaseError(resOrError.error as string),
      );
    }

    return right(undefined);
  }
}
