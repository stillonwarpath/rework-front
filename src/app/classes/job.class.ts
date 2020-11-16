interface IJob {
    company: string;
    position: string;
    category: string;
    type: string;
    location: string;
    url: string;
    email: string;
    paid?: boolean;
    status?: string;
    created?: Date;
    updated?: Date;
}

class Job implements IJob {

    constructor( public company: string,
                 public position: string,
                 public category: string,
                 public type: string,
                 public location: string,
                 public url: string,
                 public email: string ) {}

}

export { Job, IJob };