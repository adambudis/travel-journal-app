import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootTabParamList = {
  Home: undefined;
  About: undefined;
  Create: undefined;
  ViewTrip: { id: number };
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

export type RootStackParamList = {
  MapPicker: {
    onLocationSelected: (coords: {
      latitude: number;
      longitude: number;
    }) => void;
  };
};

export type MapPickerScreenRouteProp = NativeStackScreenProps<
  RootStackParamList,
  "MapPicker"
> & {
  params: {
    onLocationSelected: (location: {
      latitude: number;
      longitude: number;
    }) => void;
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootTabParamList {}
  }
}
