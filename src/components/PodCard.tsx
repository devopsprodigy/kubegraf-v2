import React, {PureComponent} from "react";
import {Pod} from "../models/Pod";
import {config} from "@grafana/runtime";
import {Styles} from "../common/styles";
import {isLight} from "../common/utils";
import {cx} from "@emotion/css";
import {Tooltip} from "@grafana/ui";

interface Props{
    pod: Pod;
    clusterName: string;
}

export class PodCard extends PureComponent<Props>{
    private pod;
    private orgId;
    private clusterName;
    styles;

    constructor(props: Props) {
        super(props);
        this.pod = props.pod;
        this.orgId = config.bootData.user.orgId;
        this.clusterName = props.clusterName;
        this.styles = Styles(isLight());
    }

    getPodDashboardLink(){
        return `d/zlWA1rDnk/devopsprodigy-kubegraf-pods-dashboard
        ?orgId=${this.orgId}
        &var-cluster=${this.clusterName}
        &var-namespace=${this.pod.data.metadata.namespace}
        &var-pod=${this.pod.name}`;
    }

    render(){
        return(
            <div className={'pod'}>
                <span className={cx(this.styles.statusIndicator, this.pod.color)}/>

                <Tooltip content={this.pod.message} placement={'bottom'}>
                    <span className={'pod_title'}>{this.pod.name}</span>
                </Tooltip>
                &nbsp;
                <a href={this.getPodDashboardLink()} target={'_blank'}>
                    <i className={'fa fa-eye'}/>
                </a>
            </div>
        )
    }
}