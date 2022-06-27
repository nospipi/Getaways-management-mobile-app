//--------------- IMPORT MODULES ----------------------------

import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { useContext, useState } from "react";
import { useDispatch } from "react-redux";

import { Formik } from "formik";
import {
  ActivityIndicator,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ROLES } from "../../../../constants";
import { addStaffMember } from "../../../../src/api/api";
import AppContext from "../../../components/AppContext";
import DropdownMultiSelect from "../../../components/DropdownMultiSelect";
//--------------------------------------------------------------

const { width } = Dimensions.get("window");
const android = Platform.OS === "android" ? true : false;

const NewStaffMemberFormModal = () => {
  //----------- COMPONENT STATES --------------------
  const [isLoading, setIsLoading] = useState(false);
  const [rolesMultiSelectExpanded, setRolesMultiSelectExpanded] =
    useState(false);
  const appContext = useContext(AppContext);
  const dispatch = useDispatch();
  const roles = ROLES.map((role) => {
    return {
      label: role,
      value: role,
    };
  });

  //----------- COMPONENT FUNCTIONS -----------------

  //------------- COMPONENT RETURN ----------------------------

  return (
    <Modal
      animationType="slide"
      visible={appContext.states.isStaffModalVisible}
      //presentationStyle="fullScreen"
      transparent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        enabled={true}
        style={styles.viewWrapper}
      >
        <View style={styles.modalView}>
          <Formik
            enableReinitialize
            initialValues={{
              name: "",
              username: "",
              password: "",
              roles: [],
              tel: "",
              email: "",
            }}
            onSubmit={(values) => {
              Keyboard.dismiss();
              setIsLoading(true);
              addStaffMember(
                {
                  name: values.name,
                  username: values.username,
                  password: values.password,
                  tel: values.tel,
                  email: values.email,
                  roles: values.roles,
                },
                appContext.functions.showMsgModal,
                appContext.functions.toggleStaffModalVisibility,
                dispatch
              ).then((result) => {
                setIsLoading(false);
              });
            }}
          >
            {({
              handleChange,
              handleSubmit,
              setFieldValue,
              values,
              errors,
            }) => (
              <>
                <View style={styles.topWrapper}>
                  <AntDesign name="close" size={27} style={styles.ghostIcon} />
                  <Text style={styles.labelText}>New staff member</Text>
                  <AntDesign
                    name="close"
                    size={27}
                    color="black"
                    onPress={() =>
                      appContext.functions.toggleStaffModalVisibility()
                    }
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder={`Name`}
                      keyboardType="default"
                      autoCorrect={false}
                      onChangeText={handleChange("name")}
                      returnKeyType="done"
                    ></TextInput>
                  </View>
                </View>
                <View style={{ ...styles.inputWrapper }}>
                  <View
                    style={{
                      marginRight: 1.5,
                      ...styles.inputContainer,
                    }}
                  >
                    <TextInput
                      style={styles.input}
                      autoFocus
                      placeholder="Username"
                      keyboardType="default"
                      autoCorrect={false}
                      onChangeText={handleChange("username")}
                      returnKeyType="done"
                    ></TextInput>
                  </View>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder={`Password`}
                      keyboardType="numeric"
                      maxLength={6}
                      autoCorrect={false}
                      onChangeText={handleChange("password")}
                      returnKeyType="done"
                    ></TextInput>
                  </View>
                </View>
                <View style={styles.inputWrapper}>
                  <View style={{ marginRight: 1.5, ...styles.inputContainer }}>
                    <TextInput
                      style={styles.input}
                      placeholder="Phone"
                      keyboardType="phone-pad"
                      autoCorrect={false}
                      onChangeText={handleChange("tel")}
                      returnKeyType="done"
                    ></TextInput>
                  </View>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder={`Email`}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      onChangeText={handleChange("email")}
                      returnKeyType="done"
                    ></TextInput>
                  </View>
                </View>
                <DropdownMultiSelect
                  isExpanded={rolesMultiSelectExpanded}
                  setExpandedState={() =>
                    setRolesMultiSelectExpanded(!rolesMultiSelectExpanded)
                  }
                  items={roles}
                  selectedItems={[]}
                  containerStyles={{ width: "100%" }}
                  buttonContainerStyles={styles.rolesButtonContainer}
                  buttonStyles={styles.rolesButton}
                  buttonTextStyles={styles.rolesButtonTextStyles}
                  itemStyles={styles.rolesItems}
                  buttonText={"Select roles"}
                  sendDataToParent={(data) => {
                    setFieldValue(
                      "roles",
                      data.map((i) => i.label)
                    );
                  }}
                />
                {/* isExpanded={rolesMultiSelectExpanded}
                      //keyIdentifier={3}
                      setExpandedState={() =>
                        setRolesMultiSelectExpanded(!rolesMultiSelectExpanded)
                      }
                      items={roles}
                      selectedItems={selectedRoles}
                      containerStyles={{ width: "100%" }}
                      buttonContainerStyles={styles.rolesButtonContainer}
                      buttonStyles={styles.rolesButton}
                      buttonTextStyles={styles.rolesButtonTextStyles}
                      itemStyles={styles.rolesItems}
                      buttonText={`Roles: ${data.roles}`}
                      sendDataToParent={(data) => {
                        setFieldValue(
                          "roles",
                          data.map((i) => i.label)
                        );
                      }} */}
                <View style={styles.bottomWrapper}>
                  <TouchableOpacity
                    style={styles.submitBtn}
                    onPress={handleSubmit}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="black" />
                    ) : (
                      <FontAwesome name="check" size={24} color="darkgreen" />
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Formik>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default NewStaffMemberFormModal;

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
    width: width * 0.8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "dodgerblue",
    backgroundColor: "grey",
  },
  topWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#d9d9d9",
    width: "100%",
    height: 50,
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
    height: 60,
    backgroundColor: "white",
    justifyContent: "center",
    marginBottom: 1.5,
  },
  rolesButton: {
    flexDirection: "row",
    height: "100%",
    paddingHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  rolesButtonTextStyles: {
    color: "#262626",
    alignSelf: "center",
    fontFamily: android ? "Roboto" : "Avenir",
    fontSize: 14,
    opacity: 0.4,
    textTransform: "capitalize",
  },
  rolesItems: {
    backgroundColor: "whitesmoke",
    marginBottom: 1.5,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
    height: 50,
  },
});

//---------------------------------------------------------------------------------
