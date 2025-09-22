export enum ApiStatus {
  SUCCESS = "success",
  ERROR = "error",
  NOT_AUTHORIZED = "not_authorized",
  NOT_AUTHENTICATED = 'not_authenticated',
  MAX_ATTEMPTS = "max_attempts"
}

type ApiResponse = {
  status: ApiStatus,
  message: string
}

export default ApiResponse
