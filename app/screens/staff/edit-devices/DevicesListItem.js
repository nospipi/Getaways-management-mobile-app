//--------------- IMPORT MODULES ----------------------------

import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { Formik } from "formik";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { deleteDevice, updateDeviceName } from "../../../../src/api/api";
import AppContext from "../../../components/AppContext";

//--------------- IMPORT COMPONENTS ----------------------------

//--------------------------------------------------------------

const android = Platform.OS === "android" ? true : false;

const DevicesListItem = ({ data }) => {
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const appContext = useContext(AppContext);
  const showMsgModal = appContext.functions.showMsgModal;
  const dispatch = useDispatch();

  const user_id = useSelector(
    (store) =>
      store.data.entities.staff.find(
        (staffMember) =>
          staffMember._id === useSelector((store) => store.data.currentUser._id)
      )._id
  );
  //console.log(data.token);
  //console.log([...user.loggedDevices].slice(0, 1));

  useEffect(() => {
    return () => {
      setIsDeleteLoading(false);
      setIsEditLoading(false);
    };
  }, []);
  // cleanup operation,because when a user is deleted the component is unmounted before deleteIsLoading is set back to false
  // The return function from the useEffect() hook is called when the component is unmounted
  // https://jasonwatmore.com/post/2021/08/27/react-how-to-check-if-a-component-is-mounted-or-unmounted
  // https://dev.to/robmarshall/how-to-use-componentwillunmount-with-functional-components-in-react-2a5g

  return (
    <View style={styles.container}>
      <Formik
        enableReinitialize
        initialValues={{
          deviceName: data.device,
        }}
        onSubmit={({ deviceName }) => {
          //console.log(values);
          setIsEditLoading(true);
          updateDeviceName(
            user_id,
            data.token,
            deviceName,
            dispatch,
            showMsgModal
          ).then(() => {
            setIsEditing(false);
            setIsEditLoading(false);
          });
        }}
      >
        {({
          handleChange,
          handleSubmit,
          setFieldValue,
          resetForm,
          errors,
          values,
        }) => (
          <>
            <TouchableOpacity
              style={styles.trashContainer}
              onPress={() => {
                setIsDeleteLoading(true);
                deleteDevice(user_id, data.token, dispatch, showMsgModal).then(
                  () => {
                    setIsDeleteLoading(false);
                  }
                );
              }}
            >
              {isDeleteLoading ? (
                <ActivityIndicator size="small" color="black" />
              ) : (
                <FontAwesome name="trash-o" size={24} color="indianred" />
              )}
            </TouchableOpacity>

            <View style={styles.textContainer}>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  //value={values.deviceName}
                  //maxLength={30}
                  autoFocus
                  placeholder={data.device}
                  keyboardType="default"
                  onChangeText={handleChange("deviceName")}
                ></TextInput>
              ) : (
                <Text style={styles.text}>{data.device}</Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.editContainer}
              onPress={() => {
                if (isEditing) {
                  if (
                    data.device === values.deviceName ||
                    values.deviceName.length === 0
                  ) {
                    setIsEditing(false);
                  } else {
                    handleSubmit();
                  }
                } else {
                  setIsEditing(true);
                }
              }}
            >
              {isEditing ? (
                isEditLoading ? (
                  <ActivityIndicator size="small" color="black" />
                ) : (
                  <Text>Change</Text>
                )
              ) : (
                <AntDesign name="edit" size={22} color="black" />
              )}
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    //backgroundColor: "lightgrey",
    //padding: 4,
    //paddingHorizontal: 10,
    height: 60,
    //borderRadius: 6,
    marginBottom: 2,
    //borderBottomWidth: expanded ? 1 : null,
    //borderBottomColor: "black",
  },
  trashContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "lightgrey",
    height: "100%",
    marginRight: 1,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "lightgrey",
    height: "100%",
    paddingHorizontal: 10,
    flex: 4,
    marginRight: 1,
  },
  text: {
    fontFamily: android ? "Roboto" : "Avenir",
    fontSize: 15,
  },
  editContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 2,
    backgroundColor: "lightgrey",
    height: "100%",
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
  },
  input: {
    flex: 1,
    textAlign: "center",
    //borderRadius: 5,
    //borderColor: "#333333",
    //backgroundColor: "white",
    //borderTopWidth: 0.5,
    //borderBottomWidth:0.5,
    //padding: 10,
    //borderColor: "rgba(0, 0, 0, 0.2)",
    //borderWidth: 0.6,
    //fontSize: 15,
  },
});

export default DevicesListItem;
