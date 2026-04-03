import React, { useState, useEffect, useCallback } from "react"
import { useRouter, useFocusEffect, Stack } from "expo-router"
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { getMemories, deleteMemory } from "./store/memoryStore"
import { auth } from "../firebaseConfig"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { SafeAreaView } from "react-native-safe-area-context"

// Screen dimensions
const { width } = Dimensions.get("window")

interface Memory {
  id: string
  title: string
  content: string
  date: string
  image?: string
}

// Feature Card Component
const FeatureCard = ({
  title,
  icon,
  onPress,
}: {
  title: string
  icon: string
  onPress: () => void
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      flex: 1,
      margin: 6,
      borderRadius: 18,
      overflow: "hidden",
      backgroundColor: "rgba(181,126,220,0.15)",
      borderWidth: 1,
      borderColor: "rgba(181,126,220,0.3)",
      padding: 20,
      alignItems: "center",
      shadowColor: "#B57EDC",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 4,
    }}
  >
    <MaterialIcons name={icon as any} size={28} color="#e4bf50" />
    <Text
      style={{
        marginTop: 8,
        fontWeight: "600",
        color: "#4C1D95",
      }}
    >
      {title}
    </Text>
  </TouchableOpacity>
)

const Dashboard = () => {
  const [memories, setMemories] = useState<Memory[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  // Filtered memories based on search
  const filteredMemories = memories.filter(
    (memory) =>
      memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memory.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Delete memory
  const handleDelete = async (id: string) => {
    try {
      await deleteMemory(id)
      const data = await getMemories()
      setMemories(data)
    } catch (e) {
      console.error("Failed to delete memory", e)
    }
  }

  // Logout
  const handleLogout = async () => {
    await signOut(auth)
    router.replace("/login")
  }

  // Check auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) router.replace("/login")
    })
    return unsubscribe
  }, [])

  // Load memories
  useFocusEffect(
    useCallback(() => {
      const loadMemories = async () => {
        const data = await getMemories()
        setMemories(data)
      }
      loadMemories()
    }, [])
  )

  // Options menu
  const handleMore = (id: string) => {
    Alert.alert("Options", "Choose an action", [
      { text: "Cancel", style: "cancel" },
      { text: "Edit", onPress: () => router.push({ pathname: "/edit/[id]", params: { id } }) },
      { text: "Delete", style: "destructive", onPress: () => handleDelete(id) },
    ])
  }

  if (!auth.currentUser) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8faeb" }}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Top Logout */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          paddingHorizontal: 20,
          paddingTop: 10,
        }}
      >
        <TouchableOpacity onPress={handleLogout}>
          <MaterialIcons name="logout" size={24} color="#B57EDC" />
        </TouchableOpacity>
      </View>

      {/* Header: Logo + Title */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          marginBottom: 10,
        }}
      >
        <Image
          source={require("../assets/quillogo.png")}
          style={{
            marginLeft: -30,
            width: width * 0.15,
            height: width * 0.15,
            resizeMode: "contain",
          }}
        />
        <Text
          style={{
            fontSize: width * 0.06,
            marginLeft: 3,
            color: "#B57EDC",
            fontWeight: "700",
          }}
        >
          MemoirPages
        </Text>
      </View>

      {/* Search Bar */}
      <TextInput
        placeholder="Search memories..."
        placeholderTextColor="#6B7280"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={{
          backgroundColor: "#F3E8FF",
          padding: 12,
          borderRadius: 12,
          marginHorizontal: 20,
          marginBottom: 10,
          fontSize: width * 0.04,
          color: "#4C1D95",
        }}
      />

      {/* Feature Cards */}
      <View style={{ marginBottom: 20 }}>
        <View style={{ flexDirection: "row" }}>
          <FeatureCard title="Memories" icon="menu-book" onPress={() => router.push("/add")} />
        </View>
        <View style={{ flexDirection: "row" }}>
          <FeatureCard title="Period Tracker" icon="favorite" onPress={() => router.push("/period")} />
          <FeatureCard title="Mood Tracker" icon="mood" onPress={() => router.push("/moodTracker")} />

        </View>
        <View style={{ flexDirection: "row" }}>
          <FeatureCard title="Habit Tracker" icon="check-circle" onPress={() => router.push("/habitTracker")} />

          <FeatureCard title="Daily Challenges" icon="emoji-events" onPress={() => router.push("/dailyChallenges")} />
        </View>
      </View>

      {/* Recent Memories */}
      <Text
        style={{
          color: "#c9a846",
          fontSize: width * 0.05,
          fontWeight: "700",
          marginBottom: 10,
          marginLeft: 20,
        }}
      >
        Recent Memories
      </Text>

      {memories.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#efebfa",
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={{
              fontSize: width * 0.09,
              fontWeight: "700",
              color: "#B57EDC",
              marginBottom: 5,
              textAlign: "center",
            }}
          >
            No Memories
          </Text>
          <Text
            style={{
              fontSize: width * 0.045,
              color: "#6B7280",
              textAlign: "center",
              marginBottom: 0,
              maxWidth: "80%",
            }}
          >
            Start creating your memories today! 🪶
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredMemories}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View
              style={{
                width: "100%",
                padding: width * 0.04,
                marginBottom: width * 0.04,
              }}
            >
              {/* Memory Card */}
              <View
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  padding: 12,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
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
                {item.image && (
                  <Image
                    source={{ uri: item.image }}
                    style={{
                      width: "100%",
                      height: 150,
                      marginTop: 10,
                      borderRadius: 10,
                    }}
                  />
                )}
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
                  <MaterialIcons name="more-vert" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* Floating Add Button
      <View style={{ position: "absolute", bottom: 40, right: 20, zIndex: 10 }}>
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
          <MaterialIcons name="add" size={width * 0.07} color="#e4bf50" />
        </TouchableOpacity>
      </View> */}
    </SafeAreaView>
  )
}

export default Dashboard