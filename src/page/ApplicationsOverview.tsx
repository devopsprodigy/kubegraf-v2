import React, {SyntheticEvent} from "react";
import {BasePage} from "./BasePage";
import {
    Button,
    InlineFormLabel,
    Tab,
    TabsBar,
    LegacyForms,
    ToolbarButtonRow,
    ToolbarButton,
} from "@grafana/ui";
import {SelectableValue} from "@grafana/data";
import {cx} from "@emotion/css";
import {Namespace} from "../models/Namespace";
import {Component} from "../models/Component";
import {ClusterComponent} from "../components/ClusterComponent";
import store from "../common/store";
import {NamespaceCard} from "../components/NamespaceCard";



const {Select} = LegacyForms;

const startPanelsMap = {
    "__overview" : true
}

export class ApplicationsOverview extends BasePage{


    state = {
        pageReady: false,
        clusters: [],
        currentClusterName : '',
        currentClusterId : '',

        clusterComponents: [],
        namespacesMap: [],
        openPanels: new Map<string,boolean>(Object.entries(startPanelsMap))
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
                });
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
        return this.state.namespacesMap.length;
    }

    getActiveNamespacesCount(){
        return this.state.namespacesMap.filter((item : Namespace) => item.open).length;
    }

    goToTheAnotherCluster = () => (eventItem: SyntheticEvent<HTMLInputElement> | SelectableValue<string>) => {
        const value = this.getValueFromEventItem(eventItem);
        window.location.href = `/a/devopsprodigy-kubegraf-app/?page=applications-overview&clusterId=${value}`;
    }

    showAll = () => {
        this.toggleNamespaces(true);
    }

    hideAll = () => {
        this.toggleNamespaces(false);
    }

    namespaceClickHandler(e: any, namespace: Namespace){
        if(e.ctrlKey || e.metaKey){
            if(namespace.open){
                e.preventDefault();
            }
            this.toggleNamespaces(namespace);
        }else{
            this.toggleOneNamespace(namespace);
        }
    }

    toggleNamespaces(namespace: boolean | Namespace){
        store.delete('namespaceStore');
        let namespaceStore : any = [];
        this.namespacesMap.map((ns: Namespace) => {
            ns.open = namespace === true || namespace === false ? namespace : namespace.name === ns.name;
            namespaceStore.push({name: ns.name, open: ns.open});
        });
        this.refreshNamespacesMapView();
        store.setObject('namespaceStore', namespaceStore);
    }

    toggleOneNamespace(namespace: Namespace){
        namespace.toggle();
        this.refreshNamespacesMapView();
    }

    private refreshNamespacesMapView(){
        this.setState({
            ...this.state,
            namespacesMap: []
        }, () => {
            this.setState({
                ...this.state,
                namespacesMap: this.namespacesMap
            })
        });
    }

    isPanelOpenClass(name: string){
        if(
            this.state.openPanels.get(name) === undefined || this.state.openPanels.get(name) === true
        ){
            return 'active';
        }else{
            return 'disable';
        }
    }

    isPanelOpen(name: string){
        return (this.state.openPanels.get(name) === undefined || this.state.openPanels.get(name) === true);
    }

    togglePanel = (name: string) => (e : any) =>{
        let panels = this.state.openPanels;
        if(
            panels.get(name) === undefined
            ||
            panels.get(name) === true
        ){
            panels.set(name, false);
        }else{
            panels.set(name, true);
        }
        this.setState({
            ...this.state,
            openPanels: new Map<string, boolean>(Object.entries({foo: false}))
        }, () => this.setState({
            ...this.state,
            openPanels: panels
        }))
        console.log(this.state);
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
                                        <div className={cx(this.styles.title)} onClick={this.togglePanel("__overview")} >
                                            <span className={cx(this.styles.chevron, this.isPanelOpenClass('__overview'))}></span>
                                            <h1>Overview: {this.cluster?.instanceSettings.name}. Applications</h1>
                                        </div>
                                        <div className={cx(this.styles.overviewPanelBtn)}>
                                            <span className={cx(this.styles.namespaceCounter, this.styles.overviewSpan)}>
                                                <span className={'active'}>{this.getActiveNamespacesCount()}</span> / {this.getNamespacesCount()}
                                            </span>
                                            <span className={cx(this.styles.verticalLine, this.styles.overviewSpanLast)}></span>

                                            <ToolbarButtonRow>
                                                <ToolbarButton variant={'primary'} onClick={this.showAll}>Show all</ToolbarButton>
                                                <ToolbarButton variant={'primary'} onClick={this.hideAll} icon={'question-circle'} tooltip={'Use Ctrl+Click or ⌘+Click to select only one Namespace'}>Hide all</ToolbarButton>
                                            </ToolbarButtonRow>

                                        </div>
                                    </div>

                                    {this.isPanelOpen("__overview") && (
                                        <>
                                            <div className={cx(this.styles.overviewPanelBody)}>
                                                <div className={cx(this.styles.clusterComponents)}>
                                                    <h2>Components</h2>
                                                    {this.state.clusterComponents.map((component: Component) => {
                                                        return (<ClusterComponent component={component} />)
                                                    })}
                                                </div>
                                                <div className={cx(this.styles.clusterNamespaces)}>
                                                    {this.state.namespacesMap.map((namespace: Namespace) => {
                                                        return (
                                                            <div className={cx(this.styles.checkboxContainer)} >
                                                                <input type="checkbox" id={"namespace_" + namespace.name}  checked={namespace.open} onClick={(e) => {this.namespaceClickHandler(e, namespace)}} />
                                                                <span />
                                                                <label htmlFor={"namespace_" + namespace.name} >{namespace.name}</label>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>

                                        </>
                                    )}
                                </div>

                                {
                                    this.state.namespacesMap.map((ns : Namespace) => {
                                        return ns.open && (
                                            <NamespaceCard
                                                namespace={ns}
                                                isPanelOpen={this.isPanelOpen(ns.name)}
                                            />
                                        )
                                    })
                                }
                            </>
                        )}

                    </div>
                </div>
            </>
        );
    }
}