import {Namespace} from "../models/Namespace";
import React, {PureComponent} from "react";
import {Styles} from "../common/styles";
import {isLight} from "../common/utils";
import {cx} from "@emotion/css";
import {DeploymentCard} from "./DeploymentCard";
import {Deployment} from "../models/Deployment";
import {Statefulset} from "../models/Statefulset";
import {StatefulsetCard} from "./StatefulsetCard";
import {DaemonsetCard} from "./DaemonsetCard";
import {Daemonset} from "../models/Daemonset";
import {CronJob} from "../models/CronJob";
import {CronjobCard} from "./CronjobCard";

interface Props {
    namespace: Namespace;
    isPanelOpen: boolean;
    clusterName: string | undefined;
};

const startColumns = [
    {
        colName: 'Deployments',
        nsKey: 'deployments',
        isOpen: true
    },
    {
        colName: 'Statefulsets',
        nsKey: 'statefulsets',
        isOpen: true
    },
    {
        colName: 'Daemonsets',
        nsKey: 'daemonsets',
        isOpen: true
    },
    {
        colName: 'Other pods',
        nsKey: 'other',
        isOpen: false
    },
    {
        colName: 'Cron Jobs',
        nsKey: 'cronjobs',
        isOpen: false
    },
    {
        colName: 'Jobs',
        nsKey: 'jobs',
        isOpen: false
    },
]

export class NamespaceCard extends PureComponent<Props>{
    private namespace;
    private clusterName;
    styles;

    state = {
        isPanelOpen: this.props.isPanelOpen,
        columns: startColumns
    }

    constructor(props: any) {
        super(props);
        this.styles = Styles(isLight());
        this.namespace = props.namespace;
        this.clusterName = props.clusterName;
    }

    isPanelOpenClass(){
        if(this.state.isPanelOpen){
            return 'active';
        }else{
            return 'disable';
        }
    }

    togglePanel = () => {
        this.setState({
            ...this.state,
            isPanelOpen: !this.state.isPanelOpen
        });
    }

    isColOpen = (colKey : string) => {
        const col = this.state.columns.filter((item: any) => item.nsKey === colKey)[0];
        if(col === undefined)
            return false;

        return col.isOpen
    }

    toggleCol = (colKey: string) => {
        let cols = this.state.columns;
        let col = cols.filter((col: any) => col.nsKey === colKey)[0];
        if(col != undefined){
            col.isOpen = !col.isOpen
        }
        this.setState({
            ...this.state,
            columns: []
        }, () => this.setState({
            ...this.state,
            columns: cols
        }));
        console.log(this.state);
    }


    render(){
        return(
            <div className={cx(this.styles.namespacePanel)}>
                <div className={'header'}>
                    <div className={cx(this.styles.title)} onClick={this.togglePanel}>
                        <span className={cx(this.styles.chevron, this.isPanelOpenClass())} />
                        <h1>Namespace: {this.namespace.name}</h1>
                    </div>
                    <div className={cx(this.styles.namespacePanelBtn)}>

                        {!this.isColOpen('cronjobs') && (
                            <span className={cx(this.styles.btn, 'btn-grey')} onClick={() => {
                                this.toggleCol('cronjobs');
                            }}>
                                SHOW CronJobs ({this.namespace.cronjobs ? this.namespace.cronjobs.length : 0})
                            </span>
                        )}

                        {!this.isColOpen('jobs') && (
                            <span className={cx(this.styles.btn, 'btn-grey')} onClick={() => {
                                this.toggleCol('jobs');
                            }}>
                                SHOW Jobs ({this.namespace.jobs ? this.namespace.jobs.length : 0})
                            </span>
                        )}

                        {!this.isColOpen('other') && (
                            <span className={cx(this.styles.btn, 'btn-grey')} onClick={() => {
                                this.toggleCol('other');
                            }}>
                                SHOW Other Pods ({this.namespace.otherPods ? this.namespace.otherPods.length : 0})
                            </span>
                        )}

                        <div className={cx(this.styles.status)}>Status : <span className={'status'}>{this.namespace.data.status.phase}</span> </div>
                    </div>
                </div>
                {
                    this.state.isPanelOpen && (
                        <div className={cx(this.styles.namespacePanelBody)}>
                            {this.state.columns.map((col: any) => {
                                    return col.isOpen && (
                                        <>
                                            <div className={'column'}>
                                                <div className={'column_header'}>
                                                    <h3>{col.colName}</h3>
                                                    {col.nsKey === "cronjobs" && (
                                                        <span className={cx(this.styles.btn, 'btn-grey')} onClick={() => {
                                                            this.toggleCol('cronjobs');
                                                        }}>HIDE</span>
                                                    )}
                                                    {col.nsKey === "jobs" && (
                                                        <span className={cx(this.styles.btn, 'btn-grey')} onClick={() => {
                                                            this.toggleCol('jobs');
                                                        }}>HIDE</span>
                                                    )}
                                                    {col.nsKey === "other" && (
                                                        <span className={cx(this.styles.btn, 'btn-grey')} onClick={() => {
                                                            this.toggleCol('other');
                                                        }}>HIDE</span>
                                                    )}
                                                </div>
                                                {col.nsKey === 'deployments' && (
                                                    (
                                                        (
                                                        this.namespace.deployments.length > 0 && this.namespace.deployments.map((deployment: Deployment) => <DeploymentCard clusterName={this.clusterName} deployment={deployment}/>)
                                                        )
                                                        ||
                                                        (
                                                            this.namespace.deployments.length === 0 && (
                                                                <div className={'column_cell'}>
                                                                    <h4 className={'column_cell_header'}>No data</h4>
                                                                </div>
                                                            )
                                                        )
                                                    )
                                                )}
                                                {col.nsKey === 'statefulsets' && (
                                                    (
                                                        (
                                                        this.namespace.statefulsets.length > 0 && this.namespace.statefulsets.map((statefulset: Statefulset) => <StatefulsetCard clusterName={this.clusterName} statefulset={statefulset}/>)
                                                        )
                                                        ||
                                                        (
                                                            this.namespace.statefulsets.length === 0 && (
                                                                <div className={'column_cell'}>
                                                                    <h4 className={'column_cell_header'}>No data</h4>
                                                                </div>
                                                            )
                                                        )
                                                    )
                                                )}
                                                {col.nsKey === 'daemonsets' && (
                                                    (
                                                        (
                                                        this.namespace.daemonsets.length > 0 && this.namespace.daemonsets.map((daemonset: Daemonset) => <DaemonsetCard clusterName={this.clusterName} daemonset={daemonset}/>)
                                                        )
                                                        ||
                                                        (
                                                            this.namespace.daemonsets.length === 0 && (
                                                                <div className={'column_cell'}>
                                                                    <h4 className={'column_cell_header'}>No data</h4>
                                                                </div>
                                                            )
                                                        )
                                                    )
                                                )}
                                                {col.nsKey === 'cronjobs' && (
                                                    (
                                                        (
                                                        this.namespace.cronjobs.length > 0 && this.namespace.cronjobs.map((cron: CronJob) => <CronjobCard clusterName={this.clusterName} cronjob={cron}/>)
                                                        )
                                                        ||
                                                        (
                                                            this.namespace.cronjobs.length === 0 && (
                                                                <div className={'column_cell'}>
                                                                    <h4 className={'column_cell_header'}>No data</h4>
                                                                </div>
                                                            )
                                                        )
                                                    )
                                                )}
                                            </div>
                                        </>
                                    )
                                })
                            }
                        </div>
                    )
                }
            </div>
        )
    }
}