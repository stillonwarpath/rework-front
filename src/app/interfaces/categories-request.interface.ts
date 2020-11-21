import { ICategory } from './category.interface';

interface ICategoriesRequest {
  ok: boolean;
  categories: ICategory[];
}


export { ICategoriesRequest };