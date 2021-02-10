interface IJob {
    company: string;
    position: string;
    tags: string[];
    category: string;
    type: string;
    location: string;
    url: string;
    email: string;
    companyImage: string;
    boosters: string[];
    description: string;
    paid?: boolean;
    status?: string;
    created?: Date;
    updated?: Date;
}

class Job implements IJob {

    constructor( public company: string,
                 public position: string,
                 public tags: string[],
                 public category: string,
                 public type: string,
                 public location: string,
                 public url: string,
                 public email: string,
                 public companyImage: string = '',
                 public boosters: string[] = [],
                 public description: string = '') {}

}

export { Job, IJob };
