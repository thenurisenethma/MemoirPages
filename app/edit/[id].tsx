import React, { useState, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, Dimensions, Alert } from "react-native"
import { getMemories, updateMemory } from "../store/memoryStore"
import { useRouter, useLocalSearchParams } from "expo-router"
import { ActivityIndicator } from "react-native"
import { auth } from "../../firebaseConfig"
import { onAuthStateChanged } from "firebase/auth"

const { width } = Dimensions.get("window")

interface Memory {
  id: string
  title: string
  content: string
  date: string
}

const EditMemory = () => {
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

  const params = useLocalSearchParams<{ id: string }>()
  const id = params.id

  const [memory, setMemory] = useState<Memory | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

useEffect(() => {
  if (!id) return;

  const loadMemory = async () => {
    try {
      const mems = await getMemories(); 
      const m = mems.find((m) => m.id === id); 
      if (m) {
        setMemory(m);
        setTitle(m.title);
        setContent(m.content);
      }
    } catch (e) {
      console.error("Failed to load memory", e);
    }
  };

  loadMemory();
}, [id]);


  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Error", "Title and Content cannot be empty")
      return
    }
    updateMemory(id, { title, content })
    router.back()
  }

  if (!memory) {
    return (
      <View className="flex-1 items-center justify-center bg-cream p-4">
        <Text className="text-gray-500 text-lg">Memory not found</Text>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-cream p-4">
      <Text style={{ fontSize: width * 0.05, fontWeight: "600", marginBottom: 10 }}>
        Edit Memory
      </Text>

      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 10,
          marginBottom: 15,
          fontSize: width * 0.04,
        }}
      />

      <TextInput
        value={content}
        onChangeText={setContent}
        placeholder="Content"
        multiline
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 10,
          height: 150,
          textAlignVertical: "top",
          fontSize: width * 0.04,
          marginBottom: 20,
        }}
      />

      <TouchableOpacity
        style={{
          backgroundColor: "#B57EDC",
          padding: 15,
          borderRadius: 8,
          alignItems: "center",
        }}
        onPress={handleSave}
      >
        <Text style={{ color: "white", fontSize: width * 0.045 }}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  )
}

export default EditMemory
