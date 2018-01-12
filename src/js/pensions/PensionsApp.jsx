import React from 'react';

import FormApp from '../common/schemaform/containers/FormApp';
import formConfig from './config/form';

export default function PensionsApp({ location, children }) {
  return (
    <FormApp formConfig={formConfig} currentLocation={location}>
      {children}
    </FormApp>
  );
}
