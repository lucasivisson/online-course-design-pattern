export class HttpError extends Error {
  public status: number;

  constructor(message: string, status: number = 500) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}
