import React, { ComponentType } from 'react';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import {Button, DataSourceHttpSettings} from '@grafana/ui';
import { KubegrafDSOptions, SecureJsonData } from '../types';
import { TokenConfig } from './partials/TokenConfig';
import {KubegrafConfig} from "./partials/KubegrafConfig";

type Props = DataSourcePluginOptionsEditorProps<KubegrafDSOptions, SecureJsonData>;

export const ConfigPage: ComponentType<Props> = ({ options, onOptionsChange }) => {
  return (
    <>
      <DataSourceHttpSettings
        defaultUrl="https://127.0.0.1:8443"
        dataSourceConfig={options}
        onChange={onOptionsChange}
      />

      <TokenConfig options={options} onOptionsChange={onOptionsChange} />

      <hr />

      <KubegrafConfig options={options} onOptionsChange={onOptionsChange}/>

        <hr/>
        <a href="/a/devopsprodigy-kubegrafv2-app/?page=clusters-list">
            <Button variant="primary">
                <i className="fa fa-fw fa-list-ul"/>&nbsp;&nbsp;Clusters
            </Button>
        </a>
    </>
  );
};
