import React, {PureComponent} from 'react';
import { Button, Icon, LoadingPlaceholder } from '@grafana/ui';
import {DS_ID} from "../constants";
import {getBackendSrv, getLocationSrv} from "@grafana/runtime";
import {K8sCluster} from "../types";
import {ClusterCard} from "../components/ClusterCard";

export class ClustersListPage extends PureComponent{

  state = {
    visible: false,
    clusters: []
  }


  deleteCluster =  (uid: string)  => {
    getBackendSrv().delete(`/api/datasources/uid/${uid}`)
        .then(() => {
          let clusters = this.state.clusters.filter((item : K8sCluster) => item.uid !== uid);
          this.setState({
            visible: true,
            clusters: []
          }, () => {
            this.setState({
              visible: true,
              clusters: clusters
            })
          });
        })
  }


  createCluster = async () => {
    const name = this.generateName();
    let data = {
      name: name,
      type    : DS_ID,
      access  : "proxy",
      jsonData : {
        access_via_token: false,
        refresh_pods_rate: '60'
      }
    }

    await getBackendSrv().post(
        '/api/datasources',
        data
    ).then(res => {
      getLocationSrv().update({
        path: `/datasources/edit/${res.datasource.uid}`
      })
    })
  }

  generateName = () => {
    let name = "New K8S cluster";

    while(this.isNameExists(name)) {
      if(!this.nameHasSuffix(name)){
        name = `${name}-1`;
      }else{
        name = `${this.getNewName(name)}${this.incrementLastDigit(this.getLastDigit(name))}`;
      }
    }

    return name;
  }

  private isNameExists = (name: string) => {
    return this.state.clusters.filter((cluster : K8sCluster) => {
      return cluster.name.toLowerCase() === name.toLowerCase()
    }).length > 0;
  }

  private nameHasSuffix = (name: string) => {
    return name.endsWith('-', name.length - 1);
  }

  private getNewName = (name: string) => {
    return name.slice(0, name.length - 1);
  }

  private incrementLastDigit = (digit: number) => {
    return isNaN(digit) ? 1 : digit + 1;
  }

  private getLastDigit = (name: string) => {
    return parseInt(name.slice(-1), 10);
  }

  loadClusters = async () => {

    let clusters : K8sCluster[] = [];
    await getBackendSrv().get('/api/datasources')
        .then(res => {
          clusters = res.filter((item : any) => {
            return item.type === DS_ID;
          }).map((item : any) => {
            return {
              uid: item.uid,
              name: item.name
            }
          });
        });
    this.setState({
      visible: true,
      clusters: clusters
    })
  }

  constructor(props: any) {
    super(props);
    this.loadClusters().then(() => {});

  }

  render() {
    return (
        <>
          <h1>Clusters list</h1>
          <br />
          <div className="row">
            <div className="col-md-6">
              {this.state.visible && (<Button variant="primary" onClick={this.createCluster}>
                <Icon name="plus"/>
                &nbsp;&nbsp;Add New Cluster
              </Button>)
              }
            </div>
            <div className="col-md-6">
              <div className="pull-right">
                <a href="/plugins/devopsprodigy-kubegraf-app?page=dashboards">
                  <Button variant="primary">
                    <i className="fa fa-fw fa-tachometer"/>&nbsp;&nbsp;Dashboards
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
          </div>
          <hr />

          {!this.state.visible && (
              <LoadingPlaceholder text="Loading..." />
          )}
          {this.state.visible && this.state.clusters.map((cluster: K8sCluster) => {
            return (<ClusterCard cluster={cluster} clusterDelete={this.deleteCluster.bind(cluster.uid)}/>);
          })}
        </>
    );
  }
}
