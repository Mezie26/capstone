import { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  Pressable,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Onboarding({ navigation, SetisOnboardingCompleted }) {
  const [firstname, onChangeFirstname] = useState("");
  const [email, onChangeEmail] = useState("");

  const storeLogin = async () => {
    try {
      await AsyncStorage.multiSet([
        ["firstname", firstname],
        ["email", email],
      ]);
      Alert.alert("Onboarding Completed", "Your data has been saved.");
      SetisOnboardingCompleted(true); // Update state in App to navigate to Profile
      navigation.navigate("Profile"); // Navigate to Profile screen
    } catch (error) {
      console.log("Error saving login details", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerwrapper}>
        <Image
          style={styles.image}
          source={require("../img/littlelemonicon.png")}
        />
        <Text style={styles.headerText}>Little Lemon</Text>
      </View>
      <Text style={styles.welcometext}>Let us get to know you</Text>
      <Text style={styles.inputboxheader}>First name</Text>
      <TextInput
        value={firstname}
        onChangeText={onChangeFirstname}
        style={styles.inputBox}
        placeholder="First Name"
        keyboardType="default"
        clearButtonMode="always"
      />
      <Text style={styles.inputboxrequirements}>* First name is required</Text>
      <Text style={styles.inputboxheader}>Email address</Text>
      <TextInput
        value={email}
        onChangeText={onChangeEmail}
        style={styles.inputBox}
        placeholder="Email address"
        keyboardType="email-address"
        clearButtonMode="always"
      />
      <Text style={styles.inputboxrequirements}>
        *Email address is required
      </Text>
      <Pressable
        style={styles.button}
        disabled={!firstname || !email} // Disable button if either field is empty
        onPress={storeLogin}>
        <Text style={styles.buttonText}>Next</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerwrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  image: {
    width: 50,
    height: 70,
    resizeMode: "contain",
    marginTop: 10,
  },
  headerText: {
    paddingRight: 10,
    paddingLeft: 20,
    paddingTop: 20,
    paddingBottom: 10,
    fontSize: 40,
    color: "#495E57",
    textAlign: "center",
  },
  welcometext: {
    height: 40,
    fontSize: 30,
    color: "#495E57",
    textAlign: "center",
    margin: 70,
  },
  inputboxheader: {
    fontSize: 20,
    marginLeft: 20,
    color: "#495E57",
  },
  inputboxrequirements: {
    fontSize: 15,
    fontStyle: "italic",
    marginLeft: 20,
    marginBottom: 25,
    color: "#495E57",
  },
  inputBox: {
    height: 40,
    margin: 20,
    marginTop: 10,
    marginBottom: 5,
    borderWidth: 1,
    padding: 10,
    fontSize: 16,
    borderColor: "#495E57",
    backgroundColor: "#EDEFEE",
    borderRadius: 10,
  },
  button: {
    fontSize: 22,
    padding: 10,
    marginVertical: 8,
    marginTop: 50,
    margin: 100,
    backgroundColor: "#495E57",
    borderColor: "#EDEFEE",
    borderWidth: 2,
    borderRadius: 10,
    textAlign: "right",
  },
  buttonText: {
    color: "#EDEFEE",
    textAlign: "center",
    fontSize: 25,
  },
});