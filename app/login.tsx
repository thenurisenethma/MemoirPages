import React, { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, Alert, Dimensions } from "react-native"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebaseConfig"
import { useRouter } from "expo-router"

const { width } = Dimensions.get("window")

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert("Error", "Email & password required")
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.replace("/") // redirect after login
    } catch (e: any) {
      Alert.alert("Error", e.message)
    }
  }

  return (
    <View className="flex-1 bg-cream p-4 justify-center">
      <Text style={{ fontSize: width * 0.06, fontWeight: "700", marginBottom: 20 }}>Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        className="bg-white p-4 rounded-xl mb-4"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="bg-white p-4 rounded-xl mb-6"
      />
      <TouchableOpacity
        onPress={handleLogin}
        className="bg-lavender py-4 rounded-xl items-center"
      >
        <Text className="text-white font-semibold text-lg">Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
  onPress={() => router.push("/signup")}
  style={{ marginTop: 20, alignItems: "center" }}
>
  <Text style={{ color: "#6B7280" }}>
    Don’t have an account?{" "}
    <Text style={{ color: "#B57EDC", fontWeight: "600" }}>
      Sign Up
    </Text>
  </Text>
</TouchableOpacity>

    </View>
  )
}

export default Login
