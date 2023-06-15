import { Entity } from '../../../shared/domain/Entity';
import { UniqueEntityId } from '../../../shared/domain/UniqueEntityId';
import { DateClass } from '../../../shared/domain/DateClass';
import { Name } from '../../../shared/domain/Name';

interface PlaylistCreationProps {
  title: Name;
  createdAt: DateClass;
  dynamic?: boolean;
}

export interface PlaylistProps {
  title: Name;
  createdAt: DateClass;
  isActive: boolean;
  dynamic?: boolean;
}

export class Playlist extends Entity<PlaylistProps> {
  get playlistId(): UniqueEntityId {
    return this._id;
  }

  get title(): Name {
    return this.props.title;
  }

  get createdAt(): DateClass {
    return this.props.createdAt;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get dynamic(): boolean | undefined {
    return this.props.dynamic;
  }

  constructor(props: PlaylistProps, id?: UniqueEntityId) {
    super(props, id);
  }

  public rename(title: Name): Playlist {
    this.props.title = title;
    return this;
  }

  public delete(): Playlist {
    this.props.isActive = false;
    return this;
  }

  public removePlaylist(): boolean {
    return this.props.isActive === false;
  }

  public static create(
    props: PlaylistCreationProps,
    id?: UniqueEntityId,
  ): Playlist {
    return new Playlist({ ...props, isActive: true }, id);
  }

  public static restore(props: PlaylistProps, id?: UniqueEntityId): Playlist {
    return new Playlist(props, id);
  }
}
