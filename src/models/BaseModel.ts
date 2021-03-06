import {PODS_LIMIT} from "../constants";

export class BaseModel{
    name: string;
    data: any;
    is_deleted: boolean;
    open: boolean;
    limit: number ;

    constructor(data: any) {
        this.name = data.metadata.name;
        this.data = data;
        this.is_deleted = false;
        this.open = true;
        this.limit = PODS_LIMIT;
    }

    update(data: any) {
        this.name = data.metadata.name;
        this.data = data;
    }

    destroy() {
        this.is_deleted = true;
    }

    toggle() {
        this.open = !this.open;
    }
}