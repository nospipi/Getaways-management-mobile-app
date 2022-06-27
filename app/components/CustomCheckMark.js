//--------------- IMPORT MODULES ----------------------------

import LottieView from "lottie-react-native";
import { StyleSheet } from "react-native";

//--------------------------------------------------------------

const CustomCheckMark = ({ visible = false, width, height, speed }) => {
  const styles = StyleSheet.create({
    container: {
      width: width,
      height: height,
      alignSelf: "center",
      justifyContent: "center",
      alignContent: "center",
    },
  });

  if (!visible) return null;
  return (
    <LottieView
      source={require("../assets/lotties/check.json")}
      autoPlay
      loop={false}
      speed={speed}
      style={styles.container}
    />
  );
};

export default CustomCheckMark;
