interface ICategoriesRequest {
  ok: boolean;
  categories: ICategory[];
}

interface ICategory {
  _id: string;
  name: string;
}

export { ICategoriesRequest, ICategory };