import {
    AppEvents,
    DataFrame,
    DataQueryRequest,
    DataQueryResponse,
    DataSourceApi,
    DataSourceInstanceSettings
} from '@grafana/data';
import { KubegrafDSOptions, KubegrafDSQuery } from '../types';
import {getBackendSrv} from "@grafana/runtime";
import appEvents from 'grafana/app/core/app_events';

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

  getNodes(){
      return this.__get('/api/v1/nodes').toPromise()
          .then((res : any) => {
              if(!res.data.items){
                  const message = 'Nodes not received';
                  appEvents.emit(AppEvents.alertError, [message]);
                  return new Error(message);
              }

              return res.data.items;
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
