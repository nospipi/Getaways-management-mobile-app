import { Image, StyleSheet, View } from "react-native";
import RotatingOliveCrown from "./RotatingOliveCrown";

export default function topLogoContainer(props) {
  return (
    <View style={styles.container}>
      <RotatingOliveCrown />
      <Image
        style={styles.logo}
        source={require("../../assets/text_logo.png")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 30,
    //backgroundColor: "blue",
  },
  logo: {
    marginLeft: 10,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    width: 160,
    height: 90,
    resizeMode: "contain",
    //backgroundColor: "red",
  },
});
