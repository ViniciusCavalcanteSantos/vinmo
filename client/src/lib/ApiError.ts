import {ApiStatus} from "@/types/ApiResponse";

export class ApiError<T = any> extends Error {
  public status: ApiStatus;
  public httpStatus?: number;
  public data?: T;
  public errors?: Record<string, string[]>;

  constructor(params: {
    message: string;
    status: ApiStatus;
    httpStatus?: number;
    data?: T;
    errors?: Record<string, string[]>;

  }) {
    super(params.message);
    this.name = "ApiError";
    this.status = params.status;
    this.data = params.data
    this.errors = params.errors;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  get isValidationError() {
    return this.httpStatus === 422;
  }
}