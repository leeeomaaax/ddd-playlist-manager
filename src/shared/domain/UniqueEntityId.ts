import { ObjectId } from 'mongodb';

import { Identifier } from './Identifier';
import { Result } from '../core/Result';

export class UniqueEntityId extends Identifier<string> {
  public toPersistence(): ObjectId {
    return new ObjectId(this.toValue());
  }

  private constructor(id?: string | ObjectId) {
    const objectId = new ObjectId(id);
    super(objectId.toHexString());
  }

  public static create(id?: string | ObjectId): UniqueEntityId {
    return new UniqueEntityId(id);
  }

  public static fromObjectId(id?: ObjectId): Result<UniqueEntityId> {
    if (id instanceof ObjectId) {
      return Result.ok<UniqueEntityId>(new UniqueEntityId(id));
    } else {
      return Result.fail<UniqueEntityId>(
        'Could not create UniqueEntityId with invalid ObjectId',
      );
    }
  }

  public static fromString(id: string): Result<UniqueEntityId> {
    try {
      if (!id) {
        return Result.fail<UniqueEntityId>(
          'Cannot create id from empty string',
        );
      }
      return Result.ok<UniqueEntityId>(new UniqueEntityId(id));
    } catch (e) {
      return Result.fail<UniqueEntityId>(
        'Could not create UniqueEntityId from string',
      );
    }
  }

  public static empty(): UniqueEntityId {
    return new UniqueEntityId();
  }

  public static createOrUndefined(
    id?: string | ObjectId,
  ): UniqueEntityId | undefined {
    if (!id) return undefined;
    try {
      return new UniqueEntityId(id);
    } catch (err) {
      return undefined;
    }
  }
}
