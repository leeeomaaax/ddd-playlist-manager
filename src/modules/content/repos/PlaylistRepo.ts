import { PlaylistRepoInterface } from './PlaylistRepoInterface';
import { Playlist } from '../domain/Playlist';
// import { PlaylistItem } from '../domain/PlaylistItem';
import { UniqueEntityId } from '../../../shared/domain/UniqueEntityId';
import { Result } from '../../../shared/core/Result';
import playlistModel, {
  PlaylistsPersistenceSchema,
} from '../../../shared/infra/database/models/playlists';
// import playlistItemModel from '../../../shared/infra/database/models/playlistitems';
import { PlaylistMap } from '../mappers/PlaylistMap';
// import { PlaylistItemMap } from '../mappers/PlaylistItemMap';

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
}
