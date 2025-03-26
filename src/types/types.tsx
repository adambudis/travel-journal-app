import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

export type RootTabParamList = {
  Home: undefined;
  About: undefined;
  Create: undefined;
};

export type HomeScreenNavigationProp = BottomTabScreenProps<
  RootTabParamList,
  "Home"
>;
export type AboutScreenNavigationProp = BottomTabScreenProps<
  RootTabParamList,
  "About"
>;
export type CreateScreenNavigationProp = BottomTabScreenProps<
  RootTabParamList,
  "Create"
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootTabParamList {}
  }
}
