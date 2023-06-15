import { Result, left, right } from './Result';

describe('Fail handlers', () => {
  describe('Result', () => {
    it('should create a successful result', () => {
      const success = Result.ok<string>('hello');
      expect(success.isSuccess).toBe(true);
      expect(success.isFailure).toBe(false);
      expect(success.getValue()).toBe('hello');
      expect(success.errorValue()).toBeUndefined();
    });

    it('should create a failed result', () => {
      const err = Result.fail<string>('error message');
      expect(err.isSuccess).toBe(false);
      expect(err.isFailure).toBe(true);
      expect(err.errorValue()).toBe('error message');
      expect(() => err.getValue()).toThrow();
    });

    it('should create a void result', () => {
      const success = Result.void();
      expect(success.isSuccess).toBe(true);
      expect(success.isFailure).toBe(false);
      expect(success.getValue()).toBeUndefined();
      expect(success.errorValue()).toBeUndefined();
    });

    it('should combine successful results', () => {
      const combined = Result.combine([
        Result.ok<string>('hello'),
        Result.ok<string>('hello'),
        Result.ok<string>('hello'),
        Result.ok<string>('hello'),
      ]);
      expect(combined.isSuccess).toBe(true);
      expect(combined.isFailure).toBe(false);
    });

    it('should combine non successful results', () => {
      const combined = Result.combine([
        Result.ok<string>('hello'),
        Result.fail<string>('err'),
        Result.ok<string>('hello'),
        Result.ok<string>('hello'),
      ]);
      expect(combined.isSuccess).toBe(false);
      expect(combined.isFailure).toBe(true);
      expect(combined.errorValue()).toBe('err');
    });

    it('should flat successful results', () => {
      const combined = Result.flat([
        Result.ok<string>('hello'),
        Result.ok<string>('hello'),
        Result.ok<string>('hello'),
        Result.ok<string>('hello'),
      ]);
      expect(combined.isSuccess).toBe(true);
      expect(combined.isFailure).toBe(false);
      expect(combined.getValue()).toEqual(['hello', 'hello', 'hello', 'hello']);
    });

    it('should flat non successful results', () => {
      const combined = Result.flat([
        Result.ok<string>('hello'),
        Result.fail<string>('err'),
        Result.ok<string>('hello'),
        Result.ok<string>('hello'),
      ]);
      expect(combined.isSuccess).toBe(false);
      expect(combined.isFailure).toBe(true);
      expect(combined.errorValue()).toBe('err');
    });

    it('should not allow bad manual creation', () => {
      expect(() => new Result(true)).not.toThrow();
      expect(() => new Result(true, undefined, 'hey')).not.toThrow();
      expect(() => new Result(true, 'illegal error message')).toThrow();
      expect(() => new Result(false, 'my error')).not.toThrow();
      expect(() => new Result(false)).toThrow();
    });
  });

  describe('Either', () => {
    it('should create right result', () => {
      const r = right('Right');
      expect(r.isLeft()).toBe(false);
      expect(r.isRight()).toBe(true);
    });

    it('should create left result', () => {
      const l = left('Left');
      expect(l.isLeft()).toBe(true);
      expect(l.isRight()).toBe(false);
    });
  });
});
