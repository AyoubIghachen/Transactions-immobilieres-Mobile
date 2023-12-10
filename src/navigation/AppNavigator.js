import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { themeColor, useTheme } from "react-native-rapi-ui";
import TabBarIcon from "../components/utils/TabBarIcon";
import TabBarText from "../components/utils/TabBarText";

import Home from "../screens/Home";
import AllAnnonces from "../screens/AllAnnonceScreens/AllAnnonces";
import DetailsScreen from '../screens/AllAnnonceScreens/DetailsScreen';
import AjouterAnnonce from "../screens/AjouterAnnonce";
import Profile from "../screens/Profile";
import Demande from "../screens/MyDemandes/Demande";
import MyAnnonces from "../screens/MyAnnonceScreens/MyAnnonces";
import DetailsMyAnnonces from '../screens/MyAnnonceScreens/DetailsMyAnnonces';
import EditAnnonce from '../screens/MyAnnonceScreens/EditAnnonce';

import StartScreen from "../screens/AuthScreens/screens/StartScreen";
import LoginScreen from "../screens/AuthScreens/screens/LoginScreen";
import RegisterScreen from "../screens/AuthScreens/screens/RegisterScreen";
import ResetPasswordScreen from "../screens/AuthScreens/screens/ResetPasswordScreen";
import Dashboard from "../screens/AuthScreens/screens/Dashboard";



const MainStack = createNativeStackNavigator();
const Main = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="StartScreen"
    >
      <MainStack.Screen name="StartScreen" component={StartScreen} />
      <MainStack.Screen name="LoginScreen" component={LoginScreen} />
      <MainStack.Screen name="RegisterScreen" component={RegisterScreen} />
      <MainStack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
      <MainStack.Screen name="Dashboard" component={Dashboard} />
      <MainStack.Screen name="MainTabs" component={MainTabs} />
      <MainStack.Screen name="AllAnnonces" component={AllAnnonces} />
      <MainStack.Screen name="Details" component={DetailsScreen} />
      <MainStack.Screen name="MyAnnonces" component={MyAnnonces} />
      <MainStack.Screen name="DetailsMyAnnonces" component={DetailsMyAnnonces} />
      <MainStack.Screen name="EditAnnonce" component={EditAnnonce} />
    </MainStack.Navigator>
  );
};

const Tabs = createBottomTabNavigator();
const MainTabs = () => {
  const { isDarkmode } = useTheme();
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopColor: isDarkmode ? themeColor.dark100 : "#c0c0c0",
          backgroundColor: isDarkmode ? themeColor.dark200 : "#ffffff",
        },
      }}
    >
      {/* these icons using Ionicons */}
      <Tabs.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="Acceuil" />
          ),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={"md-home"} />
          ),
        }}
      />
      <Tabs.Screen
        name="AjouterAnnonce"
        component={AjouterAnnonce}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="Ajouter annonce" />
          ),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={"newspaper"} />
          ),
        }}
      />

      <Tabs.Screen
        name="Demande"
        component={Demande}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="Mes demandes" />
          ),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={"paper-plane"} />
          ),
        }}
      />

      <Tabs.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="Profile" />
          ),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={"person"} />
          ),
        }}
      />
    </Tabs.Navigator>
  );
};

export default () => {
  return (
    <NavigationContainer>
      <Main />
    </NavigationContainer>
  );
};
