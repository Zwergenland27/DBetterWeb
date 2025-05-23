export interface TravelTime {
  planned: string;
  real: string | null;
}

export function getDelayInformation(time: TravelTime) : {delay: string, type: TimingType} | null {
  if(!time.real) return null;

  const delay = Math.round((Date.parse(time.real) - Date.parse(time.planned)) / 60000.0);
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

export enum TimingType {
  Early = 'Early',
  OnTime = 'OnTime',
  NormalDelay = 'NormalDelay',
  Delay = 'Delay',
}
