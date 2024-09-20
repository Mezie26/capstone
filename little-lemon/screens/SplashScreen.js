import { View, Image, StyleSheet, ActivityIndicator } from "react-native";

export default function SplashScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Image
        style={styles.image}
        source={require("../img/LittleLemonLogo.png")}
      />
      <ActivityIndicator size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 200,
    width: 400,
    resizeMode: "contain",
  },
});