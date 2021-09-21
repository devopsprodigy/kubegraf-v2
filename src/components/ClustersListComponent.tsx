import React, {PureComponent} from "react";
import {K8sCluster} from "../types";
import {ClusterCard} from "./ClusterCard";


interface Props {clusters: K8sCluster[]}


export class ClustersListComponent extends PureComponent<Props>{
    private clusters;

    constructor(props: any) {
        super(props);
        this.clusters = this.props.clusters;
    }

    render() {
        return (
            this.clusters.map((cluster: K8sCluster) => {
                return (<ClusterCard cluster={cluster} />);
            })
        );
    }
}