//--------------- IMPORT MODULES ----------------------------

import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

//-------------------------------------------------------------
const android = Platform.OS === "android" ? true : false;

const LoadingScreen = (props) => {
  let rotateValueHolder = new Animated.Value(0);

  rotateValueHolder.setValue(0);

  Animated.loop(
    Animated.timing(rotateValueHolder, {
      toValue: 1,
      duration: 2500,
      easing: Easing.linear,
      useNativeDriver: true,
    })
  ).start();

  const RotateData = rotateValueHolder.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const styles = StyleSheet.create({
    OuterContainer: {
      flex: 1,
      backgroundColor: "#a593a0",
      justifyContent: "center",
      alignItems: "center",
      //marginTop: android ? StatusBar.currentHeight + 10 : 10, //for ios its under SafeAreaView
    },
    logo: {
      transform: [{ rotate: RotateData }],
      //backgroundColor: "red",
      // shadowOpacity: 0.4,
      // shadowOffset: { width: 0, height: 2 },
      tintColor: "#fffaeb",
      width: 55,
      height: 55,
      resizeMode: "contain",
      marginBottom: 10,
    },
    activityIndicatorContainer: {
      alignItems: "center",
      justifyContent: "center",
    },
    activityIndicatorText: {
      color: "rgb(50, 50, 50)",
      color: "#404040",
      fontFamily: android ? "Roboto" : "Avenir",
      fontSize: 14,
      fontWeight: "600",
    },
  });

  return (
    <View style={styles.OuterContainer}>
      <View style={styles.activityIndicatorContainer}>
        <Animated.Image
          style={styles.logo}
          source={require("../assets/getaways_logo.png")}
        />
        <Text style={styles.activityIndicatorText}>{props.loadingText}</Text>
      </View>
    </View>
  );
};

export default LoadingScreen;
