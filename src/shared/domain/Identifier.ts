/**
 * Used to signal that a value is an identifier
 *
 * Identifiers should be compared by value
 * Identifiers should be turn in a string by the function String(value)
 */
export class Identifier<T> {
  constructor(private value: T) {
    this.value = value;
  }

  /**
   * Compare two instance of the same identifier type
   */
  equals(id?: Identifier<T>): boolean {
    if (id === undefined) return false;
    return id.toValue() === this.value;
  }

  /**
   * Stringify the identifier value
   */
  toString(): string {
    return String(this.value);
  }

  /**
   * Return raw value of identifier
   */
  toValue(): T {
    return this.value;
  }
}
