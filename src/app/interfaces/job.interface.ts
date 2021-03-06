import { IBooster } from './boosters-request.interface';
import { ICategory } from './category.interface';
import { IType } from './type.interface';

interface IJob {
    _id: string;
    company: string;
    position: string;
    tags: string[];
    category: ICategory;
    type: IType;
    location: string;
    url: string;
    companyImage?: string;
    boosters?: IBooster[];
    description?: string;
    hasSticky?: boolean;
    created?: string;
}

export { IJob };
