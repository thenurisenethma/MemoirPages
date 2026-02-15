import React, { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, Alert, Dimensions, ImageBackground,StyleSheet } from "react-native"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebaseConfig"
import { useRouter } from "expo-router"

const { width, height } = Dimensions.get("window");

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
    <ImageBackground
      source={require("../assets/pen.png")} // full screen bg
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>MemoirPages</Text>
        <Text style={styles.subtitle}>Create an Account</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
        />


        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#ccc"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />


        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>
      
          <TouchableOpacity           
          style={[styles.button, styles.signupButton]}
          onPress={() => router.push("/login")}>
          <Text style={[styles.buttonText, styles.signupText]}>
            Login
          </Text>
          </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width,
    height,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)", // optional dark overlay
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#ddd",
    marginBottom: 40,
  },
  input: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginBottom: 15,
    color: "#fff",
  },
  button: {
    width: "100%",
    backgroundColor: "#B57EDC",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  signupButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#fff",
  },
  signupText: {
    color: "#fff",
  },
});


export default SignUp;
