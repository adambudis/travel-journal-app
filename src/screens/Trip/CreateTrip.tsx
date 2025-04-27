import { useState } from "react";
import { View, StyleSheet, Image, ScrollView } from "react-native";
import { TextInput, Button, Card, Divider, Text } from "react-native-paper";
import DatePicker from "../../components/DatePicker";
import * as ImagePicker from "expo-image-picker";
import { useSQLiteContext } from "expo-sqlite";

const CreateTrip = ({ navigation }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());

  const [imageUri, setImageUri] = useState<string | null>(null);

  const database = useSQLiteContext();
  const handleSave = async () => {
    await database.runAsync(
      "INSERT INTO trips (name, description, date, imageUri) VALUES (?, ?, ?, ?);",
      [name, description, date.toISOString(), imageUri]
    );
    alert("Trip created successfully!");

    setName("");
    setDescription("");
    setImageUri(null);
    navigation.goBack();
  };

  const ensureCameraPermission = async () => {
    const { status } = await ImagePicker.getCameraPermissionsAsync();
    if (status !== "granted") {
      const { status: newStatus } =
        await ImagePicker.requestCameraPermissionsAsync();
      return newStatus === "granted";
    }
    return true;
  };

  const ensureMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      const { status: newStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      return newStatus === "granted";
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await ensureCameraPermission();
    if (!hasPermission) {
      alert("Camera permission is required.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const pickImageFromGallery = async () => {
    const hasPermission = await ensureMediaLibraryPermission();
    if (!hasPermission) {
      alert("Media library permission is required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <ScrollView style={styles.safeArea}>
      <Card style={styles.card}>
        <Card.Title title="Create a New Trip" />
        <Card.Content>
          <TextInput
            label="Trip Name"
            mode="outlined"
            style={styles.input}
            value={name}
            onChangeText={(text) => setName(text)}
          />
          <TextInput
            label="Trip Description"
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.input}
            value={description}
            onChangeText={(text) => setDescription(text)}
          />

          <Divider style={styles.divider} />

          <Text variant="titleMedium" style={styles.sectionTitle}>
            Date
          </Text>
          <DatePicker date={date} setDate={setDate} mode="date" />

          <Divider style={styles.divider} />

          <Text variant="titleMedium" style={styles.sectionTitle}>
            Trip Photo
          </Text>
          <View style={styles.buttonRow}>
            <Button mode="contained" onPress={takePhoto} style={styles.button}>
              Take Photo
            </Button>
            <Button
              mode="outlined"
              onPress={pickImageFromGallery}
              style={styles.button}
            >
              Upload from Gallery
            </Button>
          </View>

          {imageUri && (
            <Card style={styles.imageCard}>
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            </Card>
          )}

          <Button
            mode="contained"
            style={styles.createButton}
            onPress={handleSave}
          >
            Create Trip
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f6f6f6",
  },
  card: {
    paddingBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  selectedDate: {
    marginTop: 8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  imageCard: {
    marginTop: 12,
    overflow: "hidden",
  },
  imagePreview: {
    width: "100%",
    height: 200,
  },
  createButton: {
    marginTop: 24,
  },
});

export default CreateTrip;
