import { useLayoutEffect, useState, useCallback } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import {
  Card,
  Divider,
  Title,
  Paragraph,
  IconButton,
  Button,
} from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect } from "@react-navigation/native";

const TripView = ({ route, navigation }) => {
  const { id } = route.params;
  const db = useSQLiteContext();

  const [trip, setTrip] = useState(null);
  const [destinations, setDestinations] = useState([]);

  const loadTrip = async () => {
    const rows = await db.getAllAsync("SELECT * FROM trips WHERE id = ?;", [
      id,
    ]);
    if (rows.length) setTrip(rows[0]);
  };

  const loadDestinations = async () => {
    const rows = await db.getAllAsync(
      "SELECT * FROM destinations WHERE trip_id = ? ORDER BY date;",
      [id]
    );
    setDestinations(rows);
  };

  useFocusEffect(
    useCallback(() => {
      loadTrip();
      loadDestinations();
    }, [id])
  );

  // TODO: refactor this later
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        trip && (
          <IconButton
            icon="plus"
            onPress={() => navigation.navigate("CreateDestination", { id })}
          />
        ),
    });
  }, [navigation, trip, id]);

  const handleDelete = (destId) => {
    Alert.alert(
      "Delete Destination",
      "Are you sure you want to delete this destination?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await db.runAsync("DELETE FROM destinations WHERE id = ?;", [
              destId,
            ]);
            loadDestinations();
          },
        },
      ]
    );
  };

  if (!trip) {
    return (
      <View style={styles.loadingContainer}>
        <Title>Loading…</Title>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Trip card */}
      <Card style={styles.card}>
        {trip.imageUri && (
          <Card.Cover source={{ uri: trip.imageUri }} style={styles.image} />
        )}
        <Card.Content>
          <Title style={styles.title}>{trip.name}</Title>
          <Paragraph style={styles.description}>{trip.description}</Paragraph>
          <Divider style={styles.divider} />
          <Paragraph style={styles.date}>
            Date: {new Date(trip.date).toLocaleDateString()}
          </Paragraph>
        </Card.Content>
      </Card>

      {/* Divider between trip and destinations */}
      <Divider style={styles.sectionDivider} />

      {/* Destination cards */}
      {destinations.map((dest) => (
        <Card key={dest.id} style={styles.card}>
          {dest.imageUri && (
            <Card.Cover source={{ uri: dest.imageUri }} style={styles.image} />
          )}
          <Card.Content>
            <Title style={styles.title}>{dest.name}</Title>
            <Paragraph style={styles.description}>{dest.description}</Paragraph>
            <Divider style={styles.divider} />
            <Paragraph>
              Date: {new Date(dest.date).toLocaleDateString()}
            </Paragraph>
            {dest.latitude != null && dest.longitude != null && (
              <Paragraph>
                Location: {dest.latitude.toFixed(5)},{" "}
                {dest.longitude.toFixed(5)}
              </Paragraph>
            )}
          </Card.Content>
          <Card.Actions>
            <Button
              mode="text"
              icon="map-marker"
              onPress={() =>
                navigation.navigate("MapView", {
                  latitude: dest.latitude,
                  longitude: dest.longitude,
                })
              }
            >
              View on Map
            </Button>
            <Button
              mode="text"
              icon="pencil"
              onPress={() =>
                navigation.navigate("EditDestination", {
                  destinationId: dest.id,
                })
              }
            >
              Edit
            </Button>
            <Button
              mode="text"
              icon="delete"
              onPress={() => handleDelete(dest.id)}
            >
              Delete
            </Button>
          </Card.Actions>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#f6f6f6",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    marginBottom: 16,
  },
  image: {
    height: 200,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
  },
  divider: {
    marginVertical: 12,
  },
  date: {
    fontSize: 12,
    color: "#555",
  },
  sectionDivider: {
    marginVertical: 24,
    height: 1,
    backgroundColor: "#ccc",
  },
});

export default TripView;
