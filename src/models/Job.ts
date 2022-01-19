import {BaseModel} from "./BaseModel";
import {Pod} from "./Pod";

export class Job extends BaseModel{
    pods: Pod[];

    constructor(data: any) {
        super(data);

        this.pods = [];
    }
}