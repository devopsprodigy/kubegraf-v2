import React, {PureComponent} from "react";
import {Deployment} from "../models/Deployment";
import {config} from "@grafana/runtime";
import {Pod} from "../models/Pod";
import {PodCard} from "./PodCard";
import {Button} from "@grafana/ui";
import {Service} from "../models/Service";
import {ServiceCard} from "./ServiceCard";

interface Props {
    deployment: Deployment;
    clusterName: string;
}

export class DeploymentCard extends PureComponent<Props>{
    private deployment;
    private orgId;
    private clusterName;


    constructor(props: any) {
        super(props);
        this.deployment = props.deployment;
        this.orgId = config.bootData.user.orgId;
        this.clusterName = props.clusterName;
    }

    state = {
        limited: true
    }

    getDeploymentDashboardLink(){
        return `d/B_WA19v7z/devopsprodigy-kubegraf-deployments-dashboard
        ?orgId=${this.orgId}
        &var-cluster=${this.clusterName}
        &var-namespace=${this.deployment.data.metadata.namespace}
        &var-deployment=${this.deployment.name}`;
    }

    getPodsArray(){
        let pods = this.deployment.pods
            .filter((pod: Pod) => !pod.is_deleted);
        if(this.state.limited){
            pods = pods.slice(0, this.deployment.limit);
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
        return this.deployment.pods.filter((pod: Pod) => !pod.is_deleted).length > this.deployment.limit;
    }

    render() {

        const hintBtn = {
            maxWidth: '110px'
        }

        return (
            <div className={'column_cell'}>
                <h4 className={'column_cell_header'}>
                    <span>{this.deployment.name}</span>
                    &nbsp;
                    <a href={this.getDeploymentDashboardLink()} target={'_blank'}>
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
                {this.deployment.services.length > 0
                    &&
                    (
                        <div className={'services'}>
                            <h5>Services</h5>
                            {this.deployment.services.map((svc : Service) => {
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