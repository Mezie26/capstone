import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import Onboarding from "./screens/Onboarding";
import Profile from "./screens/Profile";
import SplashScreen from "./screens/SplashScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, SetisLoading] = useState(true);
  const [isOnboardingCompleted, SetisOnboardingCompleted] = useState(false);

  const getLogin = async () => {
    try {
      const loginDetails = await AsyncStorage.multiGet(["firstname", "email"]);
      const hasOnboardingCompleted = loginDetails.some(
        ([key, value]) => value !== null
      ); // Check if any value exists

      SetisOnboardingCompleted(hasOnboardingCompleted); // Set true if user data is found
    } catch (error) {
      // console.log("Error retrieving login details", error);
    } finally {
      SetisLoading(false);
    }
  };

  useEffect(() => {
    getLogin();
  }, [isOnboardingCompleted]);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isOnboardingCompleted ? (
        <Stack.Screen name="Profile">
          {props => <Profile {...props} SetisOnboardingCompleted={SetisOnboardingCompleted}/>}
        </Stack.Screen>
        ) : (
          <Stack.Screen name="Onboarding">
            {props => <Onboarding {...props} SetisOnboardingCompleted={SetisOnboardingCompleted}/>}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333333",
  },
});