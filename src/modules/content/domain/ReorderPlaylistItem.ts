import { Result } from '../../../shared/core/Result';
import { Entity } from '../../../shared/domain/Entity';
import { UniqueEntityId } from '../../../shared/domain/UniqueEntityId';

interface InternalProps {
  itemId: UniqueEntityId;
  playlistId: UniqueEntityId;
  playlistSize: number;
  oldPosition: number;
  newPosition: number;
  isDynamicPlaylist: boolean;
}

export class ReorderPlaylistItem extends Entity<InternalProps> {
  get playlistId(): UniqueEntityId {
    return this.props.playlistId;
  }

  get itemId(): UniqueEntityId {
    return this.props.itemId;
  }

  get oldPosition(): number {
    return this.props.oldPosition;
  }

  get newPosition(): number {
    return this.props.newPosition;
  }

  private constructor(props: InternalProps) {
    super(props);
  }

  public static createReorderPlaylistItemAggregate(
    props: InternalProps,
  ): Result<ReorderPlaylistItem> {
    if (props.isDynamicPlaylist)
      return Result.fail('dynamic playlist cannot be reordered');

    if (props.newPosition === props.oldPosition)
      return Result.fail('new position has to be different than old position');

    if (props.newPosition < 0 || props.newPosition + 1 > props.playlistSize)
      return Result.fail('new position outside boundaries');

    return Result.ok(new ReorderPlaylistItem(props));
  }
}
