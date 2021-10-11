import {PureComponent} from "react";
import {getBackendSrv, getDataSourceSrv} from "@grafana/runtime";
import {KubeGrafDatasource} from "../datasource/datasource";
import store from "../common/store";
import {Node} from "../models/Node";
import {DS_ID} from "../constants";
import {hasRole} from "../common/utils";
import {OrgRole} from "../types";

interface Props{
    cluster_id: string
}

export class BasePage extends PureComponent<Props>{

    pageReady : boolean = false;

    cluster_id : string;
    cluster: KubeGrafDatasource | undefined = undefined;
    promDs: any;

    isAdmin: boolean;

    nodesMap: Node[] = [];
    nodesError: Boolean | Error = false;


    constructor(props: any) {
        super(props);
        this.cluster_id = props.cluster_id;

        try{
            this.isAdmin = hasRole(OrgRole.ADMIN);
        }catch (err){
            console.error(err);
            this.isAdmin = false;
        }
    }

    async getAvailableClusters(){
        let clusters: [] = [];
        await getBackendSrv().get('/api/datasources')
            .then(res => {
                clusters = res.filter((item : any) => {
                    return item.type === DS_ID;
                }).map((item : any) => {
                    return {
                        value: item.id,
                        label: item.name
                    }
                });
            });
        return clusters;
    }

    generateCLusterStatusLink(){
        return `/a/devopsprodigy-kubegraf-app/?page=cluster-status&clusterId=${this.cluster?.instanceSettings.id}`;
    }

    generateApplicationsOverviewLink(){
        return `/a/devopsprodigy-kubegraf-app/?page=applications-overview&clusterId=${this.cluster?.instanceSettings.id}`;
    }

    generateNodesOverviewLink = () => {
        return `/a/devopsprodigy-kubegraf-app/?page=nodes-overview&clusterId=${this.cluster?.instanceSettings.id}`;
    }

    generateEditLink = () => {
        return `/datasources/edit/${this.cluster?.instanceSettings.uid}`;
    }

    prepareDs = async () => {
        await this.getCluster().then(async () => {
            this.promDs = await getDataSourceSrv().get(this.cluster?.instanceSettings.jsonData.prometheus_name);
        })
    }

     getCluster = async () => {
        this.cluster = ( await getDataSourceSrv().get(this.cluster_id).catch(e => undefined) ) as KubeGrafDatasource | undefined;
    }

    getNodesMap = (withoutPods: boolean = false) => {
        let promises = [];
        promises.push(this.getNodes());

        return Promise.all(promises)
            .then(() => {
                console.log(123);
            })
    }

    getNodes(){
        return this.cluster?.getNodes().then((nodes: any) => {
            let nodeStore : any = [];
            let getStore = store.getObject('nodeStore');

            if (getStore) {
                nodeStore = getStore;
            }

            if (nodes instanceof Array) {
                this.nodesError = false;
                nodes.forEach((node : any) => {
                    let nd = new Node(node);
                    this.nodesMap.push(nd);

                    let index = nodeStore.findIndex((item : any) => item.name === nd.name);
                    if (index > -1) {
                        nd.open = nodeStore[index].open;
                    } else {
                        nodeStore.push({ name: nd.name, open: nd.open });
                    }
                });
                store.setObject('nodeStore', nodeStore);
            } else if (nodes instanceof Error) {
                this.nodesError = nodes;
            }
        });
    }

}