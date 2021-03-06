//--------------- IMPORT MODULES ----------------------------

import { AntDesign } from "@expo/vector-icons";
import { useContext } from "react";
import {
  Dimensions,
  Modal,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AppContext from "../../AppContext";
import StaffList from "./StaffList";
//--------------------------------------------------------------

const { width } = Dimensions.get("window");
const android = Platform.OS === "android" ? true : false;

const CustomStaffSelectionModal = () => {
  const appContext = useContext(AppContext);
  return (
    <Modal
      animationType="fade"
      visible={appContext.states.isStaffSelectionModalVisible}
      //transparent
      presentationStyle="fullScreen"
    >
      <View style={styles.viewWrapper}>
        <View style={styles.modalView}>
          <View style={styles.topWrapper}>
            <AntDesign name="close" size={26} style={styles.ghostIcon} />
            <Text style={styles.labelText}>Login with your account</Text>
            <AntDesign
              name="close"
              size={26}
              color="black"
              style={styles.closeBtn}
              onPress={() =>
                appContext.functions.toggleStaffSelectionModalVisibility()
              }
            />
          </View>
          <View style={styles.list}>
            <StaffList />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomStaffSelectionModal;

//---------------- COMPONENT STYLES ----------------------------------------------

const styles = StyleSheet.create({
  viewWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#a593a0",
  },
  modalView: {
    width: width * 0.8,
  },
  topWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#e6e6e6",
    padding: 10,
    height: 60,
    width: "100%",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderColor: "dodgerblue",
  },
  labelText: {
    color: "#262626",
    fontSize: 16,
    fontWeight: "600",
    alignSelf: "center",
    fontFamily: android ? "Roboto" : "Avenir",
  },
  ghostIcon: {
    opacity: 0,
  },
  list: {
    maxHeight: 500,
    backgroundColor: "whitesmoke",
    width: "100%",
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderColor: "dodgerblue",
    padding: 2,
  },
});

//---------------------------------------------------------------------------------
