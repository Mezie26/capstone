import { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  TextInput,
  Pressable,
  ImageBackground,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';


export default function Profile({ SetisOnboardingCompleted, ...props }) {
  const [image, setImage] = useState(false);
  const [lastname, setLastname] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [firstname, setFirstname] = useState("");
  const [email, setEmail] = useState("");
  const navigation = useNavigation(); // Initialize the navigation hook

  // Fetch login details from AsyncStorage when the component mounts
  const getLoginDetails = async () => {
    try {
      const LoginDetails = await AsyncStorage.multiGet([
        "image",
        "firstname",
        "email",
        "lastname",
        "phonenumber",
      ]);

      //const placeholder = () => (firstname.charAt(0) + email.charAt(0));

      const image = JSON.parse(LoginDetails[0][1]);
      const firstname = LoginDetails[1][1] || ""; // handle empty values
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
      console.log("Error retrieving login details");
    }
  };



    //Picking a new profile picture
    const pickImage = async () => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      console.log(result);

      try {
        await AsyncStorage.setItem("image", JSON.stringify(result.assets[0].uri))
        console.log("image uploaded")
      } catch (error) {
        console.log("error 5")
      }
  
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    };


    //Removing profile picture
    const removeImage = async () => {
      try {
        let removal = await AsyncStorage.removeItem("image");
        setImage(false);

        SetisOnboardingCompleted(false);
        console.log('Profile image deleted')
      } catch {
        console.log('Error removing profile image')
      }
    }

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
      setImage(false);
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

  const placeholder = (firstname.charAt(0) + lastname.charAt(0));

  useEffect(() => {
    getLoginDetails(); // Fetch data from AsyncStorage when component mounts
  }, [image]);


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
      <Text style={{marginLeft: 37}}>Avatar</Text>
      <View style={styles.avatarview}>
        <ImageBackground source={{ uri: image }} style={styles.profileimage}>
        {!image && <Text style={styles.profileimagetext}>{placeholder}</Text>}
        </ImageBackground>
        <Pressable 
        style={styles.changebutton}
        onPress={pickImage}
        >
          <Text style={styles.changebuttontext}>Change</Text>
        </Pressable>
        <Pressable 
        style={styles.removebutton}
        onPress={removeImage}>
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
  profileimage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    marginLeft: 20,
    fontSize: 16,
    //color: '#FFFFFF',
    textAlign: 'center',
    backgroundColor: '#F4CE14',
  },
  profileimagetext: {
    height: 50,
    width: 50,
    borderRadius: 50,
    color: '#FFFFFF',
    //justifyContent: 'center',
    textAlign: 'center',
    margin: 15,
    marginLeft: 12,
    fontSize: 37,
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