import { StyleSheet, View } from "react-native";
import Navigation from "./src/Navigation/Navigation";
import Toast from 'react-native-toast-message';

export default function App() {
  return (
    <View style={styles.container}>
      <Navigation />
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
