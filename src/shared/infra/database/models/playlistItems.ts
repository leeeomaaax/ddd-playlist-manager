import { Database, Model } from '../index';
import { ObjectId } from 'mongodb';

const collectionName = 'playlistitems';

export interface PlaylistsItemsPersistenceSchema {
  _id?: ObjectId;
  createdAt: Date;
  playlistId: ObjectId;
  episodeId: ObjectId;
  position: number;
}

export async function PlaylistsItemsIndex(): Promise<void> {
  const model = Database.getDatabase().model(collectionName);
  await model.createIndexes([
    {
      name: 'Find by id and playlistId, sort by position',
      key: {
        _id: 1,
        playlistId: 1,
        position: -1,
      },
    },
    {
      name: 'Find by playlistId, sort by position',
      key: {
        playlistId: 1,
        position: -1,
      },
    },
    {
      name: 'Playlist and episode id',
      key: {
        playlistId: 1,
        episodeId: 1,
        position: -1,
      },
    },
  ]);
  return;
}

export default (): Model => Database.getDatabase().model(collectionName);
