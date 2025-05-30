import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import AboutScreen from "./src/screens/AboutScreen";
import { RootTabParamList } from "./src/types/types";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CreateTrip from "./src/screens/Trip/CreateTrip";
import AntDesign from "@expo/vector-icons/AntDesign";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  MD3LightTheme as DefaultTheme,
  IconButton,
  PaperProvider,
} from "react-native-paper";
import { SQLiteProvider } from "expo-sqlite";
import initDatabase from "./src/database/database";
import ViewTrip from "./src/screens/Trip/ViewTrip";
import CreateDestination from "./src/screens/Destination/CreateDestination";
import MapPicker from "./src/screens/MapPicker";
import EditDestination from "./src/screens/Destination/EditDestination";
import MapViewScreen from "./src/screens/MapViewScreen";

const Tab = createBottomTabNavigator<RootTabParamList>();
const HomeStack = createNativeStackNavigator();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomeList"
        component={HomeScreen}
        options={{ title: "My Trips" }}
      />
      <HomeStack.Screen
        name="ViewTrip"
        component={ViewTrip}
        options={({ navigation, route }) => ({
          title: "Trip Details",
          headerRight: () => (
            <IconButton
              icon="plus"
              onPress={() =>
                navigation.navigate("CreateDestination", {
                  id: (route.params as { id: number }).id,
                })
              }
            />
          ),
        })}
      />
      <HomeStack.Screen
        name="CreateDestination"
        component={CreateDestination}
        options={{ title: "Add Destination" }}
      />
      <HomeStack.Screen
        name="MapPicker"
        component={MapPicker}
        options={{ title: "Pick Location on Map" }}
      />
      <HomeStack.Screen
        name="EditDestination"
        component={EditDestination}
        options={{ title: "Edit destination" }}
      />
      <HomeStack.Screen
        name="MapView"
        component={MapViewScreen}
        options={{ title: "View Location" }}
      />
    </HomeStack.Navigator>
  );
}

// https://callstack.github.io/react-native-paper/docs/guides/theming
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "purple",
    secondary: "black",
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <SQLiteProvider databaseName="travelApp.db" onInit={initDatabase}>
        <PaperProvider theme={theme}>
          <NavigationContainer>
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                  const icons = {
                    Home: "home",
                    About: "help-circle-outline",
                    Create: "plus-circle-outline",
                  };

                  return (
                    <IconButton
                      icon={icons[route.name]}
                      iconColor={color}
                      size={size}
                    />
                  );
                },
                tabBarActiveTintColor: "purple",
                tabBarInactiveTintColor: "gray",
              })}
            >
              <Tab.Screen
                name="Home"
                component={HomeStackNavigator}
                options={{ headerShown: false }}
              />
              <Tab.Screen name="Create" component={CreateTrip} />
            </Tab.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </SQLiteProvider>
    </SafeAreaProvider>
  );
}
