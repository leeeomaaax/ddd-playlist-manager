import { Identifier } from './Identifier';

describe('Identifier', () => {
  describe('Instantiations', () => {
    it('should create a string identifier', () => {
      const instance = new Identifier<string>('test');
      expect(instance.toValue()).toBe('test');
    });

    it('should stringify a string', () => {
      const instance = new Identifier<string>('test');
      expect(instance.toString()).toBe('test');
    });

    it('should create a number identifier', () => {
      const instance = new Identifier<number>(10);
      expect(instance.toValue()).toBe(10);
    });

    it('should stringify a number', () => {
      const instance = new Identifier<number>(10);
      expect(instance.toString()).toBe('10');
    });
  });

  describe('Comparison', () => {
    it('should compare string instances', () => {
      const instance1 = new Identifier<string>('test');
      const instance2 = new Identifier<string>('test');
      const instance3 = new Identifier<string>('another string');
      expect(instance1.equals(instance2)).toBe(true);
      expect(instance1.equals(instance3)).toBe(false);
    });

    it('should compare number instances', () => {
      const instance1 = new Identifier<number>(1);
      const instance2 = new Identifier<number>(1);
      const instance3 = new Identifier<number>(2);
      expect(instance1.equals(instance2)).toBe(true);
      expect(instance1.equals(instance3)).toBe(false);
    });

    it('should not compare instance with undefined', () => {
      const instance = new Identifier<string>('teste');
      expect(instance.equals()).toBe(false);
    });
  });
});
