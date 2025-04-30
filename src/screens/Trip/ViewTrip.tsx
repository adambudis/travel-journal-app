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
import { Trip, Destination } from "../../types/types";
import {
  deleteDestinationById,
  getDestinationsByTripId,
  getTripById,
} from "../../database/service";

const ViewTrip = ({ route, navigation }) => {
  const { id } = route.params;
  const db = useSQLiteContext();

  const [trip, setTrip] = useState<Trip>();
  const [destinations, setDestinations] = useState<Destination[]>([]);

  const loadTrip = async () => {
    const trip = await getTripById(db, id);

    if (!trip) {
      Alert.alert(
        "Trip not found",
        "The trip you are looking for does not exist."
      );
      navigation.goBack();
      return;
    }

    setTrip(trip);
  };

  const loadDestinations = async () => {
    const destinations = await getDestinationsByTripId(db, id);
    setDestinations(destinations);
  };

  const handleDelete = (destId: number) => {
    Alert.alert(
      "Delete Destination",
      "Are you sure you want to delete this destination?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteDestinationById(db, destId);
            setDestinations((prev) =>
              prev.filter((dest) => dest.id !== destId)
            );
          },
        },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      loadTrip();
      loadDestinations();
    }, [id])
  );

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
      <Title style={styles.sectionHeader}>Destinations</Title>

      {/* Destination cards */}
      {destinations.map((destination) => (
        <Card key={destination.id} style={styles.card}>
          {destination.imageUri && (
            <Card.Cover
              source={{ uri: destination.imageUri }}
              style={styles.image}
            />
          )}
          <Card.Content>
            <Title style={styles.title}>{destination.name}</Title>
            <Paragraph style={styles.description}>
              {destination.description}
            </Paragraph>
            <Divider style={styles.divider} />
            <Paragraph>
              Date: {new Date(destination.date).toLocaleDateString()}
            </Paragraph>
            {destination.latitude != null && destination.longitude != null && (
              <Paragraph>
                Location: {destination.latitude.toFixed(5)},{" "}
                {destination.longitude.toFixed(5)}
              </Paragraph>
            )}
          </Card.Content>
          <Card.Actions>
            {destination.latitude != null && destination.longitude != null && (
              <Button
                mode="text"
                icon="map-marker"
                onPress={() =>
                  navigation.navigate("MapView", {
                    latitude: destination.latitude,
                    longitude: destination.longitude,
                  })
                }
              >
                View on Map
              </Button>
            )}
            <Button
              mode="text"
              icon="pencil"
              onPress={() =>
                navigation.navigate("EditDestination", {
                  destinationId: destination.id,
                })
              }
            >
              Edit
            </Button>
            <Button
              mode="text"
              icon="delete"
              onPress={() => handleDelete(destination.id)}
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
  sectionHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
});

export default ViewTrip;
