import {PureComponent, SyntheticEvent} from "react";
import {getBackendSrv, getDataSourceSrv} from "@grafana/runtime";
import {KubeGrafDatasource} from "../datasource/datasource";
import store from "../common/store";
import {Node} from "../models/Node";
import {DS_ID} from "../constants";
import {hasRole, isLight} from "../common/utils";
import {OrgRole} from "../types";
import {SelectableValue} from "@grafana/data";
import {Namespace} from "../models/Namespace";
import {Styles} from "../common/styles";
import {Component} from "../models/Component";

interface Props{
    cluster_id: string
}

export class BasePage extends PureComponent<Props>{

    styles: any;

    pageReady : boolean = false;

    cluster_id : string;
    cluster: KubeGrafDatasource | undefined = undefined;
    promDs: any;
    refreshRate: number = 60 * 1000;

    isAdmin: boolean;

    nodesMap: Node[] = [];
    nodesError: Boolean | Error = false;
    namespacesMap: Namespace[] = [];
    storeComponents: Component[] = [];
    componentsError: Boolean | Error = false;

    constructor(props: any) {
        super(props);
        this.styles = Styles(isLight());
        console.log(this.styles);
        this.cluster_id = props.cluster_id;

        try{
            this.isAdmin = hasRole(OrgRole.ADMIN);
        }catch (err){
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

    getValueFromEventItem(eventItem : SyntheticEvent<HTMLInputElement> | SelectableValue<string>){
        if (!eventItem) {
            return '';
        }

        if (eventItem.hasOwnProperty('currentTarget')) {
            return eventItem.currentTarget.value;
        }

        return (eventItem as SelectableValue<string>).value;
    }

    generateCLusterStatusLink(){
        return `/a/devopsprodigy-kubegraf-app/?page=cluster-status&clusterId=${this.props.cluster_id}`;
    }

    generateApplicationsOverviewLink(){
        return `/a/devopsprodigy-kubegraf-app/?page=applications-overview&clusterId=${this.props.cluster_id}`;
    }

    generateNodesOverviewLink = () => {
        return `/a/devopsprodigy-kubegraf-app/?page=nodes-overview&clusterId=${this.props.cluster_id}`;
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
        if(
            this.cluster !== undefined
            &&
            this.cluster.instanceSettings.jsonData.refresh_pods_rate !== undefined
        )
            this.refreshRate = Number(this.cluster.instanceSettings.jsonData.refresh_pods_rate) * 1000;
    }

    getNodesMap = (withoutPods: boolean = false) => {
        let promises = [];
        promises.push(this.getNodes());

        return Promise.all(promises)
            .then(() => {
                console.log(123);
            })
    }

    getNamespacesMap = () => {
        if(this.cluster === undefined)
            return Promise.reject(false);

        return this.cluster.getNamespaces().then((namespaces: any) => {
            let namespaceStore : any = [];
            let getStore = store.getObject('namespaceStore');
            if (getStore) {
                namespaceStore = getStore;
            }
            namespaces.forEach((namespace: any) => {
                let ns = new Namespace(namespace);
                this.namespacesMap.push(ns);
                let index = namespaceStore.findIndex((item: any) => item.name === ns.name);

                if (index > -1) {
                    ns.open = namespaceStore[index].open;
                } else {
                    namespaceStore.push({ name: ns.name, open: ns.open });
                }
            });
            this.setState({
                ...this.state,
                namespacesMap: this.namespacesMap
            });
            store.setObject('namespaceStore', namespaceStore);
        });
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