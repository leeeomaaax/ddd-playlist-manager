import { Entity } from './Entity';

import { UniqueEntityId } from './UniqueEntityId';

class Concrete extends Entity<string> {
  constructor(name: string, id?: UniqueEntityId) {
    super(name, id);
  }
}

describe('Entity', () => {
  describe('Instantiate entity', () => {
    it('should create a concrete class', () => {
      const concrete = new Concrete('teste');
      expect(concrete instanceof Entity).toBe(true);
    });
  });

  describe('Comparison', () => {
    it('should compare instances by identifier', () => {
      const concrete1 = new Concrete('teste');
      const concrete2 = new Concrete('teste');
      expect(concrete1.equals(concrete2)).toBe(false);

      const id = UniqueEntityId.create();
      const concrete3 = new Concrete('string', id);
      const concrete4 = new Concrete('another string', id);
      expect(concrete3.equals(concrete4)).toBe(true);
    });

    it('should always be equal to itself', () => {
      const concrete = new Concrete('teste');
      expect(concrete.equals(concrete)).toBe(true);
    });

    it('should never be equal to undefined', () => {
      const concrete = new Concrete('teste');
      expect(concrete.equals()).toBe(false);
    });

    it('should not be compared with instances of other objects', () => {
      class AnotherClass {
        name: string;
        constructor(name: string) {
          this.name = name;
        }
      }

      const concrete = new Concrete('teste');
      const anotherClass = new AnotherClass('myName') as any;
      expect(concrete.equals(anotherClass)).toBe(false);
    });
  });
});
