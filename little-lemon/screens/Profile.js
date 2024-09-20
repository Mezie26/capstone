import { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  TextInput,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

export default function Profile({ SetisOnboardingCompleted }) {
  const [image, setImage] = useState(null);
  const [lastname, setLastname] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [firstname, setFirstname] = useState("");
  const [email, setEmail] = useState("");

  const getLoginDetails = async () => {
    try {
      const LoginDetails = await AsyncStorage.multiGet([
        "image",
        "firstname",
        "email",
        "lastname",
        "phonenumber",
      ]);

      const image = JSON.parse(LoginDetails[0][1]) || null; // Use null if no image
      const firstname = LoginDetails[1][1] || "";
      const email = LoginDetails[2][1] || "";
      const lastname = LoginDetails[3][1] || "";
      const phonenumber = LoginDetails[4][1] || "";

      setImage(image);
      setFirstname(firstname);
      setEmail(email);
      setLastname(lastname);
      setPhonenumber(phonenumber);
      console.log("Login details retrieved successfully");
    } catch (error) {
      console.log("Error retrieving login details:", error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      await AsyncStorage.setItem("image", JSON.stringify(uri)); // Save the new image URI
    }
  };

  const removeImage = async () => {
    try {
      await AsyncStorage.removeItem("image");
      setImage(null); // Set image to null after removal
      console.log("Profile image deleted");
    } catch (error) {
      console.log("Error removing profile image:", error);
    }
  };

  // Save all changes to AsyncStorage
  const saveallchanges = async () => {
    try {
      await AsyncStorage.multiSet([
        ["image", JSON.stringify(image)],
        ["firstname", firstname],
        ["lastname", lastname],
        ["email", email],
        ["phonenumber", phonenumber],
      ]);
      console.log("Changes saved successfully");
    } catch (error) {
      console.log("Error saving changes:", error);
    }
  };

  // Clear AsyncStorage and reset all fields, then navigate to Onboarding
  const logout = async () => {
    try {
      await AsyncStorage.clear();
      setImage(null);
      setFirstname("");
      setLastname("");
      setEmail("");
      setPhonenumber("");

      // Mark onboarding as incomplete
      SetisOnboardingCompleted(false);
      alert("Logged out and cleared all data");
      console.log("Logged out and cleared all data");
    } catch (error) {
      alert("Error during logout");
    }
  };

  useEffect(() => {
    getLoginDetails();
  }, []);

  const placeholder = (firstname.charAt(0) + lastname.charAt(0))

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerwrapper}>
        <Image
          style={styles.logoimage}
          source={require("../img/littlelemonicon.png")}
        />
        <Text style={styles.logotext}>Little Lemon</Text>
      </View>
      <Text style={styles.headerText}>Personal information</Text>
      <Text style={{ marginLeft: 37 }}>Avatar</Text>
      <View style={styles.avatarview}>
        <View style={styles.profileimageContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.profileimage} />
          ) : (
            <Text style={styles.profileimageText}>{placeholder}</Text>
          )}
        </View>

        <Pressable style={styles.changebutton} onPress={pickImage}>
          <Text style={styles.changebuttontext}>Change</Text>
        </Pressable>
        <Pressable style={styles.removebutton} onPress={removeImage}>
          <Text style={styles.removebuttontext}>Remove</Text>
        </Pressable>
      </View>
      <Text style={styles.inputboxheader}>First name</Text>
      <TextInput
        value={firstname}
        onChangeText={setFirstname}
        style={styles.inputbox}
        placeholder="First Name"
        keyboardType="default"
        clearButtonMode="always"
      />
      <Text style={styles.inputboxheader}>Last name</Text>
      <TextInput
        value={lastname}
        onChangeText={setLastname}
        style={styles.inputbox}
        placeholder="Last Name"
        keyboardType="default"
        clearButtonMode="always"
      />
      <Text style={styles.inputboxheader}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.inputbox}
        placeholder="Email address"
        keyboardType="email-address"
        clearButtonMode="always"
      />
      <Text style={styles.inputboxheader}>Phone number</Text>
      <TextInput
        value={phonenumber}
        onChangeText={setPhonenumber}
        style={styles.inputbox}
        placeholder="Telephone number"
        keyboardType="phone-pad"
        clearButtonMode="always"
      />
      <Text style={styles.notificationsheader}>Email notifications</Text>
      <View style={styles.notificationsview}>
        <Image
          style={styles.notificationimages}
          source={require("../img/check button.png")}
        />
        <Text style={styles.notificationtext}>Order Status</Text>
      </View>
      <View style={styles.notificationsview}>
        <Image
          style={styles.notificationimages}
          source={require("../img/check button.png")}
        />
        <Text style={styles.notificationtext}>Password changes</Text>
      </View>
      <View style={styles.notificationsview}>
        <Image
          style={styles.notificationimages}
          source={require("../img/check button.png")}
        />
        <Text style={styles.notificationtext}>Special offers</Text>
      </View>
      <View style={styles.notificationsview}>
        <Image
          style={styles.notificationimages}
          source={require("../img/check button.png")}
        />
        <Text style={styles.notificationtext}>Newsletter</Text>
      </View>
      <Pressable style={styles.savechangesbutton} onPress={saveallchanges}>
          <Text style={styles.savechangestext}>Save Changes</Text>
      </Pressable>
      <Pressable style={styles.logoutbutton} onPress={logout}>
        <Text style={styles.logouttext}>Log out</Text>
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
    marginBottom: 10,
  },
  logoimage: {
    width: 50,
    height: 70,
    resizeMode: "contain",
    marginTop: 10,
  },
  logotext: {
    paddingRight: 10,
    paddingLeft: 20,
    paddingTop: 20,
    paddingBottom: 10,
    fontSize: 40,
    color: "#495E57",
    textAlign: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 5,
    marginLeft: 20,
  },
  avatarview: {
    flexDirection: "row",
    margin: 7,
  },
  profileimageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginLeft: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "#495E57",
  },
  profileimageText: {
    fontSize: 30,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  profileimage: {
    width: 70,
    height: 70,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#fff",
    resizeMode: "cover",
  },

  changebutton: {
    fontSize: 22,
    padding: 10,
    margin: 20,
    marginLeft: 40,
    backgroundColor: "#495E57",
    borderColor: "#495E57",
    borderWidth: 2,
    borderRadius: 10,
  },
  changebuttontext: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
  },
  removebutton: {
    fontSize: 22,
    padding: 10,
    margin: 20,
    backgroundColor: "#FFFFFF",
    borderColor: "#495E57",
    borderWidth: 2,
  },
  removebuttontext: {
    color: "#495E57",
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
  },
  inputboxheader: {
    fontSize: 17,
    marginLeft: 20,
    color: "#333333",
  },
  inputbox: {
    height: 40,
    margin: 20,
    marginTop: 2,
    marginBottom: 12,
    borderWidth: 1,
    padding: 10,
    fontSize: 16,
    borderColor: "#495E57",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
  },
  notificationsheader: {
    fontSize: 17,
    fontWeight: "bold",
    margin: 10,
    marginLeft: 20,
  },
  notificationsview: {
    flexDirection: "row",
    margin: 5,
  },
  notificationimages: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    margin: 1,
    marginLeft: 20,
    backgroundColor: "#495e57",
    borderRadius: 5,
  },
  notificationtext: {
    fontSize: 14,
    margin: 2,
    marginLeft: 7,
  },
  logoutbutton: {
    fontSize: 22,
    padding: 10,
    marginVertical: 8,
    margin: 20,
    backgroundColor: "#F4CE14",
    borderColor: "#EDEFEE",
    borderWidth: 2,
    borderRadius: 10,
  },
  logouttext: {
    color: "#333333",
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
  },
  endingview: {
    flexDirection: "row",
    margin: 10,
    justifyContent: "center",
  },
  discardchangesbutton: {
    fontSize: 22,
    padding: 10,
    marginVertical: 8,
    margin: 10,
    backgroundColor: "#FFFFFF",
    borderColor: "#495E57",
    borderWidth: 2,
    borderRadius: 10,
  },
  discardchangestext: {
    color: "#495E57",
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
  },
  savechangesbutton: {
    fontSize: 22,
    padding: 10,
    marginVertical: 8,
    margin: 20,
    backgroundColor: "#495E57",
    borderColor: "#FFFFFF",
    borderWidth: 2,
    borderRadius: 10,
  },
  savechangestext: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
  },
});