import { Memory } from "../types/memory"

let memories: Memory[] = [
  { id: "1", title: "My First Memory", content: "Today I started MemoirPages 💜", date: "2026-02-09" },
]

export const getMemories = () => [...memories]

export const addMemory = (memory: Memory) => {
  memories.push(memory)
}

export const updateMemory = (id: string, updated: { title: string; content: string }) => {
  memories = memories.map((m) => (m.id === id ? { ...m, ...updated } : m))
}

export const deleteMemory = (id: string) => {
  memories = memories.filter((m) => m.id !== id)
}
