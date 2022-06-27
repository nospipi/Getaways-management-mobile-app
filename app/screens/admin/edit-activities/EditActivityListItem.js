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
import { deleteActivity, editActivity } from "../../../../src/api/api";
import AppContext from "../../../components/AppContext";

//--------------- IMPORT COMPONENTS ----------------------------

//--------------------------------------------------------------

const android = Platform.OS === "android" ? true : false;

const EditActivityListItem = ({ data, expanded, setNewExpandedState }) => {
  const [updateIsLoading, setUpdateIsLoading] = useState(false);
  const [deleteIsLoading, setDeleteIsLoading] = useState(false);
  const appContext = useContext(AppContext);
  const showMsgModal = appContext.functions.showMsgModal;
  const dispatch = useDispatch();
  const styles = StyleSheet.create({
    container: {
      alignItems: "center",
      backgroundColor: !expanded ? "lightgrey" : null,
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
      //marginBottom: 5,
    },
    form: {
      //borderWidth: 2,
      borderColor: "grey",
      borderRadius: 5,
      //padding: 5,
      width: "100%",
    },
    labelContainer: {
      backgroundColor: "white",
      height: 40,
      textAlign: "center",
      justifyContent: "center",
      alignItems: "center",
      paddingLeft: 10,
      marginBottom: 2,
    },
    labelText: {
      fontSize: 16,
      fontWeight: "600",
      alignSelf: "flex-start",
      fontFamily: android ? "Roboto" : "Avenir",
      color: "#1a1a00",
      //textDecorationLine: "underline",
    },
    itemContainer: {
      flexDirection: "row",
      height: 40,
      textAlign: "center",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 2,
    },
    itemTextContainer: {
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
    itemText: {
      fontSize: 16,
      fontWeight: "600",
      alignSelf: "flex-start",
      fontFamily: android ? "Roboto" : "Avenir",
      color: "#1a1a00",
    },
    inputs: {
      flexDirection: "row",
      marginBottom: 2,
      height: expanded ? 60 : null,
    },
    input: {
      flex: 1,
      textAlign: "center",
      //borderRadius: 5,
      borderColor: "#333333",
      backgroundColor: "white",
      padding: 10,
      //borderColor: "rgba(0, 0, 0, 0.2)",
      //borderWidth: 1,
      //fontSize: 15,
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
      //borderWidth: 1,
      borderColor: "#333333",
      borderBottomLeftRadius: 6,
      height: "100%",
      flex: 1,
      marginRight: 2,
    },

    cancelContainer: {
      //borderWidth: 1,
      //borderRadius: 2,
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
      //borderWidth: 1,
      //borderRadius: 2,
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
          <Text style={styles.text}>{data.type}</Text>
        </View>

        {expanded ? (
          <Formik
            initialValues={{ type: "" }}
            onSubmit={(values) => {
              if (values.type.length > 0) {
                setUpdateIsLoading(true);
                editActivity(
                  data._id,
                  values.type,
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
                    placeholder="Change activity title"
                    keyboardType="default"
                    maxLength={8}
                    onChangeText={handleChange("type")}
                  ></TextInput>
                </View>
                <View style={styles.icons}>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      setDeleteIsLoading(true);
                      deleteActivity(
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

export default EditActivityListItem;
