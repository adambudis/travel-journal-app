import { Alert } from "react-native";
import { useCallback, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import React from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Button, Card, Paragraph, Title } from "react-native-paper";
import { ScrollView } from "react-native";

interface Trip {
  id: number;
  name: string;
  description: string;
  date: Date;
  imageUri: string | null;
}

const HomeScreen = () => {
  const [data, setData] = useState<Trip[]>([]);
  const [length, setLength] = useState(0);
  const database = useSQLiteContext();

  const loadData = async () => {
    const result = await database.getAllAsync<Trip>("SELECT * FROM trips;");
    setLength(result.length);
    setData(result);
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
            await database.runAsync("DELETE FROM trips WHERE id = ?;", [id]);
            loadData();
          },
        },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>Home Screen</Title>
      <Paragraph style={styles.paragraph}>Trips: {length}</Paragraph>
      {data.map((item) => (
        <Card key={item.id} style={styles.card}>
          <Card.Content>
            <Title>{item.name}</Title>
            <Paragraph>{item.description}</Paragraph>
            <Paragraph>{new Date(item.date).toLocaleDateString()}</Paragraph>
            {item.imageUri && (
              <Card.Cover
                source={{ uri: item.imageUri }}
                style={styles.cardCover}
              />
            )}
          </Card.Content>
          <Card.Actions>
            <Button onPress={() => handleDelete(item.id)}>Delete</Button>
            <Button>View</Button>
          </Card.Actions>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = {
  container: { padding: 16 },
  title: { marginBottom: 16 },
  paragraph: { marginBottom: 16 },
  card: { marginBottom: 16 },
  cardCover: { marginTop: 8 },
};

export default HomeScreen;
