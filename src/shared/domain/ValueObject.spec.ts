import { ValueObject } from './ValueObject';

type testProps = {
  value: string;
};

class ConcreteValueObject extends ValueObject<testProps> {
  constructor(props: testProps) {
    super(props);
  }
}

describe('ValueObject', () => {
  it('should compare equal instances from concrete class', () => {
    const inst1 = new ConcreteValueObject({ value: 'hello wordl' });
    const inst2 = new ConcreteValueObject({ value: 'hello wordl' });
    expect(inst1.equals(inst2)).toBe(true);
  });

  it('should compare different instances from concrete class', () => {
    const inst1 = new ConcreteValueObject({ value: 'hello wordl' });
    const inst2 = new ConcreteValueObject({ value: 'other string' });
    expect(inst1.equals(inst2)).toBe(false);
  });

  it('should find that undefined is not equal one instance', () => {
    const inst = new ConcreteValueObject({ value: 'hello wordl' });
    expect(inst.equals(undefined)).toBe(false);
  });
});
