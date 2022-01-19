import React, {PureComponent} from "react";
import {Job} from "../models/Job";
import {Pod} from "../models/Pod";
import {PodCard} from "./PodCard";
import {Button} from "@grafana/ui";

interface Props{
    job: Job;
    clusterName: string;
}

export class JobCard extends PureComponent<Props>{

    private job;
    private clusterName;

    constructor(props: Props) {
        super(props);
        this.job = props.job;
        this.clusterName = props.clusterName;
    }

    state = {
        limited: true
    }

    getPodsArray(){
        let pods = this.job.pods
            .filter((pod: Pod) => !pod.is_deleted);
        if(this.state.limited){
            pods = pods.slice(0, this.job.limit);
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
        return this.job.pods.filter((pod: Pod) => !pod.is_deleted).length > this.job.limit;
    }

    render() {

        const hintBtn = {
            maxWidth: '110px'
        }

        return (
            <div className={'column_cell'}>
                <h4 className={'column_cell_header'}>
                    <span>{this.job.name}</span>
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
            </div>
        );
    }
}