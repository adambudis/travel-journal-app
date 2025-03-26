import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import AboutScreen from "./src/screens/AboutScreen";
import { RootTabParamList } from "./src/types/types";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TripCreate from "./src/screens/TripCreate";
import AntDesign from "@expo/vector-icons/AntDesign";

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: () => {
            const icons = {
              Home: "home",
              About: "questioncircleo",
              Create: "pluscircleo",
            };

            const color = "black";
            const size = 24;

            return (
              <AntDesign name={icons[route.name]} size={size} color={color} />
            );
          },
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="About" component={AboutScreen} />
        <Tab.Screen name="Create" component={TripCreate} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
