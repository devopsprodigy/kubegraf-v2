import {Namespace} from "../models/Namespace";
import React, {PureComponent} from "react";
import {Styles} from "../common/styles";
import {isLight} from "../common/utils";
import {cx} from "@emotion/css";

interface Props {
    namespace: Namespace;
    isPanelOpen: boolean;
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
        nsKey: 'cronJobs',
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
    styles;

    state = {
        isPanelOpen: this.props.isPanelOpen,
        columns: startColumns
    }

    constructor(props: any) {
        super(props);
        this.styles = Styles(isLight());
        this.namespace = props.namespace;
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

                        {!this.isColOpen('cronJobs') && (
                            <span className={cx(this.styles.btn, 'btn-grey')} onClick={() => {
                                this.toggleCol('cronJobs');
                            }}>
                                SHOW CronJobs ({this.namespace.cronJobs ? this.namespace.cronJobs.length : 0})
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
                            {
                                this.state.columns.map((col: any) => {
                                    return col.isOpen && (
                                        <div className={'column'}>
                                            <div className={'column_header'}>
                                                <h3>{col.colName}</h3>
                                                {col.nsKey === "cronJobs" && (
                                                    <span className={cx(this.styles.btn, 'btn-grey')} onClick={() => {
                                                        this.toggleCol('cronJobs');
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
                                        </div>
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