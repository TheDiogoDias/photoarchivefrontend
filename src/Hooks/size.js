import React, { useContext } from 'react';
import {ResponsiveContext} from 'grommet';

const useCustomHook = () => {
  const contextValue = useContext(ResponsiveContext);
  return contextValue;
};

export default useCustomHook;