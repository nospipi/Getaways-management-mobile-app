//--------------- IMPORT MODULES ----------------------------

import { FontAwesome } from "@expo/vector-icons";
import { Formik } from "formik";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { deleteVehicle, editVehicle } from "../../../../src/api/api";
import AppContext from "../../../components/AppContext";

//--------------------------------------------------------------

const android = Platform.OS === "android" ? true : false;

const EditVehicleListItem = ({ data, expanded, setNewExpandedState }) => {
  const [updateIsLoading, setUpdateIsLoading] = useState(false);
  const [deleteIsLoading, setDeleteIsLoading] = useState(false);
  const appContext = useContext(AppContext);
  const showMsgModal = appContext.functions.showMsgModal;
  const dispatch = useDispatch();
  const styles = StyleSheet.create({
    container: {
      alignItems: "center",
      backgroundColor: !expanded ? "lightgrey" : null,
      paddingHorizontal: !expanded ? 5 : null,
      height: !expanded ? 60 : null,
      borderRadius: !expanded ? 6 : null,
      marginBottom: 2,
      borderBottomColor: "black",
    },
    topContainer: {
      flexDirection: "row",
      flex: 1,
      justifyContent: "center",
      padding: expanded ? 10 : null,
      alignItems: "center",
      height: expanded ? 60 : null,
      borderColor: "#333333",
      marginBottom: expanded ? 2 : null,
      backgroundColor: expanded ? "white" : null,
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
      width: "100%",
    },
    text: {
      fontSize: 18,
      fontWeight: "600",
      alignSelf: "center",
      fontFamily: android ? "Roboto" : "Avenir",
      color: "#1a1a00",
    },
    form: {
      borderColor: "grey",
      borderRadius: 5,
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
  });

  useEffect(() => {
    return () => {
      setDeleteIsLoading(false);
    };
  }, []);
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
          <Text style={styles.text}>{data.plate}</Text>
        </View>

        {expanded ? (
          <Formik
            initialValues={{ plate: "" }}
            onSubmit={(values) => {
              if (values.plate.length > 0) {
                setUpdateIsLoading(true);
                editVehicle(
                  data._id,
                  values.plate,
                  showMsgModal,
                  setNewExpandedState,
                  setUpdateIsLoading,
                  dispatch
                );
              } else {
                showMsgModal(`No empty inputs !`, false);
              }
            }}
          >
            {({ handleChange, handleSubmit, values }) => (
              <View style={styles.form}>
                <View style={styles.inputs}>
                  <TextInput
                    style={styles.input}
                    placeholder="Change plate number"
                    keyboardType="default"
                    maxLength={8}
                    onChangeText={handleChange("plate")}
                  ></TextInput>
                </View>
                <View style={styles.icons}>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      setDeleteIsLoading(true);
                      deleteVehicle(
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

export default EditVehicleListItem;
