import { ObjectId } from 'mongodb';

import { UniqueEntityId } from './UniqueEntityId';

describe('UniqueEntityId', () => {
  it('should create UniqueEntityId with a valid string', () => {
    const id = UniqueEntityId.create('5e373c869ff688f65cdd40a9');
    expect(id.toString()).toBe('5e373c869ff688f65cdd40a9');
  });

  it('should create UniqueEntityId with an ObjectId', () => {
    const objectId = new ObjectId('5e373c869ff688f65cdd40a9');
    const id = UniqueEntityId.create(objectId);
    expect(id.toString()).toBe('5e373c869ff688f65cdd40a9');
  });

  it('should create UniqueEntityId or return undefined', () => {
    const id1 = UniqueEntityId.createOrUndefined('5e373c869ff688f65cdd40a9');
    expect(id1?.toString()).toBe('5e373c869ff688f65cdd40a9');

    const objectId = new ObjectId('5e373c869ff688f65cdd40a9');
    const id2 = UniqueEntityId.createOrUndefined(objectId);
    expect(id2?.toString()).toBe('5e373c869ff688f65cdd40a9');

    const id3 = UniqueEntityId.createOrUndefined();
    expect(id3).toBeUndefined();

    const id4 = UniqueEntityId.createOrUndefined('hello world');
    expect(id4).toBeUndefined();
  });

  it('should generate a new id if no value is passed', () => {
    const id = UniqueEntityId.create();
    expect(id.toString()).not.toBe('');
  });

  it('should not create UniqueEntityId with an invalid string', () => {
    expect(() => UniqueEntityId.create('teste')).toThrow();
  });

  it('should return an ObjectId for persistance', () => {
    const id = UniqueEntityId.create('5e373c869ff688f65cdd40a9');
    const isObjectId = id.toPersistence() instanceof ObjectId;
    expect(isObjectId).toBe(true);
  });

  it('should generate a new id with empty method', () => {
    const id = UniqueEntityId.empty();
    expect(id.toString()).not.toBe('');
  });

  it('should create an id from a string', () => {
    const id = UniqueEntityId.fromString('5e373c869ff688f65cdd40a9');
    expect(id.isSuccess).toBe(true);
    expect(id.getValue().toString()).toBe('5e373c869ff688f65cdd40a9');
  });

  it('should not create an id from an invalid string', () => {
    const id = UniqueEntityId.fromString('5e373c869ff688f65cdd');
    expect(id.isSuccess).toBe(false);
  });

  it('should not create an id from an empty string', () => {
    const id = UniqueEntityId.fromString('');
    expect(id.isSuccess).toBe(false);
  });

  it('should not create an id from an ObjectId', () => {
    const objectId = new ObjectId('5e373c869ff688f65cdd40a9');
    const id = UniqueEntityId.fromObjectId(objectId);
    expect(id.isSuccess).toBe(true);
    expect(id.getValue().toString()).toBe('5e373c869ff688f65cdd40a9');
  });

  it('should not create an id if ObjectId is missing', () => {
    const id = UniqueEntityId.fromObjectId();
    expect(id.isSuccess).toBe(false);
  });
});
