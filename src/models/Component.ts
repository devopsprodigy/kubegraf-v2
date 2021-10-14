import {BaseModel} from "./BaseModel";
import {COLOR_GREEN, COLOR_RED, ERROR, SUCCESS} from "../constants";

export class Component extends BaseModel {
    constructor(data : any) {
        super(data);
    }

    get status(){

        const type = this.data.conditions.filter((item: any) => item.type === 'Healthy')[0];

        if (type !== undefined && type.status === 'True') {
            return SUCCESS;
        } else {
            return ERROR;
        }
    }

    get color() {
        switch (this.status) {
            case SUCCESS:
                return COLOR_GREEN;
            case ERROR:
                return COLOR_RED;
            default:
                return;
        }
    }

    get message() {
        let conditions = this.data.conditions;

        if (conditions) {
            let message = conditions.filter((item : any) => item.type === 'Healthy')[0];
            return message && message.message;
        }
    }
}