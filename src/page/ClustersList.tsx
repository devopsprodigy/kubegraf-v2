import React from 'react';
import {Button, Icon, LoadingPlaceholder} from '@grafana/ui';

export const ClustersListPage = () => {
  return (
    <div>
      <h1>Clusters list</h1>
      <br />
      <div className="row">
        <div className="col-md-6">
          <a href="/a/devopsprodigy-kubegrafv2-app/?page=cluster-config">
            <Button variant="primary"><Icon name="plus" />&nbsp;&nbsp;Add New Cluster</Button>
          </a>
        </div>
        <div className="col-md-6">
            <div className="pull-right">
                <a href="/plugins/devopsprodigy-kubegrafv2-app?page=dashboards">
                    <Button variant="primary"><i className="fa fa-fw fa-tachometer"></i>&nbsp;&nbsp;Dashboards</Button>
                </a>
                &nbsp;
                &nbsp;
                &nbsp;
                &nbsp;
                <a href="/plugins/devopsprodigy-kubegrafv2-app">
                    <Button variant="primary"><i className="fa fa-fw fa-cog"></i>&nbsp;&nbsp;Plugin config</Button>
                </a>
            </div>
        </div>
      </div>
      <hr />

      <LoadingPlaceholder text="Loading..." />
    </div>
  );
};
