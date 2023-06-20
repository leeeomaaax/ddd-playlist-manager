import { PlaylistRepoInterface } from './PlaylistRepoInterface';
import { Playlist } from '../domain/Playlist';
import { UniqueEntityId } from '../../../shared/domain/UniqueEntityId';
import { Result } from '../../../shared/core/Result';

import { PlaylistItem } from '../domain/PlaylistItem';
import { ReorderPlaylistItem } from '../domain/ReorderPlaylistItem';

export class PlaylistRepoMock implements PlaylistRepoInterface {
  async save(playlist: Playlist): Promise<Result<void>> {
    return Result.ok();
  }

  async listPlaylists(
    offset: number,
    pageSize: number,
  ): Promise<Result<Playlist[]>> {
    return Result.ok([]);
  }

  async findPlaylistById(
    listId: UniqueEntityId,
  ): Promise<Result<Playlist | null>> {
    return Result.ok(null);
  }

  async getPlaylistSizeById(listId: UniqueEntityId): Promise<Result<number>> {
    return Result.ok(10);
  }

  async getNextPosition(playlistId: UniqueEntityId): Promise<Result<number>> {
    return Result.ok(10);
  }

  async findItemById(
    itemId: UniqueEntityId,
  ): Promise<Result<PlaylistItem | null>> {
    return Result.ok<PlaylistItem>(undefined);
  }

  private async addItemToPlaylist(item: PlaylistItem): Promise<Result<void>> {
    return Result.ok();
  }

  async saveItem(item: PlaylistItem): Promise<Result<void>> {
    return Result.ok();
  }

  async listItems(
    offset: number,
    pageSize: number,
    playlistId: UniqueEntityId,
  ): Promise<Result<PlaylistItem[]>> {
    return Result.ok<PlaylistItem[]>([]);
  }

  async saveReorderPlaylistItemAggregate(
    reorderPlaylistItem: ReorderPlaylistItem,
  ): Promise<Result<void>> {
    return Result.ok();
  }
}
