import React, { useEffect, useState } from "react"
import { View, Text, Dimensions, TouchableOpacity, Alert, Image, ScrollView } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { getMemories, deleteMemory } from "../store/memoryStore"
import { Memory } from "../store/memoryStore"   
import { Stack } from "expo-router"

const { width } = Dimensions.get("window")



const MemoryView = () => {
  const router = useRouter()
  const params = useLocalSearchParams<{ id: string }>()
  const id = params.id

  const [memory, setMemory] = useState<Memory | null>(null)

  useEffect(() => {
    if (!id) return

    const loadMemory = async () => {
      try {
        const memories = await getMemories()  
        const mem = memories.find((m) => m.id === id)
        if (mem) setMemory(mem)
      } catch (e) {
        console.error("Failed to load memory", e)
      }
    }

    loadMemory()
  }, [id])

  const handleMore = (id: string) => {
    Alert.alert("Options", "Choose an action", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Edit",
        onPress: () => router.push(`/edit/[id]`),
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteMemory(id)
            router.back()
          } catch (e) {
            console.error("Failed to delete memory", e)
          }
        },
      },
    ])
  }

  if (!memory) {
    return (
      <View className="flex-1 items-center justify-center bg-cream p-4">
        <Text className="text-gray-500 text-lg">Memory not found</Text>
      </View>
    )
  }

  return (
      <ScrollView className="flex-1 bg-cream px-4 pt-10">
            <Stack.Screen options={{ headerShown: false }} />

      {/* Title + More button */}
        <View className="flex-row items-start justify-between mb-2">
        <Text
          style={{
            fontSize: width * 0.07,
            fontWeight: "700",
            flexShrink: 1,
          }}
        >          {memory.title}
        </Text>
        <TouchableOpacity onPress={() => handleMore(memory.id)}>
          <Text style={{ fontSize: 28 }}>⋯</Text>
        </TouchableOpacity>
      </View>

            {/* Date */}
        <Text style={{ fontSize: width * 0.04, color: "#6B7280", marginBottom: 10 }}>
          {memory.date}
        </Text>

        <View
          style={{
            width: 60,
            height: 4,
            backgroundColor: "#C4B5FD",
            borderRadius: 10,
            marginBottom: 20,
          }}
    />

    {/* Content */}
    <Text style={{ fontSize: width * 0.045, lineHeight: 28 }}>
      {memory.content}
    </Text>
          {/* Optional Image */}
      {memory.image && (
        <Image
          source={{ uri: memory.image }}
          style={{
            width: "100%",
            height: 200,
            marginTop: 15,
            borderRadius: 12,
          }}
        />
      )}
    </ScrollView>
  )
}

export default MemoryView
