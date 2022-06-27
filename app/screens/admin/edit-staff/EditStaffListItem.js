//--------------- IMPORT MODULES ----------------------------

import { FontAwesome } from "@expo/vector-icons";
import { Formik } from "formik";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { ADMIN_ID, ROLES } from "../../../../constants";
import { deleteStaffMember, editStaffMember } from "../../../../src/api/api";
import AppContext from "../../../components/AppContext";
import DropdownMultiSelect from "../../../components/DropdownMultiSelect";

//--------------------------------------------------------------
//TODO make delete to need confirmation
const android = Platform.OS === "android" ? true : false;

const EditStaffListItem = ({ data, expanded, setNewExpandedState }) => {
  const [deleteIsLoading, setDeleteIsLoading] = useState(false);
  const [updateIsLoading, setUpdateIsLoading] = useState(false);
  const [rolesMultiSelectExpanded, setRolesMultiSelectExpanded] =
    useState(false);
  const appContext = useContext(AppContext);
  const showMsgModal = appContext.functions.showMsgModal;
  const roles = ROLES.map((role) => {
    return {
      label: role,
      value: role,
    };
  });
  const selectedRoles = data.roles.map((role) => {
    return {
      label: role,
      value: role,
    };
  });
  const dispatch = useDispatch();
  const styles = StyleSheet.create({
    container: {
      alignItems: "center",
      backgroundColor: !expanded
        ? data._id === ADMIN_ID
          ? "dodgerblue"
          : "lightgrey"
        : null,
      //padding: 4,
      paddingHorizontal: !expanded ? 5 : null,
      height: !expanded ? 60 : null,
      borderRadius: !expanded ? 6 : null,
      marginBottom: 2,
      //borderBottomWidth: expanded ? 1 : null,
      borderBottomColor: "black",
    },
    topContainer: {
      flexDirection: "row",
      flex: 1,
      justifyContent: "center",
      padding: expanded ? 10 : null,
      alignItems: "center",
      height: expanded ? 60 : null,
      //borderWidth: expanded ? 1 : null,
      borderColor: "#333333",
      marginBottom: expanded ? 2 : null,
      backgroundColor: expanded
        ? data._id === ADMIN_ID
          ? "#b3d9ff"
          : "white"
        : null,
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
      width: "100%",
    },
    text: {
      fontSize: 18,
      fontWeight: "600",
      alignSelf: "center",
      fontFamily: android ? "Roboto" : "Avenir",
      color: !expanded
        ? data._id === ADMIN_ID
          ? "white"
          : "#1a1a00"
        : "#1a1a00",
      //marginBottom: 5,
    },
    form: {
      //borderWidth: 2,
      borderColor: "grey",
      borderRadius: 5,
      //padding: 5,
      width: "100%",
    },
    devicesContainer: {},
    devicesLabelContainer: {
      backgroundColor: "white",
      height: 40,
      textAlign: "center",
      justifyContent: "center",
      alignItems: "center",
      paddingLeft: 10,
      marginBottom: 2,
    },
    devicesLabelText: {
      fontSize: 16,
      fontWeight: "600",
      alignSelf: "flex-start",
      fontFamily: android ? "Roboto" : "Avenir",
      color: "#1a1a00",
      //textDecorationLine: "underline",
    },
    deviceItemContainer: {
      flexDirection: "row",
      height: 40,
      textAlign: "center",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 2,
    },
    deviceItemTextContainer: {
      backgroundColor: "white",
      textAlign: "center",
      justifyContent: "center",
      alignItems: "flex-start",
      paddingLeft: 10,
      marginRight: 2,
      flex: 4,
      backgroundColor: "white",
      height: "100%",
    },
    deviceItemText: {
      fontSize: 16,
      fontWeight: "600",
      alignSelf: "flex-start",
      fontFamily: android ? "Roboto" : "Avenir",
      color: "#1a1a00",
    },
    deviceTrashContainer: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "white",
      height: "100%",
      flex: 1,
    },
    inputs: {
      flexDirection: "row",
      marginBottom: 2,
      height: expanded ? 60 : null,
    },
    input: {
      flex: 1,
      textAlign: "center",
      borderColor: "#333333",
      backgroundColor: "white",
      padding: 10,
    },
    icons: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      height: expanded ? 60 : null,
    },
    trashContainer: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "white",
      borderColor: "#333333",
      borderBottomLeftRadius: 6,
      height: "100%",
      flex: 1,
      marginRight: 2,
    },
    cancelContainer: {
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      backgroundColor: "white",
      flex: 3,
      marginRight: 2,
      borderBottomLeftRadius: data._id === ADMIN_ID ? 6 : 0,
    },
    cancelText: {
      fontSize: 16,
      fontWeight: "600",
      alignSelf: "center",
      fontFamily: android ? "Roboto" : "Avenir",
      color: "#1a1a00",
    },
    checkContainer: {
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      backgroundColor: "white",
      flex: 2,
      borderBottomRightRadius: 6,
    },
    rolesButtonContainer: {
      height: 60,
      backgroundColor: "white",
      justifyContent: "center",
      marginBottom: 2,
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

  useEffect(() => {
    return () => {
      setDeleteIsLoading(false);
    };
  }, []);
  // cleanup operation,because when a user is deleted the component is unmounted before deleteIsLoading is set back to false
  // The return function from the useEffect() hook is called when the component is unmounted
  // https://jasonwatmore.com/post/2021/08/27/react-how-to-check-if-a-component-is-mounted-or-unmounted
  // https://dev.to/robmarshall/how-to-use-componentwillunmount-with-functional-components-in-react-2a5g

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (!expanded) {
          setNewExpandedState(data._id, true);
        }
      }}
    >
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Text style={styles.text}>{data.name}</Text>
        </View>

        {expanded ? (
          <Formik
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

              setUpdateIsLoading(true);
              editStaffMember(
                data._id,
                {
                  name: values.name,
                  username: values.username,
                  password: values.password,
                  tel: values.tel,
                  email: values.email,
                  roles: values.roles,
                },
                showMsgModal,
                setNewExpandedState,
                setUpdateIsLoading,
                dispatch
              );
            }}
          >
            {({ handleChange, handleSubmit, setFieldValue, values }) => (
              <View style={styles.form}>
                {data._id !== ADMIN_ID ? (
                  <View style={styles.inputs}>
                    <TextInput
                      style={{ ...styles.input, flex: 1 }}
                      placeholder={`Name: ${data.name}`}
                      keyboardType="default"
                      onChangeText={handleChange("name")}
                      returnKeyType="done"
                    ></TextInput>
                  </View>
                ) : null}
                <View style={styles.inputs}>
                  {data._id !== ADMIN_ID ? (
                    <TextInput
                      style={{ ...styles.input, marginRight: 2 }}
                      placeholder={`Username: ${data.username}`}
                      keyboardType="default"
                      onChangeText={handleChange("username")}
                      returnKeyType="done"
                    ></TextInput>
                  ) : null}
                  <TextInput
                    style={styles.input}
                    placeholder={`Password`}
                    keyboardType="numeric"
                    maxLength={6}
                    onChangeText={handleChange("password")}
                    returnKeyType="done"
                  ></TextInput>
                </View>
                {data._id !== ADMIN_ID ? (
                  <>
                    <View style={styles.inputs}>
                      <TextInput
                        style={{ ...styles.input, marginRight: 2 }}
                        placeholder={`Phone: ${data.contact.tel}`}
                        keyboardType="phone-pad"
                        autoCorrect={false}
                        onChangeText={handleChange("tel")}
                        returnKeyType="done"
                      ></TextInput>
                      <TextInput
                        style={styles.input}
                        placeholder={`Email: ${data.contact.email}`}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        onChangeText={handleChange("email")}
                        returnKeyType="done"
                      ></TextInput>
                    </View>
                    <DropdownMultiSelect
                      isExpanded={rolesMultiSelectExpanded}
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
                      }}
                    />
                  </>
                ) : null}
                <View style={styles.icons}>
                  {data._id !== ADMIN_ID ? (
                    <TouchableWithoutFeedback
                      onPress={() => {
                        deleteStaffMember(
                          data._id,
                          showMsgModal,
                          setDeleteIsLoading,
                          dispatch
                        );
                      }}
                    >
                      <View style={styles.trashContainer}>
                        {deleteIsLoading ? (
                          <ActivityIndicator size="small" color="black" />
                        ) : (
                          <FontAwesome
                            name="trash-o"
                            size={24}
                            color="indianred"
                          />
                        )}
                      </View>
                    </TouchableWithoutFeedback>
                  ) : null}
                  <TouchableWithoutFeedback
                    onPress={() => {
                      setNewExpandedState(data._id, false);
                    }}
                  >
                    <View style={styles.cancelContainer}>
                      <Text style={styles.cancelText}>CANCEL</Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback onPress={handleSubmit}>
                    <View style={styles.checkContainer}>
                      {updateIsLoading ? (
                        <ActivityIndicator size="small" color="black" />
                      ) : (
                        <FontAwesome name="check" size={24} color="darkgreen" />
                      )}
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            )}
          </Formik>
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default EditStaffListItem;
