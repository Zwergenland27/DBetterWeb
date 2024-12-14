import {DiscountDto, PassengerDto} from '../search.service';

export class Passenger {
  public frontendId: number | null = null;

  private constructor(
    public id: string | null,
    public name: string | null,
    public birthday: Date | null,
    public age: number | null,
    public withSeat: boolean,
    public withBike: boolean,
    public withDog: boolean,
    public withBuggy: boolean,
    public needsWheelchair: boolean,
    public discounts: DiscountDto[]) {
  }

  static fromDto(dto : PassengerDto){
    return new Passenger(
      dto.id,
      `${dto.firstname} ${dto.lastname}`,
      new Date(dto.birthday),
      null,
      false,
      false,
      false,
      false,
      false,
      dto.discounts,
    );
  }

  static fromKnownUser(
    id: string,
    name: string,
    birthday: Date,
    withSeat: boolean,
    withBike: boolean,
    withDog: boolean,
    withBuggy: boolean,
    needsWheelchair: boolean,
    discounts: DiscountDto[],

  ){
    return new Passenger(
      id,
      name,
      birthday,
      null,
      withSeat,
      withBike,
      withDog,
      needsWheelchair,
      withBuggy,

      discounts,
    );
  }

  static withBirthday(
    name: string,
    birthday: Date,
    withSeat: boolean,
    withBike: boolean,
    withDog: boolean,
    withBuggy: boolean,
    needsWheelchair: boolean,
    discounts: DiscountDto[]
  ){
    return new Passenger(
      null,
      name,
      birthday,
      null,
      withSeat,
      withBike,
      withDog,
      withBuggy,
      needsWheelchair,
      discounts,
    );
  }

  static withAge(
    name: string,
    age: number,
    withSeat: boolean,
    withBike: boolean,
    withDog: boolean,
    withBuggy: boolean,
    needsWheelchair: boolean,
    discounts: DiscountDto[]
  ){
    return new Passenger(
      null,
      name,
      null,
      age,
      withSeat,
      withBike,
      withDog,
      withBuggy,
      needsWheelchair,
      discounts,
    );
  }

  getAgeAt(date : Date){
    if(this.age){
      return this.age;
    }

    let age = date.getFullYear() - this.birthday!.getFullYear();
    const monthDifference = date.getMonth() - this.birthday!.getMonth();
    const dayDifference = date.getDate() - this.birthday!.getDate();

    if(monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)){
      age++;
    }

    return age;
  }
}
