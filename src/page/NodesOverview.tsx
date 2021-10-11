import React, {SyntheticEvent} from "react";
import {BasePage} from "./BasePage";
import {Button, InlineFormLabel, LegacyForms, Tab, TabsBar} from "@grafana/ui";
import {SelectableValue} from "@grafana/data";

const {Select} = LegacyForms;


export class NodesOverviewPage extends BasePage{

    state = {
        pageReady: false,
        clusters: [],
        currentClusterName : '',
        currentClusterId : '',
    }

    constructor(props: any) {
        super(props);

        this.prepareDs().then(() => {
            this.getNodesMap().then(() => {
                this.setState({
                    ...this.state,
                    currentClusterName: this.cluster?.instanceSettings.name,
                    currentClusterId: this.cluster?.instanceSettings.id,
                    pageReady: true
                });
                console.log(this.state);
            })
        });

        this.getAvailableClusters()
            .then((res) => {
                this.setState({
                    ...this.state,
                    clusters: res
                })
            });

    }

    goToTheAnotherCluster = () => (eventItem: SyntheticEvent<HTMLInputElement> | SelectableValue<string>) => {
        const value = this.getValueFromEventItem(eventItem);
        window.location.href = `/a/devopsprodigy-kubegraf-app/?page=nodes-overview&clusterId=${value}`;
    }

    getValueFromEventItem(eventItem : SyntheticEvent<HTMLInputElement> | SelectableValue<string>){
        if (!eventItem) {
            return '';
        }

        if (eventItem.hasOwnProperty('currentTarget')) {
            return eventItem.currentTarget.value;
        }

        return (eventItem as SelectableValue<string>).value;
    }

    render() {

        const hintBorder = {
            marginTop: 0
        }

        return (
            <>
                {this.state.pageReady && (
                    <div>
                        <div className='page-header'>
                            <div className='row'>
                                <div className='col-md-6'>
                                    <TabsBar hideBorder={true}>
                                        <Tab href={this.generateCLusterStatusLink()} label={'Cluster status'} css={''} onChangeTab={() => {}}/>
                                        <Tab href={this.generateApplicationsOverviewLink()} label={'Applications Overview'} css={''}  onChangeTab={() => {}}/>
                                        <Tab href={this.generateNodesOverviewLink()} label={'Nodes Overview'} active={true} css={''} onChangeTab={() => {}}/>
                                    </TabsBar>
                                </div>
                                {this.isAdmin && (
                                    <div className='col-md-6'>
                                        <div className='pull-right'>
                                            <a href="/plugins/devopsprodigy-kubegraf-app?page=dashboards">
                                                <Button variant="primary">
                                                    <i className="fa fa-fw fa-tachometer"/>&nbsp;&nbsp;Dashboards
                                                </Button>
                                            </a>
                                            &nbsp; &nbsp; &nbsp; &nbsp;
                                            <a href={this.generateEditLink()}>
                                                <Button variant="primary">
                                                    <i className="fa fa-fw fa-cog" />&nbsp;&nbsp;Edit
                                                </Button>
                                            </a>
                                            &nbsp; &nbsp; &nbsp; &nbsp;
                                            <a href="/plugins/devopsprodigy-kubegraf-app">
                                                <Button variant="primary">
                                                    <i className="fa fa-fw fa-cog"/>&nbsp;&nbsp;Plugin config
                                                </Button>
                                            </a>
                                        </div>

                                    </div>
                                )}

                                {!this.isAdmin && (
                                    <div className='col-md-6'>
                                        <div className='pull-right'>
                                            <a href="/plugins/devopsprodigy-kubegraf-app">
                                                <Button variant="primary">
                                                    <i className="fa fa-fw fa-cog"/>&nbsp;&nbsp;Plugin info
                                                </Button>
                                            </a>
                                        </div>

                                    </div>
                                )}

                            </div>

                            <hr style={hintBorder} />

                            <div className='gf-form-group'>
                                <div className='gf-form-inline'>
                                    <div className='gf-form'>
                                        <InlineFormLabel width={10}>Select cluster</InlineFormLabel>
                                        <Select options={this.state.clusters}
                                                value={this.state.clusters.find((o: any) => o.value === this.state.currentClusterId)}
                                                width={10}
                                                onChange={this.goToTheAnotherCluster()} />
                                    </div>
                                </div>
                            </div>

                            <div className='overview-panel'>
                                <h1>Overview: {this.cluster?.instanceSettings.name}. Nodes</h1>
                            </div>

                        </div>
                    </div>
                )}
            </>
        );
    }
}