export class ApiError extends Error {
  status: number;
  statusText: string;
  errorMessage?: string;

  constructor(response: Response, errorMessage?: string) {
    super(`API Error: ${response.status} ${response.statusText}`);
    this.status = response.status;
    this.statusText = response.statusText;
    this.errorMessage = errorMessage;
  }
}
