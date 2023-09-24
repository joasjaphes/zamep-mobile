import { useMemo } from 'react';
import { useQuery } from 'react-query';

import AutocompleteInput from './AutocompleteInput';
import { useLocalization } from '../localization';

export default function StreetInput({
  name = 'street', control, defaultValue, required = true, type, ...props
}) {
  const { t } = useLocalization();

  const { data: { streets = [] } = {} } = useQuery(['streets', { endpoint: 'streets' }], { refetchOnMount: 'always' });

  const dataSet = useMemo(() => {
    if (streets?.length) {
      return streets.map(({ id, name: title }) => ({ id, title }));
    }
    return null;
  }, [streets]);

  return (
    <AutocompleteInput
      name={name}
      defaultValue={defaultValue}
      placeholder={t('Village/Zone')}
      autoComplete="street-address"
      control={control}
      dataSet={dataSet}
      rules={{
        required: required && t('Please select village/zone'),
      }}
      {...props}
    />
  );
}
