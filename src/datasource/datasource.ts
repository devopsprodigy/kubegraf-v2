import {DataFrame, DataQueryRequest, DataQueryResponse, DataSourceApi, DataSourceInstanceSettings} from '@grafana/data';
import { KubegrafDSOptions, KubegrafDSQuery } from '../types';
import {getBackendSrv} from "@grafana/runtime";

export class KubeGrafDatasource extends DataSourceApi<KubegrafDSQuery, KubegrafDSOptions> {

  constructor(public instanceSettings: DataSourceInstanceSettings<KubegrafDSOptions>) {
    super(instanceSettings);

  }

  async query(request: DataQueryRequest<KubegrafDSQuery>): Promise<DataQueryResponse> {
    const data: DataFrame[] = [];

    return { data };
  }

  async testDatasource() {
    const res = await this.getNamespaces();
    if(res.status !== 200) {
        return {status: 'error', message: res.data.message};
    }else{
        return {status: 'success', message: 'Datasource is working'};
    }
  }

  getNamespaces(){
    return this.__get('/api/v1/namespaces').toPromise()
        .then((result: any) => {
            return result;
        })
        .catch((err) => {
            return err;
        })
  }

  __get(url : string) {
    let _url = '' + this.instanceSettings.url;
    if(this.instanceSettings.jsonData.access_via_token){
      _url += '/__proxy';
    }
    _url += url;


    return getBackendSrv().fetch({
        url: _url,
        method: "GET"
    });
  }
}
