export class ApiResponse {
  public statusCode: number;
  public message: string;
  public data: any;
  public errors?: any[];

  constructor(statusCode: number, data: any, message = "Success", errors?: any[]) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.errors = errors;
  }
}

export class ApiError extends Error {
  public statusCode: number;
  public errors?: any[];

  constructor(statusCode: number, message: string, errors?: any[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}