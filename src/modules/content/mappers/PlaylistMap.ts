import { Playlist } from '../domain/Playlist';
import { PlaylistDTO } from '../dtos/PlaylistDTO';
import { PlaylistsPersistenceSchema } from '../../../shared/infra/database/models/playlists';
import { DateClass } from '../../../shared/domain/DateClass';
import { UniqueEntityId } from '../../../shared/domain/UniqueEntityId';
import { Name } from '../../../shared/domain/Name';
import { Result } from '../../../shared/core/Result';

export class PlaylistMap {
  static toPlaylistDomain(raw: PlaylistsPersistenceSchema): Result<Playlist> {
    try {
      const id = UniqueEntityId.createOrUndefined(raw._id);
      const title = Name.create(raw.title);
      if (title.isFailure) {
        return Result.fail<Playlist>('Could not parse playlist title');
      }

      const createdAt = DateClass.fromPersistence(raw.createdAt);
      if (createdAt.isFailure) {
        return Result.fail<Playlist>('Could not parse playlist creation day');
      }

      const playlist = Playlist.restore(
        {
          title: title.getValue(),
          createdAt: createdAt.getValue(),
          dynamic: raw.dynamic,
          isActive: true,
        },
        id,
      );
      return Result.ok<Playlist>(playlist);
    } catch (e: any) {
      return Result.fail<Playlist>(
        `Could not parse body in toPlaylistDomain. Error: ${e.message}`,
      );
    }
  }

  static toPlaylistPersistence(playlist: Playlist): PlaylistsPersistenceSchema {
    return {
      title: playlist.title.toString(),
      createdAt: playlist.createdAt.toPersistence(),
      dynamic: playlist.dynamic,
      isActive: playlist.isActive,
    };
  }

  static toPlaylistDTO(playlist: Playlist): PlaylistDTO {
    return {
      playlistId: playlist.playlistId.toString(),
      title: playlist.title.toString(),
      createdAt: playlist.createdAt.toDTO(),
      dynamic: playlist.dynamic,
    };
  }
}
