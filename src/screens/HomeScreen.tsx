import { Alert } from "react-native";
import { useCallback, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import React from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Button, Card, Paragraph, Title } from "react-native-paper";
import { ScrollView } from "react-native";
import { deleteTripById, getAllTrips } from "../database/service";
import { StyleSheet } from "react-native";
import { Trip } from "../types/types";

const HomeScreen = ({ navigation }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const database = useSQLiteContext();

  const loadTrips = async () => {
    const trips = await getAllTrips(database);
    setTrips(trips);
  };

  const handleDelete = async (id: number) => {
    Alert.alert(
      "Delete trip?",
      "Are you sure you want to permanently delete this trip? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteTripById(database, id);
            loadTrips();
          },
        },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      loadTrips();
    }, [])
  );

  return (
    <ScrollView style={styles.container}>
      {trips.map((trip) => (
        <Card key={trip.id} style={styles.card}>
          <Card.Content>
            <Title>{trip.name}</Title>
            {trip.description && (
              <Paragraph style={styles.paragraph}>
                Description: {trip.description}
              </Paragraph>
            )}
            <Paragraph>{new Date(trip.date).toLocaleDateString()}</Paragraph>
            {trip.imageUri && (
              <Card.Cover
                source={{ uri: trip.imageUri }}
                style={styles.cardCover}
              />
            )}
          </Card.Content>
          <Card.Actions>
            <Button
              icon="delete"
              mode="text"
              onPress={() => handleDelete(trip.id)}
            >
              Delete
            </Button>
            <Button
              icon="eye"
              mode="text"
              onPress={() => navigation.navigate("ViewTrip", { id: trip.id })}
            >
              View
            </Button>
          </Card.Actions>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { marginBottom: 16 },
  paragraph: { marginBottom: 16 },
  card: { marginBottom: 16 },
  cardCover: { marginTop: 8 },
});

export default HomeScreen;
