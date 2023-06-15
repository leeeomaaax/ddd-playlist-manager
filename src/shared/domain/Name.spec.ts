import { Name } from './Name';

describe('Name', () => {
  it('should fail if empty', () => {
    const nameResult = Name.create('');
    expect(nameResult.isFailure).toBe(true);
  });

  it('should fail if non string', () => {
    const nameResult = Name.create(1 as any);
    expect(nameResult.isFailure).toBe(true);
  });

  it('should create simple name', () => {
    const nameResult = Name.create('test');
    expect(nameResult.isSuccess).toBe(true);
    expect(nameResult.getValue().value).toBe('test');
  });

  it('should trim name string', () => {
    const nameResult = Name.create('  test \n');
    expect(nameResult.isSuccess).toBe(true);
    expect(nameResult.getValue().value).toBe('test');
  });

  it('should remove multiple spaces between names', () => {
    const nameResult = Name.create('  Leo   Max Mussio  de       Almeida\n');
    expect(nameResult.isSuccess).toBe(true);
    expect(nameResult.getValue().value).toBe('Leo Max Mussio de Almeida');
  });

  it('should transform Name to persistency', () => {
    const name = Name.create('Name').getValue();
    expect(name.toPersistence()).toBe('Name');
  });

  it('should transform Name to string', () => {
    const name = Name.create('Name').getValue();
    expect(name.toString()).toBe('Name');
  });
});
