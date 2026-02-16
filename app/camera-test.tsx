import { View, TouchableOpacity, Text } from "react-native"
import { CameraView, useCameraPermissions } from "expo-camera"
import { useRef } from "react"
import { useRouter } from "expo-router"

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions()
  const cameraRef = useRef<CameraView>(null)
  const router = useRouter()

  const takePhoto = async () => {
    if (!cameraRef.current) return
    const photo = await cameraRef.current.takePictureAsync()

    // Send photo URI back
    router.replace({
      pathname: "/add", 
      params: { image: photo.uri }
    })
    
  }

  if (!permission?.granted) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text onPress={requestPermission}>
          Grant Camera Permission
        </Text>
      </View>
    )
  }

  return (
    <View className="flex-1">
      <CameraView ref={cameraRef} style={{ flex: 1 }} />
      <TouchableOpacity
        onPress={takePhoto}
        className="absolute bottom-20 self-center bg-white px-6 py-4 rounded-full"
      >
        <Text>Take Photo</Text>
      </TouchableOpacity>
    </View>
  )
}
