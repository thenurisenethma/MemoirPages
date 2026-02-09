import React, { useEffect, useState } from "react"
import { View, Text, Dimensions } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { getMemories } from "../store/memoryStore"

const { width } = Dimensions.get("window")

interface Memory {
  id: string
  title: string
  content: string
  date: string
  image?: string
}

const MemoryView = () => {
  const router = useRouter()
  const params = useLocalSearchParams<{ id: string }>()
  const id = params.id

  const [memory, setMemory] = useState<Memory | null>(null)

  useEffect(() => {
    if (!id) return
    const mem = getMemories().find((m) => m.id === id)
    if (mem) setMemory(mem)
  }, [id])

  if (!memory) {
    return (
      <View className="flex-1 items-center justify-center bg-cream p-4">
        <Text className="text-gray-500 text-lg">Memory not found</Text>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-cream p-4">
      <Text style={{ fontSize: width * 0.06, fontWeight: "700", marginBottom: 10 }}>
        {memory.title}
      </Text>
      <Text style={{ fontSize: width * 0.04, color: "#6B7280", marginBottom: 20 }}>
        {memory.date}
      </Text>
      <Text style={{ fontSize: width * 0.045, lineHeight: 28 }}>{memory.content}</Text>
    </View>
  )
}

export default MemoryView
