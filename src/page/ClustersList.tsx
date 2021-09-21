import React from 'react';
import { Button, Icon, LoadingPlaceholder } from '@grafana/ui';
import {DS_ID} from "../constants";
import {getBackendSrv, getLocationSrv} from "@grafana/runtime";
import {K8sCluster} from "../types";

let clusters: K8sCluster[] = [];


const loadClusters = async () => {
  clusters = [];
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
}

async function createCluster() {
  const data = {
    name: generateName(),
    type    : DS_ID,
    access  : "proxy",
    jsonData : {
      prometheus_name: '',
      access_via_token: false,
      refresh_pods_rate: 60
    }
  }

  await getBackendSrv().post(
      '/api/datasources',
      data
  ).then(res => {
    clusters.push({name: res.name, uid: res.datasource.uid});
    getLocationSrv().update({
      path: `/datasources/edit/${res.datasource.uid}`
    })
  })
}

function generateName() {
  let name = "New K8S cluster";

  while(isNameExists(name)) {
    if(!nameHasSuffix(name)){
      name = `${name}-1`;
    }else{
      name = `${getNewName(name)}${incrementLastDigit(getLastDigit(name))}`;
    }
  }

  return name;
}

function isNameExists (name: string) {
  return clusters.filter(cluster => {
    return cluster.name.toLowerCase() === name.toLowerCase()
  }).length > 0;
}

function nameHasSuffix(name: string) {
  return name.endsWith('-', name.length - 1);
}

function getLastDigit(name: string) {
  return parseInt(name.slice(-1), 10);
}

function incrementLastDigit(digit: number) {
  return isNaN(digit) ? 1 : digit + 1;
}

function getNewName(name: string) {
  return name.slice(0, name.length - 1);
}

export const ClustersListPage = () => {
  loadClusters().then(() => {
    setVisible(true);
  });

  const [visible, setVisible] = React.useState(false);

  return (
    <>
      <h1>Clusters list</h1>
      <br />
      <div className="row">
        <div className="col-md-6">
          {visible && (<Button variant="primary" onClick={createCluster}>
            <Icon name="plus"/>
            &nbsp;&nbsp;Add New Cluster
          </Button>)
          }
        </div>
        <div className="col-md-6">
          <div className="pull-right">
            <a href="/plugins/devopsprodigy-kubegrafv2-app?page=dashboards">
              <Button variant="primary">
                <i className="fa fa-fw fa-tachometer"></i>&nbsp;&nbsp;Dashboards
              </Button>
            </a>
            &nbsp; &nbsp; &nbsp; &nbsp;
            <a href="/plugins/devopsprodigy-kubegrafv2-app">
              <Button variant="primary">
                <i className="fa fa-fw fa-cog"></i>&nbsp;&nbsp;Plugin config
              </Button>
            </a>
          </div>
        </div>
      </div>
      <hr />

      {!visible && (
          <LoadingPlaceholder text="Loading..." />
      )}
    </>
  );
}
