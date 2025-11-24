import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStaticNavigation } from "@react-navigation/native";

import ScansScreen from "../screens/ScansScreen/ScansScreen";
import HomeScreen from "../screens/HomeScreen/HomeScreen";
import ZoomScreen from "../screens/ZoomScreen/ZoomScreen";



const RootStack = createNativeStackNavigator({
  initialRouteName: 'Home',
  screens: {
    Home: HomeScreen,
    Scans: ScansScreen,
    Zoom: ZoomScreen,
  },
  screenOptions:{
    headerShown: false,
    contentStyle: {
      backgroundColor: '#fff',
    },
  }
});

export const MainNavigation = createStaticNavigation(RootStack);