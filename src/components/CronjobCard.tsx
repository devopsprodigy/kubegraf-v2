import React, {PureComponent} from "react";
import {CronJob} from "../models/CronJob";
import {Job} from "../models/Job";
import {Pod} from "../models/Pod";
import {PodCard} from "./PodCard";
import {Button} from "@grafana/ui";

interface Props{
    cronjob: CronJob;
    clusterName: string;
}

export class CronjobCard extends PureComponent<Props>{
    private cronjob;
    private clusterName;

    constructor(props: Props) {
        super(props);
        this.cronjob = props.cronjob;
        this.clusterName = props.clusterName;
    }

    state = {
        limited: true
    }

    getJobsArray(){
        let jobs = this.cronjob.jobs
            .filter((job: Job) => !job.is_deleted);
        if(this.state.limited){
            jobs = jobs.slice(0, this.cronjob.limit);
        }
        return jobs;
    }

    showMoreJobs = () => {
        this.setState({
            ...this.state,
            limited: false
        })
    }

    isBtnAvailable(){
        return this.cronjob.jobs.filter((job: Job) => !job.is_deleted).length > this.cronjob.limit;
    }

    render() {

        const hintBtn = {
            maxWidth: '110px'
        }

        return (
            <div className={'column_cell'}>
                <h4 className={'column_cell_header'}>
                    <span>{this.cronjob.name}</span>
                </h4>
                {
                    this.getJobsArray().map((job: Job) => {
                        return job.pods.map((pod: Pod) => {
                            return (
                                <PodCard pod={pod} clusterName={this.clusterName}/>
                            )
                        })
                    })
                }
                {
                    this.state.limited && this.isBtnAvailable() && (
                        <>
                            <br/>
                            <Button onClick={this.showMoreJobs} style={hintBtn} variant={'secondary'} size={'sm'}>Show more jobs</Button>
                        </>
                    )
                }
            </div>
        );
    }
}