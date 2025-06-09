export interface TravelTimeDto {
  planned: string;
  real: string | null;
}

export class TravelTime {
  constructor(
    public planned: Date,
    public real: Date | null
  ) {
  }

  static fromDto(dto: TravelTimeDto): TravelTime {
    let real = null;
    if(dto.real){
      real = new Date(Date.parse(dto.real));
    }

    return new TravelTime(
      new Date(Date.parse(dto.planned)),
      real
    );
  }

  getDelayInformation() : {delay: string, type: TimingType} | null {
    if(!this.real) return null;

    const delay = Math.floor((this.real.getTime() - this.planned.getTime()) / 60000.0);
    console.log(this.real.getTime(), this.planned.getTime());
    let type = TimingType.OnTime;

    if(delay < 0) {
      type = TimingType.Early
    }else if(delay > 0 && delay <= 5){
      type = TimingType.NormalDelay
    }else if(delay > 5){
      type = TimingType.Delay
    }
    return {
      delay: delay >= 0 ? `+${delay}` : `${delay}`,
      type: type
    };
  }
}

export enum TimingType {
  Early = "Early",
  OnTime = "OnTime",
  NormalDelay = "NormalDelay",
  Delay = "Delay"
}
