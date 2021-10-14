import React, {PureComponent} from "react";
import {Component} from "../models/Component";

import {cx} from "@emotion/css";
import {Styles} from "../common/styles";
import {isLight} from "../common/utils";
import {Tooltip} from "@grafana/ui";

interface Props {
    component: Component
}

export class ClusterComponent extends PureComponent<Props>{
    private component;
    styles;

    constructor(props: any) {
        super(props);
        this.styles = Styles(isLight());

        this.component = props.component;
    }

    getClass(){
        if(this.component.status){
            return 'red';
        }else{
            return 'green';
        }
    }

    render(){
        return (
            <div className={'component'}>
                <span className={cx(this.styles.statusIndicator, this.getClass())}/>
                <Tooltip content={this.component.message}>
                    <span>{this.component.name}</span>
                </Tooltip>
            </div>
        )
    }
}