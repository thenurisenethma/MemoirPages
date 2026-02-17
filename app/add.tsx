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
import { useLocalSearchParams } from "expo-router"
import { useEffect } from "react"


const { width } = Dimensions.get("window")

const AddMemory = () => {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const params = useLocalSearchParams<{ image?: string }>()
  const [image, setImage] = useState<string | null>(null)

  useEffect(() => {
  if (params.image) {
    setImage(params.image)
  }
}, [params.image])

const handleSave = async () => {
  if (!title.trim() || !content.trim()) return;

  const user = auth.currentUser;
  if (!user) {
    console.log("No logged in user");
    return;
  }

  const newMemory = {
  title,
  content,
  date: new Date().toISOString().split("T")[0],
  image: image || undefined,
}

  try {
    await addMemory(newMemory);
    router.back();
  } catch (e) {
    console.error("Failed to save memory", e);
  }
};




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
{/*  Image Placeholder */}
      <Text style={{ color: "#B57EDC", fontSize: 24 }}>Take Photo</Text>

      <TouchableOpacity
        onPress={() => router.push("../camera-test")} 
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: "#cfc1f7",
          marginBottom: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      ><Text style={{ color: "black", fontSize: 24 }}>Add Photo</Text>

        <Text style={{ color: "white", fontSize: 24 }}>+</Text>
      </TouchableOpacity>
      {image && (
      <Image
        source={{ uri: image }}
        style={{
          width: "100%",
          height: 200,
          borderRadius: 15,
          marginBottom: 20,
        }}
      />
    )}


      {/* Title  */}
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

      {/* Content  */}
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
