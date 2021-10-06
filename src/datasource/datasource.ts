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
    let res = await this.getNamespaces().then(
        (res) => {
          console.log(res);
        },
        (error) => {
          console.log(error);
        }
    );
    return Promise.resolve(res);
  }

  getNamespaces(){
    return this.__get('/api/v1/namespaces')
        .then((result) => {
          console.log(result);
          return result.items;
        })
        .catch((err) => {
          console.error(err);
        })
  }

  __get(url : string) {
    let _url = '' + this.instanceSettings.url;
    if(this.instanceSettings.jsonData.access_via_token){
      _url += '/__proxy';
    }
    _url += url;



    return getBackendSrv().datasourceRequest({
      url: _url,
      method: "GET"
    }).then(
        (response) => {
          console.log(1);
          return response.data;
        },
        (error) => {
          console.log(2);
          return error;
        }
    )
  }
}
