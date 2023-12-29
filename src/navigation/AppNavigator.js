import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/Ionicons";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";

import Home from "../screens/Home";
import AllAnnonces from "../screens/AllAnnonceScreens/AllAnnonces";
import DetailsScreen from '../screens/AllAnnonceScreens/DetailsScreen';
import AjouterAnnonce from "../screens/AjouterAnnonce";
import Profile from "../screens/Profile";
import Demande from "../screens/MyDemandes/Demande";
import DetailsMyDemande from '../screens/MyDemandes/DetailsMyDemande';
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
  const navigation = useNavigation();

  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Icon name="person" size={25} color={"#000000"} />
          </TouchableOpacity>
        ),
        headerLeft: () => (
          <Menu>
            <MenuTrigger>
              <Icon name="menu" size={25} color={"#000000"} />
            </MenuTrigger>
            <MenuOptions>
              <MenuOption onSelect={() => navigation.navigate('Home')}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="home" size={20} color={"#000000"} />
                  <Text style={{ marginLeft: 10 }}>Acceuil</Text>
                </View>
              </MenuOption>
              <MenuOption onSelect={() => navigation.navigate('AjouterAnnonce')}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="add-circle" size={20} color={"#000000"} />
                  <Text style={{ marginLeft: 10 }}>Ajouter Annonce</Text>
                </View>
              </MenuOption>
              <MenuOption onSelect={() => navigation.navigate('Demande')}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="list" size={20} color={"#000000"} />
                  <Text style={{ marginLeft: 10 }}>Mes Demandes</Text>
                </View>
              </MenuOption>
              <MenuOption onSelect={() => navigation.navigate('MyAnnonces')}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="person" size={20} color={"#000000"} />
                  <Text style={{ marginLeft: 10 }}>Mes Annonces</Text>
                </View>
              </MenuOption>
              <MenuOption onSelect={() => navigation.navigate('AllAnnonces')}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="eye" size={20} color={"#000000"} />
                  <Text style={{ marginLeft: 10 }}>Voir les Annonces</Text>
                </View>
              </MenuOption>
            </MenuOptions>
          </Menu>
        ),
      }}
      initialRouteName="StartScreen"
    >
      <MainStack.Screen name="StartScreen" component={StartScreen} options={{ headerShown: false }} />
      <MainStack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
      <MainStack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false }} />
      <MainStack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} options={{ headerShown: false }} />
      <MainStack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
      <MainStack.Screen name="Home" component={Home} />
      
      <MainStack.Screen name="AllAnnonces" component={AllAnnonces} />
      <MainStack.Screen name="Details" component={DetailsScreen} />

      <MainStack.Screen name="MyAnnonces" component={MyAnnonces} />
      <MainStack.Screen name="DetailsMyAnnonces" component={DetailsMyAnnonces} />
      <MainStack.Screen name="EditAnnonce" component={EditAnnonce} />

      <MainStack.Screen name="Demande" component={Demande} />
      <MainStack.Screen name="DetailsMyDemande" component={DetailsMyDemande} />

      <MainStack.Screen name="Profile" component={Profile} />
      <MainStack.Screen name="AjouterAnnonce" component={AjouterAnnonce} />
    </MainStack.Navigator>
  );
};

export default () => {
  return (
    <NavigationContainer>
      <Main />
    </NavigationContainer>
  );
};
