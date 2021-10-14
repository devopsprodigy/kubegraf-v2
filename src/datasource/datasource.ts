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
    const res = await this.__get('/api/v1/namespaces').toPromise()
        .then((res: any) => {
            return res;
        })
        .catch((err: any) =>{
            return err;
        })

    if(res.status !== 200) {
        return {status: 'error', message: res.data.message};
    }else{
        return {status: 'success', message: 'Datasource is working'};
    }
  }

  getNamespaces(){
    return this.__get('/api/v1/namespaces').toPromise()
        .then((res : any) => {
            if(!res.data.items){
                const message = 'Namespaces not received';
                appEvents.emit(AppEvents.alertError, [message]);
                return new Error(message);
            }

            return res.data.items;
        })
        .catch(e => {
            console.error(e);
            const message = 'Namespaces not received';
            appEvents.emit(AppEvents.alertError, [message]);
            return new Error(message);
        });
  }

  getComponents(){
      return this.__get('/api/v1/componentstatuses').toPromise()
          .then((res: any) => {
              if(!res.data.items){
                  const message = `Component statuses not received`;
                  appEvents.emit(AppEvents.alertError, [message]);
                  return new Error(message);
              }
              return res.data.items;
          })
          .catch(e => {
              console.error(e);
              const message = `Component statuses not received`;
              appEvents.emit(AppEvents.alertError, [message]);
              return new Error(message);
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
          .catch(e => {
              console.error(e);
              const message = 'Nodes not received';
              appEvents.emit(AppEvents.alertError, [message]);
              return new Error(message);
          });
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
