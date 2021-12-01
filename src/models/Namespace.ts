import {BaseModel} from "./BaseModel";
import store from "../common/store";

export class Namespace extends BaseModel{
    constructor(data: any) {
        super(data);
    }

    toggle() {
        super.toggle();

        let namespaceStore = store.getObject('namespaceStore');
        let index = namespaceStore.findIndex((item: any) => item.name === this.name);
        if (index || index === 0) {
            namespaceStore[index].open = this.open;
        }
        store.setObject('namespaceStore', namespaceStore);
    }
}