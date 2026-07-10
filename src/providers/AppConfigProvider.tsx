import React, { createContext, useContext } from 'react';

export interface AppConfig {
  appName: string;
  version: string;
  isDev: boolean;
  platform: string;
}

export const AppConfigContext = createContext<AppConfig | undefined>(undefined);

export const AppConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const config: AppConfig = {
    appName: 'Astra Study Sanctuary',
    version: '1.2.0',
    isDev: import.meta.env.DEV,
    platform: 'Windows',
  };

  return (
    <AppConfigContext.Provider value={config}>
      {children}
    </AppConfigContext.Provider>
  );
};

export const useAppConfig = () => {
  const context = useContext(AppConfigContext);
  if (!context) {
    throw new Error('useAppConfig must be used within an AppConfigProvider');
  }
  return context;
};
