export class ErrorTranslation {
  code = ''
  message = ''

  private constructor(code: string, message: string) {
    this.code = code;
    this.message = message;
  }

  static Create(code: string, message: string) {
    return new ErrorTranslation(code, message);
  }

  static CreateWithoutTranslation(code: string) {
    return new ErrorTranslation(code, code);
  }
}
