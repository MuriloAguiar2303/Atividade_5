import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from "./src/pages/Home"
import Cadastro from "./src/pages/Cadastro"
import ListaClientes from "./src/pages/ListaClientes"
import PesquisaCliente from "./src/pages/PesquisaCliente"
import DetalheCliente from './src/pages/DetalheCliente';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name='Home'
            component={Home}
            options={{
              title: 'Home',
              headerShown: false
            }}
          />
          <Stack.Screen
            name='Cadastro'
            component={Cadastro}
            options={{
              title: 'Cadastro',
              headerShown: false
            }}
          />
          <Stack.Screen
            name='ListaClientes'
            component={ListaClientes}
            options={{
              title: 'Lista de Clientes',
              headerShown: false
            }}
          />
          <Stack.Screen
            name='PesquisaCliente'
            component={PesquisaCliente}
            options={{
              title: 'Pesquisar Cliente',
              headerShown: false
            }}
          />
               <Stack.Screen
            name='DetalheCliente'
            component={DetalheCliente}
            options={{
              title: 'Detalhes do cliente',
              headerShown: false
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}
