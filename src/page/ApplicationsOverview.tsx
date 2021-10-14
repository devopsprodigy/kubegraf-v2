import React, {SyntheticEvent} from "react";
import {BasePage} from "./BasePage";
import {Button, InlineFormLabel, Tab, TabsBar, LegacyForms, ToolbarButtonRow, ToolbarButton} from "@grafana/ui";
import {SelectableValue} from "@grafana/data";
import {cx} from "@emotion/css";
import {Namespace} from "../models/Namespace";
import {Component} from "../models/Component";
import {ClusterComponent} from "../components/ClusterComponent";



const {Select} = LegacyForms;


export class ApplicationsOverview extends BasePage{


    state = {
        pageReady: false,
        clusters: [],
        currentClusterName : '',
        currentClusterId : '',

        clusterComponents: []
    }

    constructor(props: any) {
        super(props);

        this.prepareDs().then(() => {
            this.setState({
                ...this.state,
                currentClusterName: this.cluster?.instanceSettings.name,
                currentClusterId: this.cluster?.instanceSettings.id
            });
            this.getNamespacesMap().then(() => {
                this.setState({
                    ...this.state,
                    pageReady: true
                })
            });

            this.getClusterComponents();

        });


        this.getAvailableClusters()
            .then((res) => {
                this.setState({
                    ...this.state,
                    clusters: res
                })
            });
    }

    getClusterComponents(){
        console.log('get components');
        this.cluster?.getComponents().then((components: any) => {
            if(components instanceof Array){
                this.componentsError = false;
                this.storeComponents = components.map((component: any) => new Component(component));
            }else {
                this.componentsError = components;
            }

            this.setState({
                ...this.state,
                clusterComponents: this.storeComponents
            });

            setTimeout(() => this.getClusterComponents(), this.refreshRate);
        });
    }

    getNamespacesCount(){
        return this.namespacesMap.length;
    }

    getActiveNamespacesCount(){
        return this.namespacesMap.filter((item : Namespace) => item.open).length;
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
                            <div className='col-md-5'>
                                <TabsBar hideBorder={true}>
                                    <Tab href={this.generateCLusterStatusLink()} label={'Cluster status'} css={''}  onChangeTab={() => {}}/>
                                    <Tab href={this.generateApplicationsOverviewLink()} label={'Applications Overview'} css={''} active={true}  onChangeTab={() => {}}/>
                                    <Tab href={this.generateNodesOverviewLink()} label={'Nodes Overview'} css={''} onChangeTab={() => {}}/>
                                </TabsBar>
                            </div>
                            {this.isAdmin && (
                                <div className='col-md-7'>
                                    <div className='pull-right'>
                                        <div className={cx('gf-form-group', this.styles.gfInline)}>
                                            <div className='gf-form-inline'>
                                                <div className='gf-form'>
                                                    <InlineFormLabel width={6}>Select cluster</InlineFormLabel>
                                                    <Select options={this.state.clusters}
                                                            value={this.state.clusters.find((o: any) => o.value === this.state.currentClusterId)}
                                                            width={8}
                                                            onChange={this.goToTheAnotherCluster()} />
                                                </div>
                                            </div>
                                        </div>
                                        &nbsp;
                                        &nbsp;
                                        <a href="/plugins/devopsprodigy-kubegraf-app?page=dashboards">
                                            <Button variant="primary">
                                                <i className="fa fa-fw fa-tachometer"/>&nbsp;&nbsp;Dashboards
                                            </Button>
                                        </a>
                                        &nbsp; &nbsp;
                                        <a href={this.generateEditLink()}>
                                            <Button variant="primary">
                                                <i className="fa fa-fw fa-cog" />&nbsp;&nbsp;Edit
                                            </Button>
                                        </a>
                                        &nbsp; &nbsp;
                                        <a href="/plugins/devopsprodigy-kubegraf-app">
                                            <Button variant="primary">
                                                <i className="fa fa-fw fa-cog"/>&nbsp;&nbsp;Plugin config
                                            </Button>
                                        </a>
                                    </div>

                                </div>
                            )}

                            {!this.isAdmin && (
                                <div className='col-md-7'>
                                    <div className='pull-right'>
                                        <div className={cx('gf-form-group', this.styles.gfInline)}>
                                            <div className='gf-form-inline'>
                                                <div className='gf-form'>
                                                    <InlineFormLabel width={6}>Select cluster</InlineFormLabel>
                                                    <Select options={this.state.clusters}
                                                            value={this.state.clusters.find((o: any) => o.value === this.state.currentClusterId)}
                                                            width={8}
                                                            onChange={this.goToTheAnotherCluster()} />
                                                </div>
                                            </div>
                                        </div>
                                        &nbsp;
                                        &nbsp;
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
                                                <span className={'active'}>{this.getActiveNamespacesCount()}</span> / {this.getNamespacesCount()}
                                            </span>
                                            <span className={cx(this.styles.verticalLine, this.styles.overviewSpanLast)}></span>

                                            <ToolbarButtonRow>
                                                <ToolbarButton variant={'primary'}>Show all</ToolbarButton>
                                                <ToolbarButton variant={'primary'} icon={'question-circle'} tooltip={'Use Ctrl+Click or ⌘+Click to select only one Namespace'}>Hide all</ToolbarButton>
                                            </ToolbarButtonRow>

                                        </div>
                                    </div>

                                    <div className={cx(this.styles.overviewPanelBody)}>
                                        <div className={cx(this.styles.clusterComponents)}>
                                            <h2>Components</h2>
                                            {this.state.clusterComponents.map((component: Component) => {
                                                return (<ClusterComponent component={component} />)
                                            })}
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