import React, {PureComponent} from "react";
import {Daemonset} from "../models/Daemonset";
import {config} from "@grafana/runtime";
import {Pod} from "../models/Pod";
import {PodCard} from "./PodCard";
import {Button} from "@grafana/ui";
import {Service} from "../models/Service";
import {ServiceCard} from "./ServiceCard";

interface Props{
    daemonset: Daemonset;
    clusterName: string;
}

export class DaemonsetCard extends PureComponent<Props>{
    private daemonset;
    private orgId;
    private clusterName;


    constructor(props: Props) {
        super(props);
        this.daemonset = props.daemonset;
        this.orgId = config.bootData.user.orgId;
        this.clusterName = props.clusterName;
    }

    state = {
        limited: true
    }

    getDaemonsetDashboardLink(){
        return `d/DXW019Dnz/devopsprodigy-kubegraf-daemonsets-dashboard
        ?orgId=${this.orgId}
        &var-cluster=${this.clusterName}
        &var-namespace=${this.daemonset.data.metadata.namespace}
        &var-daemonset=${this.daemonset.name}`;
    }

    getPodsArray(){
        let pods = this.daemonset.pods
            .filter((pod: Pod) => !pod.is_deleted);
        if(this.state.limited){
            pods = pods.slice(0, this.daemonset.limit);
        }
        return pods;
    }

    showMorePods = () => {
        this.setState({
            ...this.state,
            limited: false
        })
    }

    isBtnAvailable(){
        return this.daemonset.pods.filter((pod: Pod) => !pod.is_deleted).length > this.daemonset.limit;
    }

    render() {

        const hintBtn = {
            maxWidth: '110px'
        }

        return (
            <div className={'column_cell'}>
                <h4 className={'column_cell_header'}>
                    <span>{this.daemonset.name}</span>
                    &nbsp;
                    <a href={this.getDaemonsetDashboardLink()} target={'_blank'}>
                        <i className={'fa fa-eye'}/>
                    </a>
                </h4>
                {this.getPodsArray().map((pod: Pod) => {
                    return(
                        <PodCard pod={pod} clusterName={this.clusterName}/>
                    )
                })}
                {
                    this.state.limited && this.isBtnAvailable() && (
                        <>
                            <br/>
                            <Button onClick={this.showMorePods} style={hintBtn} variant={'secondary'} size={'sm'}>Show more pods</Button>
                        </>
                    )
                }
                {this.daemonset.services.length > 0
                    &&
                    (
                        <div className={'services'}>
                            <h5>Services</h5>
                            {this.daemonset.services.map((svc : Service) => {
                                return (
                                    <ServiceCard service={svc}/>
                                )
                            })}
                        </div>
                    )
                }
            </div>
        );
    }
}