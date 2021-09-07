import React, {PureComponent} from "react";
import {AppRootProps} from "@grafana/data";
import {GlobalSettings} from "../types";

export class App extends PureComponent<AppRootProps<GlobalSettings>>{
    render(){
        //const {meta} = this.props;

        return(
            <h1>asd</h1>
        )
    }
}