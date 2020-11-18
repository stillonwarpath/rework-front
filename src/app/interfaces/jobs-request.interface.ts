interface IJobsRequest {
  ok: boolean;
  jobs: IJobRequest[];
}

interface IJobRequest {
  _id: string;
  company: string;
  position: string;
  category: ICategory;
  type: IType;
  location: string;
  url: string;
  email: string;
  paid: boolean;
  status: string;
  created: string;
  updated: string;
  __v: number;
}

interface ICategory {
  _id: string;
  name: string;
}

interface IType {
    _id: string;
    name: string;
}

export { IJobsRequest, IJobRequest };