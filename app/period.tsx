import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

const { width } = Dimensions.get("window");

interface PeriodLog {
  id: string;
  startDate: Date;
  endDate: Date;
}

const PeriodTracker = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [periodLogs, setPeriodLogs] = useState<PeriodLog[]>([]);

  // Load periods from Firebase
  useEffect(() => {
    const loadPeriods = async () => {
      try {
        const q = query(
          collection(db, "periods"),
          where("userId", "==", auth.currentUser?.uid)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs
          .map(doc => ({
            id: doc.id,
            startDate: new Date(doc.data().startDate),
            endDate: new Date(doc.data().endDate),
          }))
          .sort((a, b) => b.startDate.getTime() - a.startDate.getTime()); // latest first
        setPeriodLogs(data);
      } catch (error) {
        console.error("Failed to load periods:", error);
      }
    };

    loadPeriods();
  }, []);

  // Save period to Firebase
  const handleSavePeriod = async () => {
    if (endDate < startDate) {
      Alert.alert("Error", "End date cannot be before start date!");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "periods"), {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        userId: auth.currentUser?.uid,
      });

      // Update local state
      setPeriodLogs(prev => [{ id: docRef.id, startDate, endDate }, ...prev]);
      Alert.alert("Saved!", "Period logged successfully!");
    } catch (error) {
      console.error("Failed to save period:", error);
      Alert.alert("Failed to save period");
    }
  };

  // Calculate next period start based on average cycle length
  const getNextPeriod = () => {
    if (periodLogs.length < 2) return null;

    let totalCycleDays = 0;
    for (let i = 1; i < periodLogs.length; i++) {
      const diff =
        (periodLogs[i - 1].startDate.getTime() -
          periodLogs[i].startDate.getTime()) /
        (1000 * 60 * 60 * 24);
      totalCycleDays += diff;
    }
    const averageCycle = Math.round(totalCycleDays / (periodLogs.length - 1));

    const lastStart = periodLogs[0].startDate;
    const nextStart = new Date(
      lastStart.getTime() + averageCycle * 24 * 60 * 60 * 1000
    );
    return nextStart;
  };

  const nextPeriod = getNextPeriod();

  const renderLog = ({ item }: { item: PeriodLog }) => (
    <View style={styles.logCard}>
      <Text style={styles.logText}>Start: {item.startDate.toDateString()}</Text>
      <Text style={styles.logText}>End: {item.endDate.toDateString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Period Tracker</Text>

      {/* Next period prediction */}
      {nextPeriod && (
        <View style={styles.nextPeriodCard}>
          <Text style={styles.nextText}>
            Predicted next period start: {nextPeriod.toDateString()}
          </Text>
        </View>
      )}

      {/* Start Date Picker */}
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowStartPicker(true)}
      >
        <Text style={styles.dateText}>
          Start Date: {startDate.toDateString()}
        </Text>
      </TouchableOpacity>
      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowStartPicker(false);
            if (date) setStartDate(date);
          }}
        />
      )}

      {/* End Date Picker */}
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowEndPicker(true)}
      >
        <Text style={styles.dateText}>End Date: {endDate.toDateString()}</Text>
      </TouchableOpacity>
      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowEndPicker(false);
            if (date) setEndDate(date);
          }}
        />
      )}

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSavePeriod}>
        <Text style={styles.saveText}>Save Period</Text>
      </TouchableOpacity>

      {/* List of Past Periods */}
      <Text style={styles.subtitle}>Past Periods</Text>
      {periodLogs.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          No period logs yet.
        </Text>
      ) : (
        <FlatList
          data={periodLogs}
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
  title: {
    fontSize: width * 0.07,
    fontWeight: "700",
    color: "#B57EDC",
    marginBottom: 20,
  },
  dateButton: {
    backgroundColor: "#F3E8FF",
    padding: 15,
    borderRadius: 12,
    marginVertical: 10,
  },
  dateText: { color: "#4C1D95", fontSize: width * 0.045 },
  saveButton: {
    backgroundColor: "#B57EDC",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 20,
  },
  saveText: { color: "#e4bf50", fontWeight: "700", fontSize: width * 0.045 },
  subtitle: {
    fontSize: width * 0.05,
    fontWeight: "700",
    color: "#c9a846",
    marginBottom: 10,
  },
  logCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#B57EDC",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  logText: { fontSize: width * 0.04, color: "#2D2D2D" },
  nextPeriodCard: {
    backgroundColor: "#EAD7FF",
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
  },
  nextText: { color: "#4C1D95", fontWeight: "600", fontSize: width * 0.045 },
});

export default PeriodTracker;