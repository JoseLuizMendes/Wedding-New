export class ApiError extends Error {
  status: number;
  statusText: string;

  constructor(response: Response) {
    super(`API Error: ${response.status} ${response.statusText}`);
    this.status = response.status;
    this.statusText = response.statusText;
  }
}
