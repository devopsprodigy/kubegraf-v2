import React, {PureComponent} from "react";
import {Statefulset} from "../models/Statefulset";
import {config} from "@grafana/runtime";
import {Pod} from "../models/Pod";
import {PodCard} from "./PodCard";
import {Button} from "@grafana/ui";
import {Service} from "../models/Service";
import {ServiceCard} from "./ServiceCard";

interface Props{
    statefulset: Statefulset;
    clusterName: string;
}

export class StatefulsetCard extends PureComponent<Props>{
    private statefulset;
    private orgId;
    private clusterName;

    constructor(props: Props) {
        super(props);
        this.statefulset = props.statefulset;
        this.orgId = config.bootData.user.orgId;
        this.clusterName = props.clusterName;
    }

    state = {
        limited: true
    }

    getStatefulsetDashboardLink(){
        return `d/rXZAJ9Dnz/devopsprodigy-kubegraf-statefulsets-dashboard
        ?orgId=${this.orgId}
        &var-cluster=${this.clusterName}
        &var-namespace=${this.statefulset.data.metadata.namespace}
        &var-statefulset=${this.statefulset.name}`;
    }

    getPodsArray(){
        let pods = this.statefulset.pods
            .filter((pod: Pod) => !pod.is_deleted);
        if(this.state.limited){
            pods = pods.slice(0, this.statefulset.limit);
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
        return this.statefulset.pods.filter((pod: Pod) => !pod.is_deleted).length > this.statefulset.limit;
    }

    render() {

        const hintBtn = {
            maxWidth: '110px'
        }

        return (
            <div className={'column_cell'}>
                <h4 className={'column_cell_header'}>
                    <span>{this.statefulset.name}</span>
                    &nbsp;
                    <a href={this.getStatefulsetDashboardLink()} target={'_blank'}>
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
                {this.statefulset.services.length > 0
                    &&
                    (
                        <div className={'services'}>
                            <h5>Services</h5>
                            {this.statefulset.services.map((svc : Service) => {
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