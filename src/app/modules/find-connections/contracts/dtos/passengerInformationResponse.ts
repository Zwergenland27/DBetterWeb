export interface PassengerInformationResponseDto {
  type: PassengerInformationType,
  message: string;
  priority: PassengerInformationPriority;
}

export enum PassengerInformationType {
  FreeText= "FreeText",
  DelayReason = "DelayReason",
  QualityIssue = "QualityIssue",
  AccessibilityInfo = "AccessibilityInfo",
}

export enum PassengerInformationPriority {
  Critical = "Critical",
  High = "High",
  Medium = "Medium",
  Low = "Low",
}

export class PassengerInformation{
  constructor(
    public type: PassengerInformationType,
    public message: string,
    public priority: PassengerInformationPriority,
  ) {
  }

  public static fromDto(dto: PassengerInformationResponseDto){
    return new PassengerInformation(dto.type, dto.message, dto.priority);
  }
}
