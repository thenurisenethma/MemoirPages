import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { collection, addDoc, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

interface Habit {
  id: string;
  name: string;
  completedDates: string[];
  userId: string;
}

const HabitTracker = () => {

  const [habitName, setHabitName] = useState("");
  const [habits, setHabits] = useState<Habit[]>([]);
  const loadHabits = async () => {
    const q = query(
      collection(db, "habits"),
      where("userId", "==", auth.currentUser?.uid)
    );

    const snapshot = await getDocs(q);

    const data: Habit[] = snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<Habit, "id">)
    }));

    setHabits(data);
  };

  useEffect(() => {
    loadHabits();
  }, []);

  const addHabit = async () => {

    if (!habitName) return;

    await addDoc(collection(db, "habits"), {
      name: habitName,
      completedDates: [],
      userId: auth.currentUser?.uid
    });

    setHabitName("");
    loadHabits();
  };

    const completeHabit = async (habit: Habit) => {
    const today = new Date().toISOString().split("T")[0];

    if (habit.completedDates.includes(today)) return;

    const updatedDates = [...habit.completedDates, today];

    await updateDoc(doc(db, "habits", habit.id), {
      completedDates: updatedDates
    });

    loadHabits();
  };

  const renderHabit = ({ item }: { item: Habit }) => {

    const today = new Date().toISOString().split("T")[0];
    const doneToday = item.completedDates.includes(today);

    return (
      <View style={styles.habitCard}>
        <Text style={styles.habitText}>{item.name}</Text>

        <TouchableOpacity
          style={[styles.doneButton, doneToday && { backgroundColor: "#8BC34A" }]}
          onPress={() => completeHabit(item)}
        >
          <Text style={{ color: "white" }}>
            {doneToday ? "Done Today" : "Mark Done"}
          </Text>
        </TouchableOpacity>

      </View>
    );
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Habit Tracker</Text>

      <TextInput
        placeholder="New Habit..."
        value={habitName}
        onChangeText={setHabitName}
        style={styles.input}
      />

      <TouchableOpacity style={styles.addButton} onPress={addHabit}>
        <Text style={{ color: "white" }}>Add Habit</Text>
      </TouchableOpacity>

      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={renderHabit}
      />

    </View>
  )
}

export default HabitTracker;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8faeb"
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#B57EDC"
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10
  },

  addButton: {
    backgroundColor: "#B57EDC",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20
  },

  habitCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between"
  },

  habitText: {
    fontSize: 16
  },

  doneButton: {
    backgroundColor: "#B57EDC",
    padding: 8,
    borderRadius: 8
  }

});