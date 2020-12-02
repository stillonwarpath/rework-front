interface IBoostersRequest {
  ok: boolean;
  boosters: IBooster[];
}

interface IBooster {
  _id: string;
  code: string;
  name: string;
  price: number;
}

export { IBoostersRequest, IBooster };