import { UseCase } from '../../../../../shared/core/UseCase';
import { CreatePlaylistDTO } from './CreatePlaylistDTO';
import * as Errors from './CreatePlaylistErrors';
import { Either, left, right } from '../../../../../shared/core/Result';

import { PlaylistRepoInterface } from '../../../repos/PlaylistRepoInterface';
import { Name } from '../../../../../shared/domain/Name';
import { Playlist } from '../../../domain/Playlist';
import { DateClass } from '../../../../../shared/domain/DateClass';

type PossibleErrors =
  | Errors.OwnerNotFound
  | Errors.InvalidOwnerId
  | Errors.NameIsRequired
  | Errors.DatabaseError
  | Errors.InvalidOwnerType;

type Response = Either<PossibleErrors, void>;

export class CreatePlaylist
  implements UseCase<CreatePlaylistDTO, Promise<Response>>
{
  private playlistRepo: PlaylistRepoInterface;

  constructor(playlistRepo: PlaylistRepoInterface) {
    this.playlistRepo = playlistRepo;
  }

  async execute(request: CreatePlaylistDTO): Promise<Response> {
    const nameOrError = Name.create(request.name);

    if (nameOrError.isFailure) {
      return left(new Errors.NameIsRequired());
    }

    const playlist = Playlist.create({
      title: nameOrError.getValue(),
      createdAt: DateClass.now(),
      dynamic: false,
    });

    const resOrError = await this.playlistRepo.save(playlist);

    if (resOrError.isFailure) {
      return left(new Errors.DatabaseError(resOrError.error as string));
    }

    return right(undefined);
  }
}
