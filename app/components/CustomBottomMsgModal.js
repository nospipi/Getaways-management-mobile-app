//--------------- IMPORT MODULES ----------------------------

import { useContext, useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AppContext from "./AppContext";

//--------------------------------------------------------------

const { width } = Dimensions.get("window");
const android = Platform.OS === "android" ? true : false;

const CustomBottomMsgModal = () => {
  const slider = useRef(new Animated.Value(0)).current;
  const appContext = useContext(AppContext);

  const slideIn = () => {
    Animated.timing(slider, {
      toValue: 1,
      duration: 80,
      useNativeDriver: false,
    }).start();
  };

  const slideOut = () => {
    Animated.timing(slider, {
      toValue: 0,
      duration: 80,
      useNativeDriver: false,
    }).start();
  };

  // supported in native driver :
  //const TRANSFORM_WHITELIST = {
  //   translateX: true,
  //   translateY: true,
  //   scale: true,
  //   scaleX: true,
  //   scaleY: true,
  //   rotate: true,
  //   rotateX: true,
  //   rotateY: true,
  //   rotateZ: true,
  //   perspective: true,
  // };

  const slideModal = {
    bottom: slider.interpolate({
      inputRange: [0, 1],
      outputRange: [-100, 0],
    }),
  };

  useEffect(() => {
    appContext.states.isMsgModalVisible.isVisible ? slideIn() : slideOut();
  }, [appContext.states.isMsgModalVisible.isVisible]);

  return (
    <Animated.View
      style={[
        styles.modalView,
        slideModal,
        {
          backgroundColor: appContext.states.isMsgModalVisible.isSuccessfull
            ? "#00802b"
            : "indianred",
        },
      ]}
    >
      <View
        style={[
          styles.modalContainer,
          { opacity: appContext.states.isMsgModalVisible.isVisible ? 1 : 0 },
        ]}
      >
        <Text style={styles.modalText}>
          {appContext.states.isMsgModalVisible.msg}
        </Text>
      </View>
    </Animated.View>
  );
};

export default CustomBottomMsgModal;

//---------------- COMPONENT STYLES ----------------------------------------------

const styles = StyleSheet.create({
  modalView: {
    position: "absolute",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.1,
    alignSelf: "center",
    width: width,
    borderColor: "white",
    paddingVertical: 20,
    paddingHorizontal: 5,
  },
  modalContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  modalText: {
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
    alignSelf: "center",
    fontFamily: android ? "Roboto" : "Avenir",
    color: "whitesmoke",
  },
});

//---------------------------------------------------------------------------------
