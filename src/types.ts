import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface GlobalSettings {}

export interface KubegrafDSOptions extends DataSourceJsonData {
  prometheus_name?: string;
  access_via_token?: boolean;
  refresh_pods_rate?: number | string;
  cluster_url?: string;
}

export interface SecureJsonData {
  access_token?: string;
}

export interface KubegrafDSQuery extends DataQuery {}

export interface PromInstance {
  value: string;
  label: string;
  isDefault: boolean | undefined;
}

export enum OrgRole {
  ADMIN = 'Admin',
  EDITOR = 'Editor',
  VIEWER = 'Viewer',
}

export interface User {
  email: string;
  id: number;
  isGrafanaAdmin: boolean;
  isSignedIn: boolean;
  orgId: number;
  orgName: string;
  orgRole: OrgRole;
  lightTheme: boolean;
}

export interface K8sCluster {
  id: number;
  uid: string;
  name: string;
}