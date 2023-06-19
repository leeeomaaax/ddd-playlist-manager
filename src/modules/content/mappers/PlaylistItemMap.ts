import { PlaylistItem } from '../domain/PlaylistItem';
import { PlaylistItemDTO } from '../dtos/PlaylistItemDTO';
import { PlaylistsItemsPersistenceSchema } from '../../../shared/infra/database/models/playlistItems';
import { DateClass } from '../../../shared/domain/DateClass';
import { UniqueEntityId } from '../../../shared/domain/UniqueEntityId';
import { Result } from '../../../shared/core/Result';

export class PlaylistItemMap {
  static toDomain(raw: PlaylistsItemsPersistenceSchema): Result<PlaylistItem> {
    const id = UniqueEntityId.createOrUndefined(raw._id);

    const createdAt = DateClass.fromPersistence(raw.createdAt);
    if (createdAt.isFailure) {
      return Result.fail<PlaylistItem>('Could not parse createdAt');
    }

    try {
      const item = PlaylistItem.create(
        {
          createdAt: createdAt.getValue(),
          playlistId: UniqueEntityId.create(raw.playlistId),
          episodeId: UniqueEntityId.create(raw.episodeId),
          position: raw.position,
        },
        id,
      );
      return Result.ok<PlaylistItem>(item);
    } catch (e) {
      return Result.fail<PlaylistItem>('Could not parse body');
    }
  }

  static toPersistence(item: PlaylistItem): PlaylistsItemsPersistenceSchema {
    return {
      createdAt: item.createdAt.toPersistence(),
      playlistId: item.playlistId.toPersistence(),
      episodeId: item.episodeId.toPersistence(),
      position: item.position,
    };
  }

  static toDTO(item: PlaylistItem): PlaylistItemDTO {
    return {
      playlistItemId: item.playlistItemId.toString(),
      playlistId: item.playlistId.toString(),
      episodeId: item.episodeId.toString(),
      position: item.position,
    };
  }
}
