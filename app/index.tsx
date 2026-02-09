import React, { useState } from "react"
import { useRouter } from "expo-router"
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert
} from "react-native"
import { MaterialIcons } from "@expo/vector-icons"

// Screen dimensions
const { width } = Dimensions.get("window")

interface Memory {
  id: string
  title: string
  content: string
  date: string
  image?: string
}

// Initial dummy memories for development
const initialMemories: Memory[] = [
  {
    id: "1",
    title: "My First Memory",
    content: "Today I started MemoirPages 💜",
    date: "2026-02-09",
  },
  {
    id: "2",
    title: "Cafe Visit Reflection",
    content: "Had a wonderful coffee and wrote some thoughts",
    date: "2026-02-08",
  },
]

const Dashboard = () => {
  const [memories, setMemories] = useState<Memory[]>(initialMemories)
  const router = useRouter()

  // More button actions
  const handleMore = (id: string) => {
    Alert.alert("Options", "Choose an action", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Edit",
        onPress: () => router.push({
        pathname: "/edit/[id]",
        params: { id: id },
})
,
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => handleDelete(id),
      },
    ])
  }

  const handleDelete = (id: string) => {
    const filtered = memories.filter((m) => m.id !== id)
    setMemories(filtered)
  }

  return (
    <View className="flex-1 bg-cream p-4">
      {/* Header / Logo */}
      <View className="flex-row items-center mb-6" style={{ alignItems: "center" }}>
        <Image
          source={require("../assets/logo.png")}
          style={{
            width: width * 0.12,
            height: width * 0.12,
            resizeMode: "contain",
          }}
        />
        <Text
          style={{
            fontSize: width * 0.08,
            marginLeft: width * 0.03,
            flexShrink: 1,
          }}
          className="text-lavender font-bold"
        >
          MemoirPages
        </Text>
      </View>

      {/* Diary Entries List */}
      {memories.length === 0 ? (
        <View
          style={{ backgroundColor: "#efebfa" }}
          className="flex-1 items-center justify-center p-4"
        >
          <Text className="text-gray-500 text-lg">No diary entries yet 🪶</Text>
        </View>
      ) : (
        <FlatList
  data={memories}
  keyExtractor={(item) => item.id}
  contentContainerStyle={{ paddingBottom: 100 }}
  renderItem={({ item }) => (
    <View
      style={{
        width: "100%",
        padding: width * 0.04,
        marginBottom: width * 0.04,
      }}
      className="bg-white rounded-xl shadow relative"
    >
      {/* Memory title clickable */}
      <TouchableOpacity
  onPress={() =>
    router.push({
      pathname: "/memory/[id]",
      params: { id: item.id },
    })
  }
>
  <Text
    style={{
      fontSize: width * 0.045,
      fontWeight: "600",
      color: "#2D2D2D",
    }}
  >
    {item.title}
  </Text>
</TouchableOpacity>


      <Text
        style={{
          fontSize: width * 0.035,
          color: "#6B7280",
          marginTop: 4,
        }}
      >
        {item.date}
      </Text>

      {/* More Button */}
      <TouchableOpacity
        style={{
          position: "absolute",
          top: width * 0.04,
          right: width * 0.04,
          padding: 4,
        }}
        onPress={() => handleMore(item.id)}
      >
        <Text style={{ fontSize: width * 0.06 }}>⋯</Text>
      </TouchableOpacity>
    </View>
  )}
/>

      )}

      {/* Floating Add Button */}
      <View style={{ position: "absolute", bottom: 20, right: 20, zIndex: 10 }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#B57EDC",
            padding: width * 0.035,
            borderRadius: 999,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
          }}
          onPress={() => router.push("/add")}
        >
          <MaterialIcons name="add" size={width * 0.07} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Dashboard
