import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState,useRef } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import useSocket from "../Hook/useSocket";
import Icon from "react-native-vector-icons/MaterialIcons";

const Conversation = ({ route }) => {
  const scrollViewRef = useRef();
  const [sendMsg, setSendMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [token, setToken] = useState("");
  const { id: receiverId, id1: senderId } = route.params;

  const socket = useSocket("https://node-js-view-point.onrender.com");

  useEffect(() => {
    const fetchToken = async () => {
      const Token = await AsyncStorage.getItem("Token");
      setToken(Token);
    };

    fetchToken();
  }, []);

  useEffect(() => {
    if (token) {
      handleMessage();
    }
  }, [token]);

  const handleMessage = async () => {
    try {
      const response = await axios.get(
        `https://node-js-view-point.onrender.com/api/messages/${receiverId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching Messages:", error);
      ToastAndroid.show(
        "Error fetching Messages. Please try again.",
        ToastAndroid.LONG,
        ToastAndroid.showWithGravity
      );
    }
  };

  // Listen for new messages from Socket.IO
  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (data) => {
      const { message, participients } = data;
      if (participients.includes(receiverId)) {
        setMessages((prev) => [...prev, message]);
      }
    };
    socket.on("sendMessage", handleNewMessage);

    return () => {
      socket.off("sendMessage", handleNewMessage);
    };
  }, [socket, receiverId]);

  const handleSendMessage = async () => {
    if (sendMsg !== "") {
      try {
        const response = await axios.post(
          `https://node-js-view-point.onrender.com/api/messages/sendmessage/${receiverId}`,
          {
            message: sendMsg,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        response.status == 201 ? setSendMsg("") : "";

        if (socket) {
          socket.emit("sendMessage", {
            message: response.data.message,
            participients: [senderId, receiverId],
          });
        }
        // console.log(response.data);
      } catch (error) {
        console.error("Error sending Message:", error);
        ToastAndroid.show(
          "Error Sending Message. Please try again.",
          ToastAndroid.LONG,
          ToastAndroid.showWithGravity
        );
      }
    }
  }; 
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Messages Area */}
        <ScrollView  
          // ref={scrollViewRef}
          style={styles.chatArea}
          // onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.length > 0 ? (
            messages.map((data, i) => (
              <View
                key={i}
                style={{
                  flexDirection: "row",
                  justifyContent:
                    data.senderId !== receiverId ? "flex-end" : "flex-start",
                  marginHorizontal: 10,
                  marginVertical: 5,
                }}
              >
                <Text
                  style={[
                    styles.messageBubble,
                    data.senderId !== receiverId
                      ? styles.outgoingMessage
                      : styles.incomingMessage,
                  ]}
                >
                  <Text>{data.message}</Text>
                  {"\n"}
                  <Text style={styles.messageTime}>
                    {new Date(data.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </Text>
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noMessages}>No Messages Yet</Text>
          )}
        </ScrollView>

        <View style={styles.sendBar}>
          <TextInput
            style={styles.input}
            placeholder="Type a message"
            value={sendMsg}
            onChangeText={setSendMsg}
          />
          <Icon
            name="send"
            size={25}
            color="white"
            style={styles.sendButton}
            onPress={handleSendMessage}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Conversation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECE5DD",
  },
  chatArea: {
    flex: 1,
    marginBottom: 60,
  },
  messageBubble: {
    padding: 10,
    paddingBottom: 1,
    borderRadius: 15,
    maxWidth: "75%",
    fontSize: 14,
    lineHeight: 15,
    textAlign: "right",
  },
  messageTime: {
    fontSize: 10,
    color: "#666",
  },
  outgoingMessage: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
    borderBottomEndRadius: 0,
    borderTopRightRadius: 0,
  },
  incomingMessage: {
    backgroundColor: "#FFFFFF",
    alignSelf: "flex-start",
    borderTopLeftRadius: 0,
  },
  noMessages: {
    textAlign: "center",
    color: "gray",
  },
  sendBar: {
    position: "absolute",
    bottom: 2,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECE5DD",
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: "#ECE5DD",
  },
  input: {
    flex: 1,
    height: 45,
    paddingHorizontal: 15,
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    marginRight: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "#25D766",
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: 25,
    overflow: "hidden",
  },
});
