import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from 'react-query';
import RootStack from './screens/RootStack';
import CodePush from 'react-native-code-push';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </QueryClientProvider>
  );
}

const codePushOptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_START,
  updateDialog: { 
    title: '...', 
    optionalUpdateMessage: '...', 
    optionalInstallButtonLabel: '업데이트', 
    optionalIgnoreButtonLabel: '아니오.' 
  },
  installMode: CodePush.InstallMode.IMMEDIATE 
}

export default CodePush(codePushOptions)(App);
