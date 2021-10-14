import React, {SyntheticEvent} from "react";
import {BasePage} from "./BasePage";
import {Button, InlineFormLabel, Tab, TabsBar, LegacyForms, ToolbarButtonRow, ToolbarButton} from "@grafana/ui";
import {SelectableValue} from "@grafana/data";
import {cx} from "@emotion/css";



const {Select} = LegacyForms;


export class ApplicationsOverview extends BasePage{


    state = {
        pageReady: false,
        clusters: [],
        currentClusterName : '',
        currentClusterId : '',
    }

    constructor(props: any) {
        super(props);

        this.prepareDs().then(() => {
            this.setState({
                ...this.state,
                currentClusterName: this.cluster?.instanceSettings.name,
                currentClusterId: this.cluster?.instanceSettings.id,
                pageReady: true
            });
            this.getNamespacesMap().then(() => {
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
        window.location.href = `/a/devopsprodigy-kubegraf-app/?page=applications-overview&clusterId=${value}`;
    }

    render() {

        const hintBorder = {
            marginTop: 0
        }
        return (
            <>
                <div>
                    <div className='page-header'>
                        <div className='row'>
                            <div className='col-md-6'>
                                <TabsBar hideBorder={true}>
                                    <Tab href={this.generateCLusterStatusLink()} label={'Cluster status'} css={''}  onChangeTab={() => {}}/>
                                    <Tab href={this.generateApplicationsOverviewLink()} label={'Applications Overview'} css={''} active={true}  onChangeTab={() => {}}/>
                                    <Tab href={this.generateNodesOverviewLink()} label={'Nodes Overview'} css={''} onChangeTab={() => {}}/>
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

                        {this.state.pageReady && (
                            <>
                                <div className={cx(this.styles.overviewPanel)}>

                                    <div className={cx(this.styles.header)}>
                                        <div className={cx(this.styles.title)}>
                                            <span className={cx(this.styles.chevron, 'active')}></span>
                                            <h1>Overview: {this.cluster?.instanceSettings.name}. Applications</h1>
                                        </div>
                                        <div className={cx(this.styles.overviewPanelBtn)}>
                                            <span className={cx(this.styles.namespaceCounter, this.styles.overviewSpan)}>
                                                <span className={'active'}>10</span> / 20
                                            </span>
                                            <span className={cx(this.styles.verticalLine, this.styles.overviewSpanLast)}></span>

                                            <ToolbarButtonRow>
                                                <ToolbarButton variant={'primary'}>Show all</ToolbarButton>
                                                <ToolbarButton variant={'primary'} icon={'question-circle'} tooltip={'Use Ctrl+Click or ⌘+Click to select only one Namespace'}>Hide all</ToolbarButton>
                                            </ToolbarButtonRow>

                                        </div>
                                    </div>


                                </div>
                            </>
                        )}

                    </div>
                </div>
            </>
        );
    }
}