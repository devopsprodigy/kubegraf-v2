import React, {PureComponent} from "react";
import {AppPluginMeta, PluginConfigPageProps} from "@grafana/data";
import {GlobalSettings} from "../types";
import {Button} from "@grafana/ui";

import {getBackendSrv} from '@grafana/runtime';

interface Props extends PluginConfigPageProps<AppPluginMeta<GlobalSettings>> {}

export class ConfigPage extends PureComponent<Props> {

    private plugin;

    constructor(props : any) {
        super(props);
        this.plugin = props.plugin;
    }


    getAction = () => {

        if(this.plugin.meta.enabled){
            return (
                <Button variant="destructive" onClick={this.disablePlugin}>Disable plugin</Button>
            )
        }else {
            return (
                <Button variant="primary" onClick={this.enablePlugin}>Enable plugin</Button>
            )
        }
    }

    enablePlugin = async () => {
        const pluginId = this.plugin.meta.id;
        await getBackendSrv()
            .fetch({
                url: `/api/plugins/${pluginId}/settings`,
                method: 'POST',
                data: {
                    enabled: true,
                    pinned: true
                }
            }).toPromise();
        window.location.reload();
    }

    disablePlugin = async () => {
        const pluginId = this.plugin.meta.id;
        await getBackendSrv()
            .fetch({
                url: `/api/plugins/${pluginId}/settings`,
                method: 'POST',
                data: {
                    enabled: false
                }
            }).toPromise();
        window.location.reload();
    }

    render() {

        return (
            <div>
                <div className="card-item">
                    <h4>DevOpsProdigy KubeGraf</h4>
                    <p>
                        An updated version of the DevOpsProdigy KubeGraf App plugin (<a className="highlight-word" href="https://grafana.com/grafana/plugins/devopsprodigy-kubegraf-app/" target="_blank">https://grafana.com/grafana/plugins/devopsprodigy-kubegraf-app/</a>) that is compatible with Grafana 8.*
                        <br/><br/>
                        This plugin allows you to visualize and analyze your Kubernetes cluster’s performance. It demonstrates in graphics the main service metrics and characteristics of the Kubernetes cluster. It also makes it easier to examine the application’s life cycle and error logs.
                    </p>
                    {this.plugin.meta.enabled && (
                        <p>Plugin installed successfully!<br/>Go to the <a href="/a/devopsprodigy-kubegrafv2-app/?page=clusters-list" className="highlight-word">Clusters list page</a></p>
                    )}
                </div>
                <br/>
                { this.getAction() }
            </div>
        )
    }
}