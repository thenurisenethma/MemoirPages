import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions, Alert } from "react-native";
import { auth, db } from "../firebaseConfig"; // Make sure you have firestore db exported
import { collection, addDoc, query, where, getDocs, orderBy } from "firebase/firestore";

const { width } = Dimensions.get("window");

interface MoodLog {
  id: string;
  mood: string;
  note?: string;
  date: string;
}

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);

  const moods = [
    { emoji: "😃", label: "Happy" },
    { emoji: "😔", label: "Sad" },
    { emoji: "😡", label: "Angry" },
    { emoji: "😌", label: "Calm" },
    { emoji: "🙂", label: "Neutral" },
    { emoji: "😱", label: "Anxious" },
  ];

  const fetchMoods = async () => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "moodLogs"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("date", "desc")
    );
    const querySnapshot = await getDocs(q);
    const logs: MoodLog[] = [];
    querySnapshot.forEach((doc) => {
      logs.push({ id: doc.id, ...(doc.data() as any) });
    });
    setMoodLogs(logs);
  };

  useEffect(() => {
    fetchMoods();
  }, []);

  const handleSaveMood = async () => {
    if (!selectedMood || !auth.currentUser) {
      Alert.alert("Select a mood first!");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "moodLogs"), {
        mood: selectedMood,
        date: new Date().toISOString(),
        userId: auth.currentUser.uid,
      });

      Alert.alert("Mood saved!");
      setSelectedMood(null);
      fetchMoods();
    } catch (e) {
      console.error("Failed to save mood:", e);
      Alert.alert("Error saving mood");
    }
  };

  const renderLog = ({ item }: { item: MoodLog }) => (
    <View style={styles.logCard}>
      <Text style={styles.logText}>{item.mood}</Text>
      <Text style={styles.logTextSmall}>{new Date(item.date).toDateString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mood Tracker</Text>

      <Text style={styles.subtitle}>Select your mood:</Text>
      <View style={styles.moodRow}>
        {moods.map((m) => (
          <TouchableOpacity
            key={m.label}
            style={[
              styles.moodButton,
              selectedMood === m.emoji && styles.selectedMood,
            ]}
            onPress={() => setSelectedMood(m.emoji)}
          >
            <Text style={styles.moodEmoji}>{m.emoji}</Text>
            <Text style={styles.moodLabel}>{m.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveMood}>
        <Text style={styles.saveText}>Save Mood</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>Mood History</Text>
      {moodLogs.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          No moods logged yet.
        </Text>
      ) : (
        <FlatList
          data={moodLogs}
          keyExtractor={(item) => item.id}
          renderItem={renderLog}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8faeb" },
  title: { fontSize: width * 0.07, fontWeight: "700", color: "#B57EDC", marginBottom: 20 },
  subtitle: { fontSize: width * 0.05, fontWeight: "600", marginBottom: 10, color: "#4C1D95" },
  moodRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  moodButton: {
    width: "30%",
    backgroundColor: "#F3E8FF",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginVertical: 5,
  },
  selectedMood: { backgroundColor: "#B57EDC" },
  moodEmoji: { fontSize: width * 0.08 },
  moodLabel: { color: "#4C1D95", marginTop: 5, fontWeight: "600" },
  saveButton: { backgroundColor: "#B57EDC", padding: 15, borderRadius: 12, alignItems: "center", marginVertical: 20 },
  saveText: { color: "#e4bf50", fontWeight: "700", fontSize: width * 0.045 },
  logCard: { backgroundColor: "#fff", borderRadius: 12, padding: 15, marginBottom: 10, shadowColor: "#B57EDC", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 6, elevation: 3 },
  logText: { fontSize: width * 0.045, color: "#2D2D2D" },
  logTextSmall: { fontSize: width * 0.035, color: "#6B7280", marginTop: 2 },
});

export default MoodTracker;