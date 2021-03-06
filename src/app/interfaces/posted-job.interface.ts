import { IJob } from './job.interface';

interface IPostedJob {
  ok: boolean;
  job: IJob;
  free: string;
}

/*
interface IJobCreated {
  _id: string;
  company: string;
  position: string;
  category: string;
  type: string;
  location: string;
  url: string;
  email: string;
  paid: boolean;
  status: string;
  created: string;
  updated: string;
}
*/

export { IPostedJob };
