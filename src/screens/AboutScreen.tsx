import { Button } from "@react-navigation/elements";
import { View, Text } from "react-native";
import { AboutScreenNavigationProp } from "../types/types";

const AboutScreen = ({ navigation }: AboutScreenNavigationProp) => {
  return (
    <View>
      <Text>About Screen</Text>
      <Button onPress={() => navigation.navigate("Home")}>Go to Home</Button>
    </View>
  );
};

export default AboutScreen;
