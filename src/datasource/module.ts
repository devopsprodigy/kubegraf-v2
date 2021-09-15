import { DataSourcePlugin } from '@grafana/data';
import { KubeGrafDatasource } from './datasource';
import {ConfigPage} from "./Config";

export const plugin = new DataSourcePlugin(KubeGrafDatasource)
    .setConfigEditor(ConfigPage);
