import {DataQuery, DataSourceJsonData} from "@grafana/data";

export interface GlobalSettings {}

export interface KubegrafDSOptions extends DataSourceJsonData{
    refresh_pods_rate: number;
    access_via_token: boolean;
    prometheus_name: string;
}

export interface KubegrafDSQuery extends DataQuery{};