import React, {SyntheticEvent} from "react";
import {DataSourcePluginOptionsEditorProps, SelectableValue} from "@grafana/data";
import {KubegrafDSOptions, SecureJsonData} from "../../types";
import {InlineFormLabel, LegacyForms} from "@grafana/ui";
const {Select} = LegacyForms;

const refreshRates = [
    { value: '15', label: '15s' },
    { value: '30', label: '30s' },
    { value: '60', label: '1m' },
    { value: '120', label: '2m' },
    { value: '300', label: '5m' },
];

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

export const getValueFromEventItem = (eventItem : SyntheticEvent<HTMLInputElement> | SelectableValue<string>) => {
    if (!eventItem) {
        return '';
    }

    if (eventItem.hasOwnProperty('currentTarget')) {
        return eventItem.currentTarget.value;
    }

    return (eventItem as SelectableValue<string>).value;
}

export const KubegrafConfig =  (props : Props) => {
    const {options, onOptionsChange} = props;
    console.log(refreshRates);
    return (
        <>
            <h3 className="page-heading">Additional</h3>

            <div className="gf-form-group">
                <div className="gf-form-inline">
                    <div className="gf-form">
                        <InlineFormLabel width={20}>Refresh pods' rate</InlineFormLabel>
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