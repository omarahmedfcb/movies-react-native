import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './src/screens/HomeScreen';
import FavoritesDrawer from './src/components/FavoritesDrawer';
import { FavoritesProvider } from './src/context/FavoritesContext';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <FavoritesProvider>
      <StatusBar style="light" />
      <NavigationContainer>
        <Drawer.Navigator
          drawerContent={(props) => <FavoritesDrawer {...props} />}
          screenOptions={{
            headerShown: false,
            drawerPosition: 'right',
            drawerType: 'front',
            drawerStyle: {
              width: '85%',
            },
          }}>
          <Drawer.Screen name="Home" component={HomeScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    </FavoritesProvider>
  );
}
