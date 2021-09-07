import React, {PureComponent} from "react";
import {AppPluginMeta, PluginConfigPageProps} from "@grafana/data";
import {GlobalSettings} from "../types";
import {Button} from "@grafana/ui";

interface Props extends PluginConfigPageProps<AppPluginMeta<GlobalSettings>> {}

export class ConfigPage extends PureComponent<Props> {
    render() {
        //const {plugin} = this.props;

        return (
            <div>
                <div class="card-item">
                    <h4>DevOpsProdigy KubeGraf</h4>
                    <p>
                        An updated version of the DevOpsProdigy KubeGraf App plugin (<a className="highlight-word" href="https://grafana.com/grafana/plugins/devopsprodigy-kubegraf-app/" target="_blank">https://grafana.com/grafana/plugins/devopsprodigy-kubegraf-app/</a>) that is compatible with Grafana 8.*
                        <br/><br/>
                        This plugin allows you to visualize and analyze your Kubernetes cluster’s performance. It demonstrates in graphics the main service metrics and characteristics of the Kubernetes cluster. It also makes it easier to examine the application’s life cycle and error logs.
                    </p>
                </div>
                <br/>
                <Button variant="primary">Enable plugin</Button>
            </div>
        )
    }
}