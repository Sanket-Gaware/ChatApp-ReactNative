import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Button,
  SafeAreaView,
  TextInput,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
// import LinearGradient from "react-native-linear-gradient";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("sanket1@gmail.com");
  const [password, setPassword] = useState("Sanket@12345");

  useEffect(() => {
    AsyncStorage.getItem("Token").then((value) => {
      if (value !== null) {
        navigation.navigate("ChatApp");
      }
    });
  });

  const handleLogin = () => {
    axios
      .post("https://node-js-view-point.onrender.com/api/auth/login", {
        //https://node-js-view-point.onrender.com/api/auth/login
        username: email,
        password: password,
      })
      .then((response) => {
        // console.log(response);
        if (response.status === 200) {
          ToastAndroid.show(
            "Login Successfull",
            ToastAndroid.SHORT,
            ToastAndroid.showWithGravity
          );
          AsyncStorage.setItem("Token", response.data.token);
          AsyncStorage.setItem("Username", email);
          navigation.navigate("ChatApp");
        }
      })
      .catch((error) => {
        if (error.message) {
          console.log(error.response.data.message);
          ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT);
        } else {
          ToastAndroid.show("Login failed !", ToastAndroid.SHORT);
          console.log(error.message);
        }
      });
  };
  return (
    <SafeAreaProvider style={styles.container}>
      {/* <LinearGradient
        colors={["#6a11cb", "#2575fc"]} 
        style={styles.container}
      > */}
      <SafeAreaView style={styles.innerContainer}>
        <Text style={styles.title}>ChatApp</Text>
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
            <Text style={styles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      {/* </LinearGradient> */}
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
    elevation: 5, // For Android shadow
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
  input:{

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
