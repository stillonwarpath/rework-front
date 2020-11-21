import { IJob } from './job.interface';

interface IJobsRequest {
  ok: boolean;
  jobs: IJob[];
}

/*
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
*/

export { IJobsRequest };