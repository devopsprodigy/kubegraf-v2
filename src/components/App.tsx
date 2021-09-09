import React, {PureComponent} from "react";
import {AppRootProps} from "@grafana/data";
import {GlobalSettings} from "../types";
import {Router} from "./Router";

export class App extends PureComponent<AppRootProps<GlobalSettings>>{


    render(){

        return(
            <Router {...this.props} />
        )
    }
}