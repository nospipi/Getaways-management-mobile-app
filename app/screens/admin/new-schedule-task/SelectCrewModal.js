//--------------- IMPORT MODULES ----------------------------

import { AntDesign } from "@expo/vector-icons";
import { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as constants from "../../../../constants";
import AppContext from "../../../components/AppContext";
import DropdownMultiSelect from "../../../components/DropdownMultiSelect";

//--------------------------------------------------------------

const { width } = Dimensions.get("window");
const android = Platform.OS === "android" ? true : false;

const SelectCrewModal = ({
  visible,
  setVisible,
  setCrew,
  selectedDrivers,
  selectedEscorts,
  selectedGuides,
}) => {
  //----------- COMPONENT STATES --------------------
  const [isLoading, setIsLoading] = useState(false);
  const [expandedDropdowns, setExpandedDropdowns] = useState({
    1: false,
    2: false,
    3: false,
  });
  const setNewExpandedState = (id, state) => {
    let newExpandedDropdowns = { ...expandedDropdowns }; //deep copy object for immutability
    Object.keys(newExpandedDropdowns).forEach((id) => {
      newExpandedDropdowns[id] = false;
    }); //change all expanded states to false
    newExpandedDropdowns[id] = state; //change given id to given value
    setExpandedDropdowns(newExpandedDropdowns); //set original state to new state
  };
  const appContext = useContext(AppContext);
  const store = useSelector((store) => store);
  const drivers = store.data.entities.staff
    .filter(
      (staffMember) =>
        staffMember._id !== constants.ADMIN_ID &&
        staffMember.roles.includes("driver")
    )
    .map((staffMember) => {
      return { label: staffMember.name, value: staffMember._id };
    });
  const escorts = store.data.entities.staff
    .filter(
      (staffMember) =>
        staffMember._id !== constants.ADMIN_ID &&
        staffMember.roles.includes("escort")
    )
    .map((staffMember) => {
      return { label: staffMember.name, value: staffMember._id };
    });
  const guides = store.data.entities.staff
    .filter(
      (staffMember) =>
        staffMember._id !== constants.ADMIN_ID &&
        staffMember.roles.includes("guide")
    )
    .map((staffMember) => {
      return { label: staffMember.name, value: staffMember._id };
    });
  const dispatch = useDispatch();

  //----------- COMPONENT FUNCTIONS -----------------

  //------------- COMPONENT RETURN ----------------------------

  return (
    <Modal animationType="slide" visible={visible} transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        enabled={true}
        style={styles.viewWrapper}
      >
        <View style={styles.modalView}>
          <View style={styles.topWrapper}>
            <AntDesign name="close" size={27} style={styles.ghostIcon} />
            <Text style={styles.labelText}>Select crew</Text>
            <AntDesign
              name="close"
              size={27}
              color="white"
              onPress={() => setVisible(false)}
            />
          </View>
          <DropdownMultiSelect
            isExpanded={expandedDropdowns[1]}
            keyIdentifier={1}
            setExpandedState={(key, state) => {
              if (state === true) {
                setNewExpandedState(key, state);
              } else {
                setExpandedDropdowns({ ...expandedDropdowns, [key]: state });
              }
            }}
            items={drivers}
            selectedItems={selectedDrivers}
            containerStyles={{
              width: "100%",
              borderBottomWidth: 0.5,
              borderColor: "grey",
              maxHeight: 350,
            }}
            buttonContainerStyles={styles.rolesButtonContainer}
            buttonStyles={styles.rolesButton}
            buttonTextStyles={styles.rolesButtonTextStyles}
            itemStyles={styles.rolesItems}
            buttonText={"Select driver"}
            sendDataToParent={(data) => {
              setCrew("drivers", data);
            }}
          />
          <DropdownMultiSelect
            isExpanded={expandedDropdowns[2]}
            keyIdentifier={2}
            setExpandedState={(key, state) => {
              if (state === true) {
                setNewExpandedState(key, state);
              } else {
                setExpandedDropdowns({ ...expandedDropdowns, [key]: state });
              }
            }}
            items={escorts}
            selectedItems={selectedEscorts}
            containerStyles={{
              width: "100%",
              borderBottomWidth: 0.5,
              borderColor: "grey",
              maxHeight: 350,
            }}
            buttonContainerStyles={styles.rolesButtonContainer}
            buttonStyles={styles.rolesButton}
            buttonTextStyles={styles.rolesButtonTextStyles}
            itemStyles={styles.rolesItems}
            buttonText={"Select escort"}
            sendDataToParent={(data) => {
              setCrew("escorts", data);
            }}
          />
          <DropdownMultiSelect
            isExpanded={expandedDropdowns[3]}
            keyIdentifier={3}
            setExpandedState={(key, state) => {
              if (state === true) {
                setNewExpandedState(key, state);
              } else {
                setExpandedDropdowns({ ...expandedDropdowns, [key]: state });
              }
            }}
            items={guides}
            selectedItems={selectedGuides}
            containerStyles={{ width: "100%", maxHeight: 350 }}
            buttonContainerStyles={styles.rolesButtonContainer}
            buttonStyles={styles.rolesButton}
            buttonTextStyles={styles.rolesButtonTextStyles}
            itemStyles={styles.rolesItems}
            buttonText={"Select guide"}
            sendDataToParent={(data) => {
              setCrew("guides", data);
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
//TODO make guides dropdown searchable
export default SelectCrewModal;

//---------------- COMPONENT STYLES ----------------------------------------------

const styles = StyleSheet.create({
  viewWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  modalView: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    alignSelf: "center",
    width: width * 0.85,
    borderRadius: 4,
    padding: 4,
    backgroundColor: "white",
  },
  topWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#d9d9d9",
    width: "100%",
    height: 45,
    padding: 10,
    borderTopStartRadius: 4,
    borderTopEndRadius: 4,
  },
  ghostIcon: {
    opacity: 0,
  },
  inputWrapper: {
    flexDirection: "row",
    backgroundColor: "grey",
    height: 60,
  },
  inputContainer: {
    flex: 1,
    borderColor: "#333333",
    marginBottom: 1.5,
  },
  input: {
    flex: 1,
    textAlign: "center",
    backgroundColor: "white",
    padding: 10,
  },

  labelText: {
    color: "#262626",
    fontSize: 18,
    fontWeight: "600",
    alignSelf: "center",
    fontFamily: android ? "Roboto" : "Avenir",
  },
  bottomWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  submitBtn: {
    justifyContent: "center",
    alignItems: "center",
    flex: 2,
    backgroundColor: "#d9d9d9",
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    height: 50,
    padding: 4,
  },
  rolesButtonContainer: {
    height: 50,
    justifyContent: "center",
  },
  rolesButton: {
    flexDirection: "row",
    height: "100%",
    paddingHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  rolesButtonTextStyles: {
    alignSelf: "center",
    fontFamily: android ? "Roboto" : "Avenir",
    fontSize: 14,
    opacity: 0.7,
    textTransform: "capitalize",
  },
  rolesItems: {
    backgroundColor: "whitesmoke",
    marginBottom: 1.5,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 10,
    paddingRight: 6,
    height: 50,
  },
});

//---------------------------------------------------------------------------------
