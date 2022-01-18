import {BaseModel} from "./BaseModel";
import {Pod} from "../page/Pod";
import {Service} from "./Service";

export class Daemonset extends BaseModel{
    pods: Pod[];
    services: Service[];

    constructor(data: any) {
        super(data);

        this.pods = [];
        this.services = [];
    }
}