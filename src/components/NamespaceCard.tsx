import {Namespace} from "../models/Namespace";
import React, {PureComponent} from "react";
import {Styles} from "../common/styles";
import {isLight} from "../common/utils";
import {cx} from "@emotion/css";

interface Props {
    namespace: Namespace;
    isPanelOpen: boolean;
}

export class NamespaceCard extends PureComponent<Props>{
    private namespace;
    styles;

    state = {
        isPanelOpen: this.props.isPanelOpen
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
        })
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
                        <div className={cx(this.styles.status)}>Status : <span className={'status'}>{this.namespace.data.status.phase}</span> </div>
                    </div>
                </div>
                {
                    this.state.isPanelOpen && (
                        <div className={cx(this.styles.namespacePanelBody)}>
                            asdasdasd
                        </div>
                    )
                }
            </div>
        )
    }
}