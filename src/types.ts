import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface GlobalSettings {}

export interface KubegrafDSOptions extends DataSourceJsonData {
  prometheus_name?: string;
  access_via_token?: boolean;
  refresh_pods_rate?: number | string;
}

export interface SecureJsonData {
  access_token?: string;
}

export interface KubegrafDSQuery extends DataQuery {}

export interface PromsList {
  value: string;
  label: string;
  isDefault: boolean | undefined;
}
