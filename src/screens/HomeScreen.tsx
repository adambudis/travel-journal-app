import { Button } from "@react-navigation/elements";
import { View, Text } from "react-native";
import { HomeScreenNavigationProp } from "../types/types";

const HomeScreen = ({ navigation }: HomeScreenNavigationProp) => {
  return (
    <View>
      <Text>Home Screen</Text>
      <Button onPress={() => navigation.navigate("About")}>Go to About</Button>
    </View>
  );
};

export default HomeScreen;
