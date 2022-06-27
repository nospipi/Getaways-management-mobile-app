//--------------- IMPORT MODULES ----------------------------
import { Animated, Easing, StyleSheet } from "react-native";

//------------------------------------------------------------

const RotatingImg = () => {
  let rotateValueHolder = new Animated.Value(0);

  rotateValueHolder.setValue(0);

  Animated.loop(
    Animated.timing(rotateValueHolder, {
      toValue: 1,
      duration: 11000,
      easing: Easing.linear,
      useNativeDriver: true,
    })
  ).start();

  const RotateData = rotateValueHolder.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const styles = StyleSheet.create({
    logo: {
      transform: [{ rotate: RotateData }],
      //backgroundColor: "red",
      shadowOpacity: 0.4,
      shadowOffset: { width: 0, height: 2 },
      width: 90,
      height: 120,
      resizeMode: "contain",
    },
  });

  return (
    <Animated.Image
      style={styles.logo}
      source={require("../../assets/getaways_logo.png")}
    />
  );
};

export default RotatingImg;
