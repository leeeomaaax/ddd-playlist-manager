import { Playlist } from '../domain/Playlist';
import { ReorderPlaylistItem } from '../domain/ReorderPlaylistItem';
import { UniqueEntityId } from '../../../shared/domain/UniqueEntityId';
import { Result } from '../../../shared/core/Result';
import { PlaylistItem } from '../domain/PlaylistItem';

export interface PlaylistRepoInterface {
  save(playlist: Playlist): Promise<Result<void>>;
  listPlaylists(offset: number, pageSize: number): Promise<Result<Playlist[]>>;
  findPlaylistById(listId: UniqueEntityId): Promise<Result<Playlist | null>>;
  getPlaylistSizeById(listId: UniqueEntityId): Promise<Result<number>>;

  getNextPosition(playlistId: UniqueEntityId): Promise<Result<number>>;
  saveItem(item: PlaylistItem): Promise<Result<void>>;
  listItems(
    offset: number,
    pageSize: number,
    playlistId: UniqueEntityId,
  ): Promise<Result<PlaylistItem[]>>;
  findItemById(itemId: UniqueEntityId): Promise<Result<PlaylistItem | null>>;

  saveReorderPlaylistItemAggregate(
    reorderPlaylistItem: ReorderPlaylistItem,
  ): Promise<Result<void>>;
}
