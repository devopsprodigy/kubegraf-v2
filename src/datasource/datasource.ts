import { DataFrame, DataQueryRequest, DataQueryResponse, DataSourceApi } from '@grafana/data';
import {KubegrafDSOptions, KubegrafDSQuery} from "../types";

export class KubeGrafDatasource extends DataSourceApi<KubegrafDSQuery, KubegrafDSOptions> {
  async query(request: DataQueryRequest<KubegrafDSQuery>): Promise<DataQueryResponse> {
    const data: DataFrame[] = [];

    return { data };
  }

  testDatasource(): Promise<any> {
    return Promise.resolve(undefined);
  }
}
