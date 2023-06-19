import { PlaylistRepoInterface } from './PlaylistRepoInterface';
import { Playlist } from '../domain/Playlist';
import { UniqueEntityId } from '../../../shared/domain/UniqueEntityId';
import { Result } from '../../../shared/core/Result';
import playlistModel, {
  PlaylistsPersistenceSchema,
} from '../../../shared/infra/database/models/playlists';
import { PlaylistMap } from '../mappers/PlaylistMap';

import { PlaylistItem } from '../domain/PlaylistItem';
import { PlaylistItemMap } from '../mappers/PlaylistItemMap';
import playlistItemModel, {
  PlaylistsItemsPersistenceSchema,
} from '../../../shared/infra/database/models/playlistItems';

export class PlaylistRepo implements PlaylistRepoInterface {
  async save(playlist: Playlist): Promise<Result<void>> {
    const playlistOrError = await this.findPlaylistById(playlist.playlistId);
    if (playlistOrError.isFailure) {
      return Result.fail<void>(playlistOrError.error as string);
    }

    const model = playlistModel();
    const body: PlaylistsPersistenceSchema =
      PlaylistMap.toPlaylistPersistence(playlist);

    if (!playlistOrError.getValue()) {
      body._id = playlist.playlistId.toPersistence();
      try {
        await model.insertOne(body);
        return Result.ok();
      } catch (e) {
        return Result.fail<void>('Could not create playlist');
      }
    }

    try {
      await model.updateOne(
        { _id: playlist.playlistId.toPersistence() },
        { $set: body },
      );
      return Result.ok();
    } catch (e) {
      return Result.fail<void>('Could not update playlist');
    }
  }

  async listPlaylists(
    offset: number,
    pageSize: number,
  ): Promise<Result<Playlist[]>> {
    try {
      const model = playlistModel();
      const docs = (await model
        .find()
        .sort({ _id: 1 })
        .skip(offset)
        .limit(pageSize)
        .toArray()) as PlaylistsPersistenceSchema[];

      const playlists = docs
        .map((doc) => {
          const playlistOrError = PlaylistMap.toPlaylistDomain(doc);
          if (playlistOrError.isFailure) {
            console.warn(`Could not parse playlist: ${doc._id}`);
            return null;
          }
          return playlistOrError.getValue();
        })
        .filter((playlist) => playlist !== null) as Playlist[];

      return Result.ok<Playlist[]>(playlists);
    } catch (e) {
      return Result.fail<Playlist[]>('Could not read playlists from database');
    }
  }

  async findPlaylistById(
    listId: UniqueEntityId,
  ): Promise<Result<Playlist | null>> {
    try {
      const model = playlistModel();
      const doc = (await model.findOne({
        _id: listId.toPersistence(),
      })) as PlaylistsPersistenceSchema;

      if (!doc) return Result.ok<null>(null);
      const playlistOrError = PlaylistMap.toPlaylistDomain(doc);
      if (playlistOrError.isFailure) {
        return Result.fail<Playlist>(`Could not parse playlist: ${doc._id}`);
      }
      return Result.ok<Playlist>(playlistOrError.getValue());
    } catch (e) {
      return Result.fail<Playlist>(
        'Could not find playlist by id from database',
      );
    }
  }

  private async maxPlaylistPosition(
    playlistId: UniqueEntityId,
  ): Promise<Result<number | null>> {
    try {
      const model = playlistItemModel();
      const docs = await model
        .find(
          { playlistId: playlistId.toPersistence() },
          { projection: { position: 1, _id: -1 } },
        )
        .sort({ position: -1 })
        .limit(1)
        .toArray();

      if (!docs.length) return Result.ok<null>(null);
      return Result.ok<number>(docs[0].position);
    } catch (e) {
      return Result.fail<number>(
        `Could not read last position from list ${playlistId}`,
      );
    }
  }

  async getNextPosition(playlistId: UniqueEntityId): Promise<Result<number>> {
    const maxPositionOrError = await this.maxPlaylistPosition(playlistId);
    if (maxPositionOrError.isFailure) {
      return maxPositionOrError as Result<number>;
    }
    const maxPosition = maxPositionOrError.getValue();
    if (maxPosition === null) return Result.ok<number>(0);
    return Result.ok<number>(maxPosition + 1);
  }

  async findItemById(
    itemId: UniqueEntityId,
  ): Promise<Result<PlaylistItem | null>> {
    try {
      const model = playlistItemModel();
      const doc = (await model.findOne({
        _id: itemId.toPersistence(),
      })) as PlaylistsItemsPersistenceSchema;

      if (!doc) return Result.ok<null>(null);
      const itemOrError = PlaylistItemMap.toDomain(doc);
      if (itemOrError.isFailure) {
        return Result.fail<PlaylistItem>(
          `Could not parse playlistItem: ${doc._id}`,
        );
      }
      return Result.ok<PlaylistItem>(itemOrError.getValue());
    } catch (e) {
      return Result.fail<PlaylistItem>(
        'Could not find playlistItem by id from database',
      );
    }
  }

  private async addItemToPlaylist(item: PlaylistItem): Promise<Result<void>> {
    try {
      const model = playlistItemModel();

      const doc = await model.findOne({
        playlistId: item.playlistId.toPersistence(),
        episodeId: item.episodeId.toPersistence(),
      });

      if (doc) {
        //Item already registered
        return Result.ok();
      }

      const body = PlaylistItemMap.toPersistence(item);
      body._id = item.playlistItemId.toPersistence();
      await model.insertOne(body);
      return Result.ok();
    } catch (e) {
      return Result.fail<void>('Could not add item to playlist');
    }
  }

  async saveItem(item: PlaylistItem): Promise<Result<void>> {
    const itemOrError = await this.findItemById(item.playlistItemId);
    if (itemOrError.isFailure) {
      return Result.fail<void>(itemOrError.error as string);
    }
    const isNew = !itemOrError.getValue();
    if (isNew) {
      return this.addItemToPlaylist(item);
    } else if (item.removeItem()) {
      // TODO remove Item from playlist
      // return this.removeItemFromPlaylist(item);
    } else if (typeof item.previousPosition === 'number') {
      // TODO reorder Items
      // return this.reorderPlaylistItems(item);
    }
    //If the item is not new and we are not removing or reordering it there
    //is nothing to be done, since it makes no sense to update an item
    return Result.ok();
  }
}
