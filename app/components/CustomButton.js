//--------------- IMPORT MODULES ----------------------------
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import AppContext from "./AppContext";

//--------------------------------------------------------------

const android = Platform.OS === "android" ? true : false;

const CustomButton = ({ isNavigationBtn, text }) => {
  const routes = useNavigation().getState().routeNames;
  const isDisabled = routes.includes(text) ? false : true;
  const navigation = useNavigation();
  const appContext = useContext(AppContext);

  const handlePress = () => {
    routes.includes(text)
      ? navigation.navigate(text)
      : Alert.alert(text, "This feature will be enabled in future updates", [
          {
            text: "Ok",
          },
        ]);
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => handlePress()}
      //onLongPress={() => {}}
    >
      <Text
        style={
          isDisabled && isNavigationBtn ? styles.disabledText : styles.text
        }
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "dodgerblue",
    height: 70,
    width: "49%",
    marginBottom: 6,
    borderRadius: 4,
  },
  text: {
    color: "whitesmoke",
    fontSize: 20,
    fontWeight: "600",
    fontFamily: android ? "Roboto" : "Avenir",
  },
  disabledText: {
    color: "#4d4d4d",
    fontSize: 19,
    fontWeight: "600",
    fontFamily: android ? "Roboto" : "Avenir",
  },
});
