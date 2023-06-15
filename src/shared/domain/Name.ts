import { ValueObject } from './ValueObject';
import { Result } from '../core/Result';

interface NameProps {
  name: string;
}

export class Name extends ValueObject<NameProps> {
  get value(): string {
    return this.props.name;
  }

  public toString(): string {
    return this.props.name;
  }

  public toPersistence(): string {
    return this.props.name;
  }

  private constructor(props: NameProps) {
    super(props);
  }

  static create(name: string): Result<Name> {
    if (!name) {
      return Result.fail<Name>('Name cannot be empty');
    }

    try {
      const trimmed = name
        .trim()
        .split(' ')
        .filter((str) => str)
        .join(' ');

      return Result.ok<Name>(new Name({ name: trimmed }));
    } catch (e) {
      return Result.fail<Name>('Failed to parse name, name must be a string');
    }
  }
}
