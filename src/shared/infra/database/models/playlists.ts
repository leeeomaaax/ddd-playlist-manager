import { Database, Model } from '../index';
import { ObjectId } from 'mongodb';

const collectionName = 'playlists';

export interface PlaylistsPersistenceSchema {
  _id?: ObjectId;
  title: string;
  createdAt: Date;
  isActive: boolean;
  dynamic?: boolean;
}

export default (): Model => Database.getDatabase().model(collectionName);

export async function PlaylistsIndexes(): Promise<void> {
  const model = Database.getDatabase().model(collectionName);
  await model.createIndexes([
    {
      name: 'Find by owner',
      key: {
        ownerId: 1,
        ownerType: 1,
      },
    },
  ]);
  return;
}
