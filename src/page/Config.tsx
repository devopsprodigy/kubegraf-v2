import React, {PureComponent} from "react";
import {AppPluginMeta, PluginConfigPageProps} from "@grafana/data";
import {GlobalSettings} from "../types";

interface Props extends PluginConfigPageProps<AppPluginMeta<GlobalSettings>> {}

export class ConfigPage extends PureComponent<Props> {
    render() {
        //const {plugin} = this.props;

        return (
            <h1>Test</h1>
        )
    }
}