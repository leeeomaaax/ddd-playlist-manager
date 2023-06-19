import { UniqueEntityId } from '../../../shared/domain/UniqueEntityId';
import { ReorderPlaylistItem } from './ReorderPlaylistItem';

describe('ReorderPlaylistItem', () => {
  it('should create a valid reorder playlist item', () => {
    const reorderPlaylistItemOrError =
      ReorderPlaylistItem.createReorderPlaylistItemAggregate({
        itemId: UniqueEntityId.create('5e373c869ff688f65cdd40a9'),
        playlistId: UniqueEntityId.create('5e373c869ff688f65cdd40a8'),
        playlistSize: 5,
        oldPosition: 2,
        newPosition: 4,
        isDynamicPlaylist: false,
      });

    expect(reorderPlaylistItemOrError.isSuccess).toBe(true);
  });

  it('should fail if new position is the same as old position', () => {
    const reorderPlaylistItemOrError =
      ReorderPlaylistItem.createReorderPlaylistItemAggregate({
        itemId: UniqueEntityId.create('5e373c869ff688f65cdd40a9'),
        playlistId: UniqueEntityId.create('5e373c869ff688f65cdd40a8'),
        playlistSize: 5,
        oldPosition: 2,
        newPosition: 2,
        isDynamicPlaylist: false,
      });

    expect(reorderPlaylistItemOrError.isFailure).toBe(true);
    expect(reorderPlaylistItemOrError.error).toBe(
      'new position has to be different than old position',
    );
  });

  it('should fail if new position is outside boundaries', () => {
    const reorderPlaylistItemOrError =
      ReorderPlaylistItem.createReorderPlaylistItemAggregate({
        itemId: UniqueEntityId.create('5e373c869ff688f65cdd40a9'),
        playlistId: UniqueEntityId.create('5e373c869ff688f65cdd40a8'),
        playlistSize: 5,
        oldPosition: 2,
        newPosition: 6,
        isDynamicPlaylist: false,
      });

    expect(reorderPlaylistItemOrError.isFailure).toBe(true);
    expect(reorderPlaylistItemOrError.error).toBe(
      'new position outside boundaries',
    );
  });

  it('should fail if dynamic playlist', () => {
    const reorderPlaylistItemOrError =
      ReorderPlaylistItem.createReorderPlaylistItemAggregate({
        itemId: UniqueEntityId.create('5e373c869ff688f65cdd40a9'),
        playlistId: UniqueEntityId.create('5e373c869ff688f65cdd40a8'),
        playlistSize: 5,
        oldPosition: 2,
        newPosition: 4,
        isDynamicPlaylist: true,
      });

    expect(reorderPlaylistItemOrError.isFailure).toBe(true);
    expect(reorderPlaylistItemOrError.error).toBe(
      'dynamic playlist cannot be reordered',
    );
  });
});
