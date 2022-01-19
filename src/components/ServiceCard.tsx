import React, {PureComponent} from "react";
import {Service} from "../models/Service";
import {Styles} from "../common/styles";
import {isLight} from "../common/utils";
import {cx} from "@emotion/css";

interface Props{
    service: Service
}

export class ServiceCard extends PureComponent<Props>{
    private service;

    styles;

    constructor(props: Props) {
        super(props);
        this.service = props.service;
        this.styles = Styles(isLight());
    }

    render() {
        return (
            <div className={'service'}>
                <span className={cx(this.styles.dotGrey)}/>
                <span className={'service_title'}>
                    {this.service.name}:&nbsp;
                    {
                        this.service.data.spec.ports.map((port: any) => {
                            return (
                                <span>{port.port} / {port.protocol}</span>
                            )
                        })
                    }
                </span>
            </div>
        );
    }
}