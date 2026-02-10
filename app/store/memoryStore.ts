// import { Memory } from "../types/memory"

// let memories: Memory[] = [
//   { id: "1", title: "My First Memory", content: "Today I started MemoirPages 💜", date: "2026-02-09" },
// ]

// type Callback = (memories: Memory[]) => void
// let subscribers: Callback[] = []

// export const getMemories = () => [...memories]

// export const addMemory = (memory: Memory) => {
//   memories.push(memory)
//   notifySubscribers()
// }

// export const updateMemory = (id: string, updated: { title: string; content: string }) => {
//   memories = memories.map((m) => (m.id === id ? { ...m, ...updated } : m))
//   notifySubscribers()
// }

// export const deleteMemory = (id: string) => {
//   memories = memories.filter((m) => m.id !== id)
//   notifySubscribers()
// }

// // Subscribe for updates
// export const subscribeMemories = (callback: Callback) => {
//   subscribers.push(callback)
//   return () => {
//     subscribers = subscribers.filter((cb) => cb !== callback)
//   }
// }

// const notifySubscribers = () => {
//   subscribers.forEach((cb) => cb(getMemories()))
// }

import { db } from "../../firebaseConfig"
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore"

export interface Memory {
  id: string
  title: string
  content: string
  date: string
  image?: string
}

const memoriesRef = collection(db, "memories")

export const getMemories = async (): Promise<Memory[]> => {
  const snapshot = await getDocs(memoriesRef)
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Memory, "id">),
  }))
}

export const addMemory = async (memory: Omit<Memory, "id">) => {
  await addDoc(memoriesRef, memory)
}

export const updateMemory = async (
  id: string,
  updated: Partial<Memory>
) => {
  const ref = doc(db, "memories", id)
  await updateDoc(ref, updated)
}

export const deleteMemory = async (id: string) => {
  const ref = doc(db, "memories", id)
  await deleteDoc(ref)
}
