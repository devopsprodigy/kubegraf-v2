import {BaseModel} from "../models/BaseModel";

export class Pod extends BaseModel{
    used: boolean;

    constructor(data: any) {
        super(data);
        this.used = false;
    }
}