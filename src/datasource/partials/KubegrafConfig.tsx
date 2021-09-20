import React, {SyntheticEvent} from "react";
import {DataSourcePluginOptionsEditorProps, SelectableValue} from "@grafana/data";
import {KubegrafDSOptions, PromInstance, SecureJsonData} from "../../types";
import {InlineFormLabel, LegacyForms} from "@grafana/ui";
import {getDataSourceSrv} from "@grafana/runtime";
import {PROMETHEUS_ID} from "../../constants";
const {Select} = LegacyForms;

const refreshRates = [
    { value: '15', label: '15s' },
    { value: '30', label: '30s' },
    { value: '60', label: '1m' },
    { value: '120', label: '2m' },
    { value: '300', label: '5m' },
];

let promsList : PromInstance[] = [];

type Props = Pick<DataSourcePluginOptionsEditorProps<KubegrafDSOptions, SecureJsonData>, 'options' | 'onOptionsChange'>;

const onChangeHandler = (
    key: keyof KubegrafDSOptions,
    options: Props['options'],
    onOptionsChange: Props['onOptionsChange']
) => (eventItem: SyntheticEvent<HTMLInputElement> | SelectableValue<string>) => {
    onOptionsChange({
        ...options,
        jsonData: {
            ...options.jsonData,
            [key]: getValueFromEventItem(eventItem)
        }
    })
}

const getValueFromEventItem = (eventItem : SyntheticEvent<HTMLInputElement> | SelectableValue<string>) => {
    if (!eventItem) {
        return '';
    }

    if (eventItem.hasOwnProperty('currentTarget')) {
        return eventItem.currentTarget.value;
    }

    return (eventItem as SelectableValue<string>).value;
}

const getPrometheusList = async (options : Props['options'], onOptionsChange: Props['onOptionsChange']) => {
    promsList = [];
    await getDataSourceSrv().getList({
        type: PROMETHEUS_ID
    }).filter(item => {
        return item.type === PROMETHEUS_ID;
    }).forEach(item => {
        promsList.push({
            value: item.name,
            label: item.name,
            isDefault: item.isDefault
        });

        if(options.jsonData.prometheus_name === undefined && item.isDefault){
            onOptionsChange({
                ...options,
                jsonData: {
                    ...options.jsonData,
                    ['prometheus_name'] : item.name
                }
            })
        }
        console.log(options.jsonData.prometheus_name);
    })
}

export const KubegrafConfig =  (props : Props) => {
    const {options, onOptionsChange} = props;

    getPrometheusList(options, onOptionsChange)
        .then(() => {});

    return (
        <>
            <h3 className="page-heading">Additional</h3>

            <div className="gf-form-group">
                <div className="gf-form-inline">
                    <div className="gf-form">
                        <InlineFormLabel width={13}>Prometheus' instance</InlineFormLabel>
                        <Select
                            options={promsList}
                            value={promsList.find((o) => o.value === options.jsonData.prometheus_name)}
                            width={10}
                            onChange={onChangeHandler('prometheus_name', options, onOptionsChange)}
                        />
                    </div>
                </div>
                <div className="gf-form-inline">
                    <div className="gf-form">
                        <InlineFormLabel width={13}>Refresh pods' rate</InlineFormLabel>
                        <Select
                            options={refreshRates}
                            value={refreshRates.find((o) => o.value === options.jsonData.refresh_pods_rate)}
                            width={10}
                            onChange={onChangeHandler('refresh_pods_rate', options, onOptionsChange)}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}