import {BaseModel} from "./BaseModel";
import store from "../common/store";
import {Deployment} from "./Deployment";
import {Statefulset} from "./Statefulset";
import {Daemonset} from "./Daemonset";

export class Namespace extends BaseModel{

    deployments: Deployment[];
    statefulsets: Statefulset[];
    daemonsets: Daemonset[];

    constructor(data: any) {
        super(data);
        this.deployments = [];
        this.statefulsets = [];
        this.daemonsets = [];
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