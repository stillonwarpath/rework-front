interface ITypesRequest {
  ok: boolean;
  types: IType[];
}

interface IType {
  _id: string;
  name: string;
}

export { ITypesRequest, IType };