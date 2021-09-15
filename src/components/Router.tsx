import { AppRootProps } from '@grafana/data';
import { GlobalSettings } from '../types';
import React from 'react';
import { getLocationSrv } from '@grafana/runtime';
import { ClustersListPage } from '../page/ClustersList';

type Page = {
  id: string;
  icon?: string;
};

const pages: Page[] = [
  {
    id: 'clusters-list',
  },
  {
    id: 'cluster-config',
  },
];

const getPage = (query: any) => {
  const targetPage = pages.filter(item => {
    return item.id === query.page;
  })[0];
  if (targetPage === undefined) {
    getLocationSrv().update({
      path: '/plugins/devopsprodigy-kubegrafv2-app',
    });
  }

  switch (targetPage.id) {
    case 'clusters-list':
      return <ClustersListPage />;
    /*case 'cluster-config':
      return <ClusterConfigPage />;*/
    default:
      getLocationSrv().update({
        path: '/plugins/devopsprodigy-kubegrafv2-app',
      });
      return false;
  }
};

export const Router = ({ query }: AppRootProps<GlobalSettings>) => {
  const fullHeightStyle = {
    minHeight: 'calc(100vh - 51px)',
  };

  return (
    <div style={fullHeightStyle}>
      <div className="page-container">
        <div className="page-header">
          <div className="page-header__inner">
            <span className="page-header__logo">
              <img
                className="page-header__img"
                src="public/plugins/devopsprodigy-kubegrafv2-app/img/grafanaLogo.png"
                alt="logo of DevOpsProdigy KubeGraf 2.0"
              />
            </span>
            <div className="page-header__info-block">
              <h1 className="page-header__title">
                <a className="page-header__link" href="plugins">
                  Plugins
                </a>
                <span> / DevOpsProdigy KubeGraf 2.0</span>
              </h1>
              <div className="page-header__sub-title">DevOpsProdigy</div>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="page-container">{getPage(query)}</div>
    </div>
  );
};
