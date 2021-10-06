import React, { ChangeEvent, SyntheticEvent } from 'react';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { KubegrafDSOptions, SecureJsonData } from '../../types';

import { LegacyForms } from '@grafana/ui';

const { Switch, SecretFormField } = LegacyForms;

type Props = Pick<DataSourcePluginOptionsEditorProps<KubegrafDSOptions, SecureJsonData>, 'options' | 'onOptionsChange'>;

export const onResetAccessToken = (options: Props['options'], onOptionsChange: Props['onOptionsChange']) => (
  eventItem: SyntheticEvent<HTMLButtonElement, Event>
) => {
  onOptionsChange({
    ...options,
    secureJsonFields: {
      ...options.secureJsonFields,
      access_token: false,
    },
    secureJsonData: {
      ...options.secureJsonData,
      access_token: '',
    },
  });
};

export const onAccessTokenChange = (options: Props['options'], onOptionsChange: Props['onOptionsChange']) => (
  event: ChangeEvent<HTMLInputElement>
) => {
  onOptionsChange({
      ...options,
      secureJsonData: {
          access_token: getValueFromEventItem(event)
      },
      jsonData: {
          ...options.jsonData,
          cluster_url: options.url
      }
  })
};

const getValueFromEventItem = (eventItem: SyntheticEvent<HTMLInputElement>) => {
  if (!eventItem) {
    return '';
  }

  return eventItem.currentTarget.value;
};

export const TokenConfig = (props: Props) => {
  const { options, onOptionsChange } = props;
  const {secureJsonFields} = options;
  const secureJsonData = (options.secureJsonData || {}) as SecureJsonData;

  function isConfigured(): boolean {
    return (secureJsonFields && secureJsonFields.access_token) as boolean;
  }

  return (
    <>
      <h3 className="page-heading">Bearer token access</h3>

      <div className="gf-form-group">
        <div className="gf-form-inline">
          <div className="gf-form">
            <Switch
              label="Access via token"
              labelClass="width-13"
              checked={options.jsonData.access_via_token === true}
              onChange={event =>
                onOptionsChange({
                  ...options,
                  jsonData: { ...options.jsonData, access_via_token: event!.currentTarget.checked, cluster_url: options.url },
                })
              }
            />
          </div>
        </div>
        {options.jsonData.access_via_token && (
          <div className="gf-form-inline">
            <div className="gf-form">
              <SecretFormField
                label="Access token"
                labelWidth={13}
                inputWidth={20}
                value={secureJsonData.access_token}
                onReset={onResetAccessToken(options, onOptionsChange)}
                isConfigured={isConfigured()}
                autoComplete={'new-password'}
                onChange={onAccessTokenChange(options, onOptionsChange)}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};
