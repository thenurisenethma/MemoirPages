import React, { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from "react-native"
import { useRouter } from "expo-router"
import { addMemory } from "./store/memoryStore"
import { Memory } from "./types/memory"
import { auth } from "../firebaseConfig"

const { width } = Dimensions.get("window")

const AddMemory = () => {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

 const handleSave = async () => {
  if (!title.trim() || !content.trim()) return

  const user = auth.currentUser
  if (!user) {
    console.log("No logged in user")
    return
  }

  const newMemory = {
    title,
    content,
    date: new Date().toISOString().split("T")[0],
  }

  try {
    await addMemory(newMemory) 
    router.back()
  } catch (e) {
    console.error("Failed to save memory", e)
  }
}



  return (
    <ScrollView
      className="flex-1 bg-cream p-4"
      contentContainerStyle={{ paddingBottom: 50 }}
    >
      {/* Screen Title */}
      <Text
        style={{
          fontSize: width * 0.08,
          fontWeight: "700",
          color: "#B57EDC",
          marginBottom: 20,
        }}
      >
        New Memory
      </Text>
{/* Optional Image Placeholder */}
<Text style={{ color: "#6B7280", fontSize: width * 0.04 }}>
          Add an image
        </Text>
      <View
        style={{
          width: "10%",
          height: "10%",
          borderRadius: 50,
          backgroundColor: "#cfc1f7",
          marginBottom: 20,
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 1,
          borderColor: "#ddd",
        }}
      >
                  {/* <MaterialIcons name="add" size={width * 0.07} color="white" /> */}

        <Text style={{ color: "#f8f9f9", fontSize: width * 0.04 }}>
          +
        </Text>
      </View>
      {/* Title Input */}
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={{
          backgroundColor: "#fff",
          padding: width * 0.04,
          borderRadius: 20,
          fontSize: width * 0.045,
          marginBottom: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }}
      />

      {/* Content Input */}
      <TextInput
        placeholder="Write your memory..."
        value={content}
        onChangeText={setContent}
        multiline
        style={{
          backgroundColor: "#fff",
          padding: width * 0.04,
          borderRadius: 20,
          fontSize: width * 0.04,
          height: 120,
          textAlignVertical: "top",
          marginBottom: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }}
      />

      

      {/* Save Button */}
      <TouchableOpacity
        onPress={handleSave}
        style={{
          backgroundColor: "#B57EDC",
          paddingVertical: width * 0.04,
          borderRadius: 20,
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 6,
          elevation: 5,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: width * 0.045,
            fontWeight: "600",
          }}
        >
          Save Memory
        </Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

export default AddMemory
