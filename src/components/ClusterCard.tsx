import React, {PureComponent} from "react";
import {K8sCluster} from "../types";
import {Button, ConfirmModal} from "@grafana/ui";

interface Props {
    cluster: K8sCluster,
    clusterDelete: (uid: string) => void
}

export class ClusterCard extends PureComponent<Props>{
    private cluster;

    state = {
        showDeleteModal: false
    }

    constructor(props: any) {
        super(props);
        this.cluster = props.cluster;
    }

    generateLink = () => {
        return `/datasources/edit/${this.cluster.uid}`;
    }

    generateNodesOverviewLink = () => {
        return `/a/devopsprodigy-kubegraf-app/?page=nodes-overview&clusterId=${this.cluster.id}`;
    }

    showDeleteModal = () => {
        this.setState({showDeleteModal: true});
    }

    hideDeleteModal = () => {
        this.setState({showDeleteModal: false});
    }

    handleDelete = (uid: string) =>{
        this.props.clusterDelete(uid);
        this.hideDeleteModal();
    }

    render() {
        return (
            <>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card-section">
                            <div className="card-item">
                                <div className="card-item-header">
                                    <h2>{ this.cluster.name }</h2>
                                </div>
                                <hr/>
                                <div className="row">
                                    <div className="col-md-8">
                                        <a href="#">
                                            <Button variant="primary">
                                                <i className="fa fa-fw fa-eye" />&nbsp;&nbsp;Cluster Status
                                            </Button>
                                        </a>
                                        &nbsp;
                                        <a href="#">
                                            <Button variant="primary">
                                                <i className="fa fa-fw fa-eye" />&nbsp;&nbsp;Applications Overview
                                            </Button>
                                        </a>
                                        &nbsp;
                                        <a href={this.generateNodesOverviewLink()}>
                                            <Button variant="primary">
                                                <i className="fa fa-fw fa-eye" />&nbsp;&nbsp;Nodes Overview
                                            </Button>
                                        </a>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="pull-right">
                                            <a href={this.generateLink()}>
                                                <Button variant="primary">
                                                    <i className="fa fa-fw fa-cog" />&nbsp;&nbsp;Edit
                                                </Button>
                                            </a>
                                            &nbsp;
                                            <ConfirmModal
                                                isOpen={this.state.showDeleteModal}
                                                title="Delete cluster"
                                                body="Are you sure you want to delete this cluster?"
                                                confirmText="Yes"
                                                onConfirm={() => {
                                                    this.handleDelete(this.cluster.uid);
                                                }}
                                                onDismiss={this.hideDeleteModal}
                                            />
                                            <Button variant="destructive" onClick={this.showDeleteModal}>
                                                <i className="fa fa-fw fa-trash" />&nbsp;&nbsp;Delete
                                            </Button>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </>
        );
    }
}