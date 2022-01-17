import {BaseModel} from "./BaseModel";
import {Job} from "./Job";

export class CronJob extends BaseModel{
    jobs: Job[];

    constructor(data: any) {
        super(data);
        this.jobs = [];
    }
}
