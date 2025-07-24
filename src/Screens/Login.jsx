import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Button,
  SafeAreaView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import Toast from 'react-native-toast-message';
import { SafeAreaProvider } from "react-native-safe-area-context";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("sanket01@gmail.com");
  const [password, setPassword] = useState("Sanket@12345");

  useEffect(() => {
    AsyncStorage.getItem("Token").then((value) => {
      if (value !== null) {
        navigation.navigate("ChatApp");
      }
    });
  }, []); // Run only once on mount

const handleLogin = async () => {
  try {
    const response = await axios.post("https://node-js-view-point.onrender.com/api/auth/login/", {
      username: email,
      password: password,
    });

    if (response.status === 200) {
      // ToastAndroid.show("Login Successful", ToastAndroid.SHORT);
      Toast.show({
  type: 'success',
  text1: 'Login Successful',
});
      await AsyncStorage.setItem("Token", response.data.token);
      await AsyncStorage.setItem("Username", email);
      navigation.navigate("ChatApp");
    }
  } catch (error) {
    const message =
       error?.response?.data?.message || "Login failed. Please try again.";
    Toast.show({
  type: 'error',
  text1: message,
});
    // ToastAndroid.show(message, ToastAndroid.SHORT);
    console.log("Login Error:", error); // helpful for debugging
  }
};


  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView style={styles.innerContainer}>
        <Text style={styles.title}>Chat App</Text>
        <Text style={styles.subtitle}>Log in to your account</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginBtnText}>Login</Text>
        </TouchableOpacity>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity>
            <Text style={styles.footerLink} onPress={()=>{navigation.navigate("Signup")}}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
  },
  innerContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#f9f9f9",
  },
  loginBtn: {
    backgroundColor: "#6a11cb",
    borderRadius: 10,
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  loginBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#555",
  },
  footerLink: {
    fontSize: 14,
    color: "#6a11cb",
    fontWeight: "bold",
  },
});
