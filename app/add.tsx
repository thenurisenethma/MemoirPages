import React, { useState } from "react"
import { View, Text, TextInput, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"
import { addMemory } from "./store/memoryStore"
import { Memory } from "./types/memory"

const AddMemory = () => {
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  const handleSave = () => {
  if (!title || !content) return

  const newMemory: Memory = {
    id: Date.now().toString(),
    title,
    content,
    date: new Date().toISOString().split("T")[0],
  }

  addMemory(newMemory)
  router.back()
}

  return (
    <View className="flex-1 bg-cream p-4">
      <Text className="text-2xl font-bold text-lavender mb-6">
        New Memory
      </Text>

      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        className="bg-white p-4 rounded-xl mb-4"
      />

      <TextInput
        placeholder="Write your memory..."
        value={content}
        onChangeText={setContent}
        multiline
        className="bg-white p-4 rounded-xl h-40 mb-6"
      />

      <TouchableOpacity
        onPress={handleSave}
        className="bg-lavender py-4 rounded-xl items-center"
      >
        <Text className="text-white font-semibold text-lg">
          Save Memory
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default AddMemory
