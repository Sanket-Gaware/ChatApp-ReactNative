import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  ToastAndroid,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const DisplayUsers = ({ navigation }) => {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [lastMessage, setLastMessage] = useState([]);
  const [search, setSearch] = useState("");
  //http://localhost:8082/api/messages/getlastmessage/677530ee52a176e4ab3e7f48
  useEffect(() => {
    const fetchTokenAndUsername = async () => {
      const Token = await AsyncStorage.getItem("Token");
      const Username = await AsyncStorage.getItem("Username");
      setToken(Token);
      setUsername(Username);
    };

    fetchTokenAndUsername();
  }, []);

  useEffect(() => {
    if (token) {
      fetchUsersData();
      getLastMessage();
    }
  }, [token]);

  const fetchUsersData = async () => {
    try {
      const response = await axios.get(
        "https://node-js-view-point.onrender.com/api/users/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(response.data);
    } catch (error) {
      // console.error("Error fetching users:", error);
      ToastAndroid.show(
        "Error fetching data. Please try again.",
        ToastAndroid.LONG,
        ToastAndroid.showWithGravity
      );
    }
  };

  const currentUser = users.find((user) => user.username === username);
  // console.log(currentUser);
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(search.toLowerCase()) &&
      user.username !== currentUser.username
  );

  const getLastMessage = async () => {
    console.log("Fetching last messages...");
    for (const user of filteredUsers || []) {
      try {
        const response = await axios.get(
          `https://node-js-view-point.onrender.com/api/messages/getlastmessage/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(`Last message for user ${user._id}:`, response.data);
        setLastMessage(response.data);
      } catch (error) {
        console.error(
          "Error fetching last message for user:",
          user._id,
          error.data
        );
        ToastAndroid.showWithGravity(
          "Error fetching data. Please try again.",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM
        );
      }
    }
  };

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search contacts..."
            value={search}
            onChangeText={(text) => setSearch(text)}
          />
        </View>
        <View style={styles.userListContainer}>
          {filteredUsers?.length > 0 ? (
            filteredUsers?.map((item) => (
              <TouchableOpacity
                key={item._id}
                style={styles.userContainer}
                onPress={() =>
                  navigation.navigate("Conversation", {
                    id: item._id,
                    id1: currentUser._id,
                  })
                }
              >
                <Image
                  source={
                    item.gender === "male"
                      ? require("../../assets/male-avatar.jpg")
                      : require("../../assets/female-avatar.jpg")
                  }
                  style={styles.avatar}
                />
                <View style={{ gap: 5 }}>
                  <Text style={styles.username}>{item.fullname}</Text>
                  {lastMessage.length > 0
                    ? lastMessage.map((msg, i) => {
                        return (
                          <Text key={i} style={styles.message}>
                            {item._id == msg.receiverId ? msg.message : ""}
                          </Text>
                        );
                      })
                    : ""}
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noUsersText}>
              No users found or network problem.
            </Text>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default DisplayUsers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    backgroundColor: "lightgray",
  },
  searchBarContainer: {
    paddingHorizontal: 15,
  },
  searchBar: {
    height: 45,
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  userListContainer: {
    marginVertical: 0,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  username: {
    fontSize: 16,
    marginLeft: 5,
    color: "#000",
    fontWeight: "bold",
  },
  message: {
    fontSize: 14,
    marginLeft: 7,
    color: "gray",
  },
  noUsersText: {
    textAlign: "center",
    marginTop: 20,
    color: "gray",
  },
});
