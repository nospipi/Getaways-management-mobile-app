//--------------- IMPORT MODULES ----------------------------

import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import {
  Dimensions,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ADMIN_ID } from "../../constants";
import AppContext from "./AppContext";

//--------------------------------------------------------------

const android = Platform.OS === "android" ? true : false;
const { width } = Dimensions.get("window");

const CustomAdminModal = () => {
  const navigation = useNavigation();

  const {
    states: {
      currentUser: { name, _id },
      isAdminModalVisible,
    },
    functions: { toggleOptionsModalVisibility },
  } = useContext(AppContext);

  return (
    <Modal
      animationType="slide"
      //transparent
      visible={isAdminModalVisible}
      presentationStyle="fullScreen"
    >
      <View style={styles.viewWrapper}>
        <View style={styles.modalView}>
          <View style={styles.iconsWrapper}>
            <AntDesign name="close" size={20} style={styles.ghostIcon} />
            <Text style={styles.labelText}>{name} options</Text>
            <AntDesign
              name="close"
              size={25}
              color="black"
              onPress={() => toggleOptionsModalVisibility()}
            />
          </View>
          <View style={styles.buttonsWrapper}>
            {_id === ADMIN_ID ? (
              <>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    toggleOptionsModalVisibility();
                    navigation.navigate("Edit/Add staff");
                  }}
                >
                  <Text style={styles.buttonText}>Edit/Add staff</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    toggleOptionsModalVisibility();
                    navigation.navigate("Edit/Add vehicle");
                  }}
                >
                  <Text style={styles.buttonText}>Edit/Add vehicles</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    toggleOptionsModalVisibility();
                    navigation.navigate("Edit/Add announcements");
                  }}
                >
                  <Text style={styles.buttonText}>Edit/Add announcements</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    toggleOptionsModalVisibility();
                    navigation.navigate("Edit/Add activities");
                  }}
                >
                  <Text style={styles.buttonText}>Edit/Add activities</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    toggleOptionsModalVisibility();
                    navigation.navigate("Manage devices");
                  }}
                >
                  <Text style={styles.buttonText}>Manage devices</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    toggleOptionsModalVisibility();
                    navigation.navigate("Manage devices");
                  }}
                >
                  <Text style={styles.buttonText}>Manage devices</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAdminModal;

//---------------- COMPONENT STYLES ----------------------------------------------

const styles = StyleSheet.create({
  viewWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  modalView: {
    //alignItems: "center",
    //justifyContent: "center",
    //flexDirection: "column",
    //alignSelf: "center",
    //height: 170,
    width: width * 0.85,
    backgroundColor: "rgb(242, 242, 242)",
    //borderWidth: 1,
    borderColor: "grey",
    borderRadius: 7,
    padding: 12,
  },
  iconsWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    //alignItems: "flex-start",
    marginBottom: 5,
  },
  labelText: {
    color: "#262626",
    fontSize: 17,
    fontWeight: "600",
    alignSelf: "center",
    fontFamily: android ? "Roboto" : "Avenir",
  },
  buttonsWrapper: {
    justifyContent: "center",
    alignItems: "center",
    //marginBottom: 15,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "lightgrey",
    height: 60,
    width: "100%",
    marginTop: 6,
    borderRadius: 4,
  },
  buttonText: {
    color: "#333333",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: android ? "Roboto" : "Avenir",
  },
  ghostIcon: {
    opacity: 0,
  },
});

//---------------------------------------------------------------------------------
