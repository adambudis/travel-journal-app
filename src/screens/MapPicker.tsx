// MapPicker.tsx
import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Button } from "react-native-paper";
import {
  useNavigation,
  useRoute,
  CommonActions,
  RouteProp,
} from "@react-navigation/native";

const MapPicker = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { onLocationSelected } = route.params;

  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const handleSelectLocation = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
  };

  // intercept hardware/header back
  useEffect(() => {
    const unsub = navigation.addListener("beforeRemove", (e) => {
      if (!selectedLocation) {
        // if nothing picked, do normal pop
        return;
      }
      e.preventDefault();
      // hand back the coords
      onLocationSelected(selectedLocation);
      // now let the pop happen
      navigation.dispatch(e.data.action);
    });
    return unsub;
  }, [navigation, selectedLocation, onLocationSelected]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        onPress={handleSelectLocation}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {selectedLocation && <Marker coordinate={selectedLocation} />}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height - 80,
  },
  saveButton: { margin: 16 },
});

export default MapPicker;
