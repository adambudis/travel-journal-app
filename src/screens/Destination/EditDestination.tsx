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

const EditDestination = ({ route, navigation }) => {
  const { destinationId } = route.params;

  const database = useSQLiteContext();
  const [dialogVisible, setDialogVisible] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const loadDestination = async () => {
    const result = await database.getAllAsync(
      "SELECT * FROM destinations WHERE id = ?;",
      [destinationId]
    );
    if (result.length > 0) {
      const destination = result[0];
      setName(destination.name);
      setDescription(destination.description);
      setDate(new Date(destination.date));
      setImageUri(destination.imageUri);
      setLatitude(destination.latitude);
      setLongitude(destination.longitude);
    }
  };

  const handleSave = async () => {
    await database.runAsync(
      `UPDATE destinations SET name = ?, description = ?, date = ?, latitude = ?, longitude = ?, imageUri = ? WHERE id = ?`,
      [
        name,
        description,
        date.toISOString(),
        latitude,
        longitude,
        imageUri,
        destinationId,
      ]
    );

    alert("Destination updated!");
    navigation.goBack();
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
    setLatitude(location.coords.latitude);
    setLongitude(location.coords.longitude);
  };

  const handlePickOnMap = () => {
    setDialogVisible(false);
    navigation.navigate("MapPicker", {
      onLocationSelected: (coords: { latitude: number; longitude: number }) => {
        setLatitude(coords.latitude);
        setLongitude(coords.longitude);
      },
    });
  };

  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (route.params?.pickedLatitude && route.params?.pickedLongitude) {
        setLatitude(route.params.pickedLatitude);
        setLongitude(route.params.pickedLongitude);

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
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            label="Description"
            mode="outlined"
            value={description}
            multiline
            numberOfLines={3}
            onChangeText={setDescription}
            style={styles.input}
          />
          <Divider style={styles.divider} />
          <Button mode="outlined" onPress={getLocation}>
            Update Location
          </Button>
          {latitude && longitude && (
            <Text style={styles.locationText}>
              Location: {latitude.toFixed(5)}, {longitude.toFixed(5)}
            </Text>
          )}
          <Divider style={styles.divider} />
          <Button mode="outlined" onPress={pickImageFromGallery}>
            Update Image
          </Button>
          {imageUri && (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          )}
          <Button
            mode="contained"
            onPress={handleSave}
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
