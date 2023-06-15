interface UseCaseErrorInterface {
  message: string;
}

export abstract class UseCaseError implements UseCaseErrorInterface {
  public readonly message: string;
  public readonly code: string | undefined;

  constructor(message: string, code?: string) {
    this.message = message;
    this.code = code;
  }
}
