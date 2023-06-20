import { ChangePlaylistItemPosition } from './ChangePlaylistItemPosition';
import { PlaylistRepoMock } from '../../../repos/PlaylistRepo.mock';
import { PlaylistMap } from '../../../mappers/PlaylistMap';
import { PlaylistItemMap } from '../../../mappers/PlaylistItemMap';
import { ObjectId } from 'mongodb';

const playlistRepoMock = new PlaylistRepoMock();
const listPlaylistItems = new ChangePlaylistItemPosition(playlistRepoMock);

describe('ChangePlaylistItemPosition', () => {
  // write a before each that mock implememntation of findind the playlist by id
  beforeEach(() => {
    jest.spyOn(playlistRepoMock, 'findPlaylistById').mockResolvedValue(
      PlaylistMap.toPlaylistDomain({
        _id: new ObjectId('64909bdc2fc9fdf5f41c2bf8'),
        title: 'Leo',
        createdAt: new Date(),
        isActive: true,
        dynamic: false,
      }),
    );
    jest.spyOn(playlistRepoMock, 'findItemById').mockResolvedValue(
      PlaylistItemMap.toDomain({
        _id: new ObjectId('64909d26714197131f354ca9'),
        createdAt: new Date(),
        playlistId: new ObjectId('64909bdc2fc9fdf5f41c2bf8'),
        episodeId: new ObjectId('64909d26714197131f354000'),
        position: 2,
      }),
    );
  });

  it('should execute successfully', async () => {
    const input = {
      playlistId: '64909bdc2fc9fdf5f41c2bf8',
      itemId: '64909d26714197131f354ca9',
      position: 1,
    };

    const result = await listPlaylistItems.execute(input);
    expect(result.value).toBe(undefined);
  });

  it('should execute and return invalid playlist id error', async () => {
    const input = {
      playlistId: 'invalid',
      itemId: '64909d26714197131f354ca9',
      position: 1,
    };

    const result = await listPlaylistItems.execute(input);
    expect(result.isLeft()).toBe(true);
    expect(result.isLeft() && result.value.errorValue()).toEqual({
      message: 'Invalid playlist id',
    });
  });
  it('should execute and return invalid playlist id error', async () => {
    const input = {
      playlistId: '64909bdc2fc9fdf5f41c2bf8',
      itemId: 'invalid',
      position: 1,
    };

    const result = await listPlaylistItems.execute(input);
    expect(result.isLeft()).toBe(true);
    expect(result.isLeft() && result.value.errorValue()).toEqual({
      message: 'Invalid playlist item id',
    });
  });
  it('should execute and return invalid position error', async () => {
    const input = {
      playlistId: '64909bdc2fc9fdf5f41c2bf8',
      itemId: '64909d26714197131f354ca9',
      position: -1,
    };

    const result = await listPlaylistItems.execute(input);
    expect(result.isLeft()).toBe(true);
    expect(result.isLeft() && result.value.errorValue()).toEqual({
      message: 'Invalid position',
    });
  });
});
