import {BaseModel} from "./BaseModel";
import {Pod} from "./Pod";
import {Service} from "./Service";

export class Deployment extends BaseModel{
    pods: Pod[];
    services: Service[];

    constructor(data: any) {
        super(data);
        this.pods = [];
        this.services = [];
    }
}