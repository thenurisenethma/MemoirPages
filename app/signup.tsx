import React, { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, Alert, Dimensions } from "react-native"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebaseConfig"
import { useRouter } from "expo-router"

const { width } = Dimensions.get("window")

const SignUp = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSignUp = async () => {
    if (!email || !password) return Alert.alert("Error", "Email & password required")
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      router.replace("/") // redirect after signup
    } catch (e: any) {
      Alert.alert("Error", e.message)
    }
  }

  return (
    <View className="flex-1 bg-cream p-4 justify-center">
      <Text style={{ fontSize: width * 0.06, fontWeight: "700", marginBottom: 20 }}>Sign Up</Text>
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
        onPress={handleSignUp}
        className="bg-lavender py-4 rounded-xl items-center"
      >
        <Text className="text-white font-semibold text-lg">Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity
  onPress={() => router.push("/login")}
  style={{ marginTop: 20, alignItems: "center" }}
>
  <Text style={{ color: "#6B7280" }}>
    Already have an account?{" "}
    <Text style={{ color: "#B57EDC", fontWeight: "600" }}>
      Login
    </Text>
  </Text>
</TouchableOpacity>

    </View>
  )
}

export default SignUp
