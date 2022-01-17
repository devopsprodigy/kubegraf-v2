import {BaseModel} from "./BaseModel";
import store from "../common/store";
import {Deployment} from "./Deployment";
import {Statefulset} from "./Statefulset";
import {Daemonset} from "./Daemonset";
import {Job} from "./Job";
import {CronJob} from "./CronJob";

export class Namespace extends BaseModel{

    deployments: Deployment[];
    statefulsets: Statefulset[];
    daemonsets: Daemonset[];
    jobs: Job[];
    cronjobs: CronJob[];

    constructor(data: any) {
        super(data);
        this.deployments = [];
        this.statefulsets = [];
        this.daemonsets = [];
        this.jobs = [];
        this.cronjobs = [];
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