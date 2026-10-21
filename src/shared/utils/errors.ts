export class AppError extends Error {
  constructor(message: string, readonly code: string, options?: ErrorOptions) {
    super(message, options)
    this.name = new.target.name
  }
}

export class ValidationError extends AppError {
  constructor(message: string) { super(message, 'VALIDATION_ERROR') }
}

export class StorageError extends AppError {
  constructor(message: string, options?: ErrorOptions) { super(message, 'STORAGE_ERROR', options) }
}
