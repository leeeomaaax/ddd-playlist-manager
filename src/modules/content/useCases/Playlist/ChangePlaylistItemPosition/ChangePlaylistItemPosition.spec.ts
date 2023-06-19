import { ChangePlaylistItemPosition } from './ChangePlaylistItemPosition';
import { PlaylistRepo } from '../../../repos/PlaylistRepo';

const playlistRepo = new PlaylistRepo();
const listPlaylistItems = new ChangePlaylistItemPosition(playlistRepo);

describe('ChangePlaylistItemPosition', () => {
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
