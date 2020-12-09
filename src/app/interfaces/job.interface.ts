import { IBooster } from './boosters-request.interface';
import { ICategory } from './category.interface';
import { IType } from './type.interface';

interface IJob {
    _id: string;
    company: string;
    position: string;
    category: ICategory;
    type: IType;
    location: string;
    url: string;
    companyImage?: string;
    email?: string;
    paid?: boolean;
    status?: string;
    boosters?: IBooster[];
    description?: string;
    created?: string;
    updated?: string;
    __v?: number;
}

export { IJob };
