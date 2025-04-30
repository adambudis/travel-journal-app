import { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, Image, ScrollView } from "react-native";
import {
  TextInput,
  Button,
  Card,
  Divider,
  Text,
  Portal,
  Dialog,
} from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useFocusEffect } from "@react-navigation/native";
import { Destination } from "../../types/types";
import { getDestinationById, updateDestination } from "../../database/service";

const EditDestination = ({ route, navigation }) => {
  const { destinationId } = route.params;

  const db = useSQLiteContext();
  const [dialogVisible, setDialogVisible] = useState(false);

  const [destination, setDestination] = useState<Destination>({
    id: destinationId,
    name: "",
    description: "",
    date: new Date(),
    latitude: null,
    longitude: null,
    imageUri: null,
  });

  const loadDestination = async () => {
    try {
      const destination: Destination = await getDestinationById(
        db,
        destinationId
      );
      setDestination({
        ...destination,
        date: new Date(destination.date),
      });
    } catch (error) {
      console.error("Error loading destination:", error);
      alert("Failed to load destination. Please try again.");
    }
  };

  const handleUpdate = async () => {
    try {
      await updateDestination(db, destination);
      alert("Destination updated!");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating destination:", error);
      alert("Failed to update destination. Please try again.");
    }
  };

  const getLocation = () => {
    setDialogVisible(true);
  };

  const handleCurrentLocation = async () => {
    setDialogVisible(false);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }
    const location = await Location.getCurrentPositionAsync({});
    setDestination((prev) => ({
      ...prev,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    }));
  };

  const handlePickOnMap = () => {
    setDialogVisible(false);
    navigation.navigate("MapPicker", {
      onLocationSelected: (coords: { latitude: number; longitude: number }) => {
        setDestination((prev) => ({
          ...prev,
          latitude: coords.latitude,
          longitude: coords.longitude,
        }));
      },
    });
  };

  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (!result.canceled) {
      setDestination((prev) => ({
        ...prev,
        imageUri: result.assets[0].uri,
      }));
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (route.params?.pickedLatitude && route.params?.pickedLongitude) {
        setDestination((prev) => ({
          ...prev,
          latitude: route.params.pickedLatitude,
          longitude: route.params.pickedLongitude,
        }));

        navigation.setParams({ pickedLatitude: null, pickedLongitude: null });
      }
    }, [route.params])
  );

  useEffect(() => {
    loadDestination();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Card>
        <Card.Title title="Edit Destination" />
        <Card.Content>
          <TextInput
            label="Destination Name"
            mode="outlined"
            value={destination.name}
            onChangeText={(name) =>
              setDestination((prev) => ({ ...prev, name }))
            }
            style={styles.input}
          />
          <TextInput
            label="Description"
            mode="outlined"
            value={destination.description}
            multiline
            numberOfLines={3}
            onChangeText={(description) =>
              setDestination((prev) => ({ ...prev, description }))
            }
            style={styles.input}
          />
          <Divider style={styles.divider} />
          <Button mode="outlined" onPress={getLocation}>
            Update Location
          </Button>
          {destination.latitude && destination.longitude && (
            <Text style={styles.locationText}>
              Location: {destination.latitude.toFixed(5)},{" "}
              {destination.longitude.toFixed(5)}
            </Text>
          )}
          <Divider style={styles.divider} />
          <Button mode="outlined" onPress={pickImageFromGallery}>
            Update Image
          </Button>
          {destination.imageUri && (
            <Image
              source={{ uri: destination.imageUri }}
              style={styles.imagePreview}
            />
          )}
          <Button
            mode="contained"
            onPress={handleUpdate}
            style={styles.saveButton}
          >
            Save Changes
          </Button>
        </Card.Content>
      </Card>

      {/* Dialog for location choice */}
      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
        >
          <Dialog.Title>Choose Location Method</Dialog.Title>
          <Dialog.Actions>
            <Button onPress={handleCurrentLocation}>
              Use Current Location
            </Button>
          </Dialog.Actions>
          <Dialog.Actions>
            <Button onPress={handlePickOnMap}>Pick on Map</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 12,
  },
  divider: {
    marginVertical: 16,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    marginTop: 12,
  },
  locationText: {
    marginTop: 8,
  },
  saveButton: {
    marginTop: 24,
  },
});

export default EditDestination;
