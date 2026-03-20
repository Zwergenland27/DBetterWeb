export class Errors {
  static readonly transfers: Record<string, string> = {
    "Frontend.Missing": $localize`:@@field_required:Field required`,
    "Frontend.TooLarge": $localize`:@@max10transfers:Maximum 10 transfers supported.`,
  }

  static readonly transferTime: Record<string, string> = {
    "Frontend.Missing": $localize`:@@field_required:Field required`,
    "Frontend.TooLarge": $localize`:@@max43transfer_time:The minimum transfer time cannot exceed 43 minutes.`,
  }
}
