import { Entity } from '../../../shared/domain/Entity';
import { UniqueEntityId } from '../../../shared/domain/UniqueEntityId';
import { DateClass } from '../../../shared/domain/DateClass';

interface InternalProps {
  createdAt: DateClass;
  playlistId: UniqueEntityId;
  episodeId: UniqueEntityId;
  position: number;
}

export interface PlaylistItemProps {
  createdAt?: DateClass;
  playlistId: UniqueEntityId;
  episodeId: UniqueEntityId;
  position: number;
}

export class PlaylistItem extends Entity<InternalProps> {
  private isActive = true;
  private oldPosition: number | null = null;

  get playlistItemId(): UniqueEntityId {
    return this._id;
  }

  get createdAt(): DateClass {
    return this.props.createdAt;
  }

  get playlistId(): UniqueEntityId {
    return this.props.playlistId;
  }

  get episodeId(): UniqueEntityId {
    return this.props.episodeId;
  }

  get position(): number {
    return this.props.position;
  }

  get previousPosition(): number | null {
    return this.oldPosition;
  }

  private constructor(props: InternalProps, id?: UniqueEntityId) {
    super(props, id);
  }

  static create(props: PlaylistItemProps, id?: UniqueEntityId): PlaylistItem {
    return new PlaylistItem(
      {
        createdAt: props.createdAt ?? DateClass.now(),
        playlistId: props.playlistId,
        episodeId: props.episodeId,
        position: props.position,
      },
      id,
    );
  }

  public removeItem(): boolean {
    return this.isActive === false;
  }

  public removeFromPlaylist(): PlaylistItem {
    this.isActive = false;
    return this;
  }

  public changePosition(newPosition: number): PlaylistItem {
    if (newPosition !== this.position) {
      this.oldPosition = this.position;
      this.props.position = newPosition;
    }
    return this;
  }

  public belongsToPlaylist(playlistId: UniqueEntityId): boolean {
    return this.playlistId.equals(playlistId);
  }
}
