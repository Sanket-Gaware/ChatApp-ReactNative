import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import axios from "axios";

const Signup = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    profile:
      "https://img.freepik.com/free-photo/3d-rendering-boy-wearing-cap-with-letter-r_1142-40523.jpg?ga=GA1.1.1384733336.1733983682&semt=ais_hybrid",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Invalid email format";

    if (!form.password || form.password.length < 6)
      newErrors.password = "Minimum 6 characters required";

    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords must match";

    if (!form.gender.trim()) newErrors.gender = "Gender is required";

    if (!form.profile) newErrors.profile = "Profile image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    const payload = {
      profile: form.profile,
      fullname: `${form.firstName} ${form.lastName}`,
      username: form.email,
      gender: form.gender,
      password: form.password,
      confirmPassword: form.confirmPassword,
    };

    try {
      const res = await axios.post(
        "https://node-js-view-point.onrender.com/api/auth/signup",
        payload
      );

      if (res.status === 201) {
        // Toast.show({
        //   type: "success",
        //   text1: "Account created successfully!",
        // });
        // Optionally reset the form
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          gender: "",
          profile: form.profile,
        });
        setErrors({});
      }
    } catch (err) {
      // Toast.show({
      //   type: "error",
      //   text1: "Signup failed",
      //   text2: err.response?.data?.message || err.message,
      // });
      console.log(err);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
        Create an Account
      </Text>

      {/* First Name */}
      <Text>First Name</Text>
      <TextInput
        placeholder="Sanket"
        value={form.firstName}
        onChangeText={(val) => setForm({ ...form, firstName: val })}
        style={inputStyle}
      />
      {errors.firstName && <Text style={errorStyle}>{errors.firstName}</Text>}

      {/* Last Name */}
      <Text>Last Name</Text>
      <TextInput
        placeholder="Gaware"
        value={form.lastName}
        onChangeText={(val) => setForm({ ...form, lastName: val })}
        style={inputStyle}
      />
      {errors.lastName && <Text style={errorStyle}>{errors.lastName}</Text>}

      {/* Email */}
      <Text>Email</Text>
      <TextInput
        placeholder="you@example.com"
        value={form.email}
        onChangeText={(val) => setForm({ ...form, email: val })}
        keyboardType="email-address"
        autoCapitalize="none"
        style={inputStyle}
      />
      {errors.email && <Text style={errorStyle}>{errors.email}</Text>}

      {/* Password */}
      <Text>Password</Text>
      <TextInput
        placeholder="••••••••"
        secureTextEntry
        value={form.password}
        onChangeText={(val) => setForm({ ...form, password: val })}
        style={inputStyle}
      />
      {errors.password && <Text style={errorStyle}>{errors.password}</Text>}

      {/* Confirm Password */}
      <Text>Confirm Password</Text>
      <TextInput
        placeholder="••••••••"
        secureTextEntry
        value={form.confirmPassword}
        onChangeText={(val) => setForm({ ...form, confirmPassword: val })}
        style={inputStyle}
      />
      {errors.confirmPassword && (
        <Text style={errorStyle}>{errors.confirmPassword}</Text>
      )}

      {/* Gender */}
      <Text>Gender</Text>
      <TextInput
        placeholder="male / female / other"
        value={form.gender}
        onChangeText={(val) => setForm({ ...form, gender: val })}
        style={inputStyle}
      />
      {errors.gender && <Text style={errorStyle}>{errors.gender}</Text>}

      {/* Submit */}
      <TouchableOpacity onPress={handleRegister} style={submitButton}>
        <Text style={{ color: "white", fontWeight: "bold" }}>Sign Up</Text>
      </TouchableOpacity>

      {/*<Toast />*/}
    </ScrollView>
  );
};

// === Styles ===
const inputStyle = {
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 5,
  padding: 10,
  marginBottom: 10,
};

const errorStyle = {
  color: "red",
  fontSize: 12,
  marginBottom: 10,
};

const submitButton = {
  backgroundColor: "#E1306C",
  padding: 14,
  alignItems: "center",
  borderRadius: 5,
  marginTop: 10,
};

export default Signup;
