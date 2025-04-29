export enum TransportProduct {
  InterCityExpress = 'InterCityExpress',
  InterCity = 'InterCity',
  EuroCity = 'EuroCity',
  EuroCityDirect = 'EuroCityDirect',
  EuroNight = 'EuroNight',
  EuropeanSleeper = 'EuropeanSleeper',
  RailJet = 'RailJet',
  RailJetExpress = 'RailJetExpress',
  NightJet = 'NightJet',
  TrainAGrandeVitesse = 'TrainAGrandeVitesse',
  WestBahn = 'WestBahn',
  Eurostar = 'Eurostar',
  FlixTrain = 'FlixTrain',
  InterRegioExpress = 'InterRegioExpress',
  MetropolExpress = 'MetropolExpress',
  FlughafenExpress = 'FlughafenExpress',
  RegionalExpress = 'RegionalExpress',
  Regional  = 'Regional',
  Suburban  = 'Suburban',
  Ferry  = 'Ferry',
  Underground  = 'Underground ',
  Tram = 'Tram',
  Bus  = 'Bus',
  Taxi = 'Taxi',
  Unknown  = 'Unknown',
}

export function getShortName(product: TransportProduct): string {
  switch (product) {
    case TransportProduct.InterCityExpress: return 'ICE';
    case TransportProduct.InterCity: return 'IC';
    case TransportProduct.EuroCity: return 'EC';
    case TransportProduct.EuroCityDirect: return 'ECD';
    case TransportProduct.EuroNight: return 'EN';
    case TransportProduct.EuropeanSleeper: return 'ES';
    case TransportProduct.RailJet: return 'RJ';
    case TransportProduct.RailJetExpress: return 'RJX';
    case TransportProduct.NightJet: return 'NJ';
    case TransportProduct.TrainAGrandeVitesse: return 'TGV';
    case TransportProduct.WestBahn: return 'WB';
    case TransportProduct.Eurostar: return 'EST';
    case TransportProduct.FlixTrain: return 'FLX';
    case TransportProduct.InterRegioExpress: return 'IRE';
    case TransportProduct.MetropolExpress: return 'MEX';
    case TransportProduct.FlughafenExpress: return 'FEX';
    case TransportProduct.RegionalExpress: return 'RE';
    case TransportProduct.Regional: return 'RB';
    case TransportProduct.Suburban: return 'S';
    case TransportProduct.Ferry: return $localize`@@Boat:Boat`;
    case TransportProduct.Underground: return 'U';
    case TransportProduct.Tram: return 'T';
    case TransportProduct.Bus : return 'B';
  }

  return '???';
}
