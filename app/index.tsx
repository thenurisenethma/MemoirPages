import React, { useState, useEffect } from "react"
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
import { getMemories, deleteMemory } from "./store/memoryStore"
import { useFocusEffect } from "expo-router"
import { useCallback } from "react"
import { auth } from "../firebaseConfig"
import { onAuthStateChanged } from "firebase/auth"
import { ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { signOut } from "firebase/auth"


// Screen dimensions
const { width } = Dimensions.get("window")

interface Memory {
  id: string
  title: string
  content: string
  date: string
  image?: string
}

const Dashboard = () => {
  const [memories, setMemories] = useState<Memory[]>([])
  console.log("Current user UID:", auth.currentUser?.uid);

  const handleDelete = async (id: string) => {
  try {
    await deleteMemory(id)
    const data = await getMemories()
    setMemories(data)
  } catch (e) {
    console.error("Failed to delete memory", e)
  }
  }
 const handleLogout = async () => {
  await signOut(auth)
  router.replace("/login")
}

  const router = useRouter()

  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/login")
      }
    })

    return unsubscribe
  }, [])

  if (!auth.currentUser) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    )
  }

useFocusEffect(
  useCallback(() => {
    const loadMemories = async () => {
      const data = await getMemories();
      setMemories(data);
    }
    loadMemories();
  }, [])
);


  const handleMore = (id: string) => {
    Alert.alert("Options", "Choose an action", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Edit",
        onPress: () => router.push({ pathname: "/edit/[id]", params: { id } }),
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => handleDelete(id),
      },
    ])
  }
  
  return (
      <SafeAreaView className="flex-1 bg-cream">

   
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
    style={{
      flex: 1,
      justifyContent: "center", // center texts vertically
      alignItems: "center",     // center everything horizontally
      backgroundColor: "#efebfa",
      paddingHorizontal: 20,
    }}
  >
    {/* Big Label */}

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

    {/* Subtitle */}
    <Text
      style={{
        fontSize: width * 0.045,
        color: "#6B7280",
        textAlign: "center",
        marginBottom: 0, // space between subtitle and image
        maxWidth: "80%",
      }}
    >
      Start creating your memories today! 🪶
    </Text>

   
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
  <MaterialIcons name="more-vert" size={24} color="#6B7280" />
</TouchableOpacity>


    </View>
  )}
/>

      )}

      {/* Floating Add Button */}
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
          <MaterialIcons name="add" size={width * 0.07} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>

  )
}

export default Dashboard
