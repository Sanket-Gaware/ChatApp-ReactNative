import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../Screens/Login";
import Signup from "../Screens/Signup";
import DisplayUsers from "../Screens/DisplayUsers";
import Conversation from "../Screens/Conversation";

const Stack = createStackNavigator();
const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
      
        <Stack.Screen name="ChatApp" component={DisplayUsers} />
        <Stack.Screen name="Conversation" component={Conversation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default Navigation;
