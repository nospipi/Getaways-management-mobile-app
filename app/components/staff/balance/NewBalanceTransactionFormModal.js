//--------------- IMPORT MODULES ----------------------------

import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { useContext, useState } from "react";

import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { Formik } from "formik";
import _ from "lodash";
import moment from "moment-timezone";
import {
  ActivityIndicator,
  Button,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as Progress from "react-native-progress";
import { DatePicker, Picker } from "react-native-woodpicker";
import { useSelector } from "react-redux";
import * as constants from "../../../../constants";
import { addBalanceTransaction } from "../../../../src/api/api";
import AppContext from "../../AppContext";
import CustomCheckMark from "../../CustomCheckMark";
//new Date(date).toLocaleString("en-US", { month: "short" }) NOT WORKING IN ANDROID

//--------------------------------------------------------------

const { width } = Dimensions.get("window");
const android = Platform.OS === "android" ? true : false;

const NewBalanceTransactionFormModal = ({ loadTransactions }) => {
  //----------- COMPONENT STATES --------------------
  const [isSavingNoReceipt, setIsSavingNoReceipt] = useState(false);
  const [isSavingWithReceipt, setIsSavingWithReceipt] = useState(false);
  const [loadingProgressText, setLoadingProgressText] = useState("Preparing..");
  const [uploadingImageProgress, setUploadingImageProgress] = useState(0);
  const [uploadingImageSucceded, setUploadingImageSucceded] = useState(false);
  //------------------------------------------------
  const appContext = useContext(AppContext);
  const currentUser = useSelector((store) => store.data.currentUser);
  const store = useSelector((store) => store);
  const staff = store.data.entities.staff
    .filter((staffMember) => staffMember._id !== constants.ADMIN_ID)
    .map((staffMember) => {
      return { label: staffMember.name, value: staffMember._id };
    });

  let pickImage = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync(); //TODO do both media library and camera

    if (permissionResult.granted === false) {
      alert("Permission to access device camera is required!");
      return;
    }
    //launchCameraAsync
    //launchImageLibraryAsync //opens media library
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      presentationStyle: 0, //not setting this crashes in ios-12 --> https://github.com/expo/expo/issues/14903
      allowsEditing: true,
      //aspect: [4, 3],
      quality: 0.1,
      base64: true,
    });

    if (!result.cancelled) {
      const compressedPhoto = await ImageManipulator.manipulateAsync(
        //compress photo to reduce storage size
        result.uri,
        [
          /*{ resize: { width: 300 } }*/
        ], //array of actions ---> https://docs.expo.dev/versions/latest/sdk/imagemanipulator/
        {
          compress: 0.0,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        } //object of export options
      );
      // const fileSize = compressedPhoto.base64.length * (3 / 4) - 2;
      // console.log(fileSize);

      //return compressedPhoto.base64;
      return {
        rawImage: result.base64,
        compressedImage: compressedPhoto,
      };
    }
  };

  //----------- COMPONENT FUNCTIONS -------------------------

  //----------- COMPONENT RETURN ----------------------------

  return (
    <Modal
      animationType="slide"
      visible={appContext.states.isNewBalanceTransactionModalVisible}
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
              name:
                currentUser._id === constants.ADMIN_ID
                  ? null
                  : currentUser.name,
              id:
                currentUser._id === constants.ADMIN_ID ? null : currentUser._id,
              date: null,
              description: null,
              amount: null,
              type: null,
              receiptToShow: null,
              receiptToUpload: null,
            }}
            onSubmit={(values) => {
              Keyboard.dismiss();
              const validationsArr = [null, ""];
              if (
                validationsArr.some((validationItem) =>
                  Object.values(
                    _.omit(values, ["receiptToShow", "receiptToUpload"])
                  ).includes(validationItem)
                )
              ) {
                //_omit excludes the properties in given array,object.values creates an array of all the values in remaining object,and lastly i check if there is a null or "" in there (form)
                appContext.functions.showMsgModal("No empty fields !");
              } else {
                if (values.receiptToUpload) {
                  setIsSavingWithReceipt(true);
                } else {
                  setIsSavingNoReceipt(true);
                }
                const transactionPayload = _.omit(values, ["receiptToShow"]);
                addBalanceTransaction(
                  transactionPayload,
                  appContext.functions.showMsgModal,
                  setUploadingImageProgress,
                  setUploadingImageSucceded,
                  setLoadingProgressText
                ).then(() => {
                  if (!values.receiptToUpload) {
                    setIsSavingNoReceipt(false);
                  }
                  setTimeout(() => {
                    appContext.functions.toggleNewBalanceTransactionModalVisibility();
                    setUploadingImageProgress(0);
                    setUploadingImageSucceded(false);
                    loadTransactions();
                    setIsSavingWithReceipt(false);
                  }, 1500);
                });
                //console.log(values);
              }
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
                <View style={styles.topWrapper}>
                  <AntDesign name="close" size={27} style={styles.ghostIcon} />
                  <Text style={styles.labelText}>New balance transaction</Text>
                  <AntDesign
                    name="close"
                    size={27}
                    color="black"
                    onPress={() =>
                      appContext.functions.toggleNewBalanceTransactionModalVisibility()
                    }
                  />
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderColor: "lightgrey",
                    ...styles.formRow,
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <TextInput
                      style={styles.input}
                      value={values.description}
                      maxLength={30}
                      autoFocus
                      placeholder="Description"
                      returnKeyType="done"
                      keyboardType="default"
                      onChangeText={handleChange("description")}
                    ></TextInput>
                  </View>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderColor: "lightgrey",
                    ...styles.formRow,
                  }}
                >
                  {currentUser._id === constants.ADMIN_ID ? (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",

                        //backgroundColor: "red",
                        borderRightWidth: 1,
                        borderColor: "lightgrey",
                      }}
                    >
                      <Picker
                        item={
                          values.name
                            ? values.name
                            : { label: "Select staff..", value: null }
                        }
                        items={[
                          { label: "Select staff..", value: null },
                          ...staff,
                        ]}
                        onItemChange={(data) => {
                          setFieldValue("name", data.label);
                          setFieldValue("id", data.value);
                        }}
                        //onDonePress={(data) => setSelectedMember(1)}
                        //placeholder={"Select a member.."}
                        //isNullable
                        //backdropAnimation={{ opacity: 0 }}
                        //mode="dropdown"
                        //disable
                        touchableStyle={{
                          //backgroundColor: "indianred",
                          height: 20,
                        }}
                        textInputStyle={{
                          color:
                            values.name === "Select staff.." ||
                            values.name === null
                              ? "#bfbfbf"
                              : "black",
                          //backgroundColor: "grey",
                          // justifyContent: "center",
                          // alignItems: "center",
                          // alignSelf: "center",
                          // alignContent: "center",
                          // textAlignVertical: "bottom",
                          fontSize: 15,
                          fontFamily: android ? "Roboto" : "Avenir",
                          //height: "100%",
                        }}
                      />
                    </View>
                  ) : null}
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <DatePicker
                      value={new Date()}
                      onDateChange={(date) => {
                        setFieldValue("date", date);
                      }}
                      text={
                        values.date
                          ? `${moment(values.date).format("DD")} ${moment(
                              values.date
                            ).format("MMM")} ${moment(values.date).format(
                              "YY"
                            )}`
                          : "Pick a date.."
                      }
                      touchableStyle={{
                        // justifyContent: "center",
                        // alignItems: "center",
                        // backgroundColor: "indianred",
                        height: 20,
                      }}
                      textInputStyle={{
                        color: values.date ? "black" : "#bfbfbf",
                        // backgroundColor: "grey",
                        // justifyContent: "center",
                        // alignItems: "center",
                        // alignSelf: "center",
                        // alignContent: "center",
                        // textAlignVertical: "bottom",
                        fontSize: 15,
                        fontFamily: android ? "Roboto" : "Avenir",
                        //height: "100%",
                      }}
                      isNullable={false}

                      //iosDisplay="inline"
                      //backdropAnimation={{ opacity: 0 }}
                      //minimumDate={new Date(Date.now())}
                      //maximumDate={new Date(Date.now()+2000000000)}
                      //iosMode="date"
                      //androidMode="countdown"
                      //iosDisplay="spinner"
                      //androidDisplay="calendar"
                      //androidDisplay="spinner"
                      //locale="fr"
                    />
                  </View>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderColor: "lightgrey",
                    ...styles.formRow,
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",

                      borderRightWidth: 1,
                      borderColor: "lightgrey",
                    }}
                  >
                    <Picker
                      item={
                        values.type
                          ? values.type
                          : { label: "Select a type..", value: null }
                      }
                      items={[
                        { label: "Select a type..", value: null },
                        { label: "Income", value: "income" },
                        { label: "Expense", value: "expense" },
                      ]}
                      onItemChange={(data) => setFieldValue("type", data.value)}
                      //onDonePress={(data) => setSelectedMember(1)}
                      //placeholder={"Select a member.."}
                      //isNullable
                      //backdropAnimation={{ opacity: 0 }}
                      //mode="dropdown"
                      //disable
                      touchableStyle={{
                        // justifyContent: "center",
                        // alignItems: "center",
                        // backgroundColor: "indianred",
                        height: 20,
                      }}
                      textInputStyle={{
                        color:
                          values.type === "Select a type.." ||
                          values.type === null
                            ? "#bfbfbf"
                            : "black",
                        // backgroundColor: "grey",
                        // justifyContent: "center",
                        // alignItems: "center",
                        // alignSelf: "center",
                        // alignContent: "center",
                        // textAlignVertical: "bottom",
                        fontSize: 15,
                        fontFamily: android ? "Roboto" : "Avenir",
                        //height: "100%",
                      }}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <TextInput
                      style={styles.input}
                      value={values.amount}
                      returnKeyType="done"
                      placeholder={`Amount €`}
                      keyboardType="numeric"
                      maxLength={6}
                      onChangeText={handleChange("amount")}
                    ></TextInput>
                  </View>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderColor: "lightgrey",
                    ...styles.formRow,
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      title="Take a photo of transaction receipt"
                      onPress={() => {
                        pickImage().then((imagePicked) => {
                          if (imagePicked) {
                            setFieldValue(
                              "receiptToShow",
                              imagePicked.rawImage
                            );
                            setFieldValue(
                              "receiptToUpload",
                              imagePicked.compressedImage.uri
                            );
                          }
                        });
                      }}
                    />
                  </View>
                </View>
                {values.receiptToShow && (
                  <View
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      height: 200,
                      backgroundColor: "white",
                    }}
                  >
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {isSavingWithReceipt ? (
                        <View
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            paddingVertical: 10,
                          }}
                        >
                          {uploadingImageSucceded ? (
                            <CustomCheckMark
                              visible={true}
                              width={80}
                              height={80}
                              speed={1.5}
                            />
                          ) : (
                            <Progress.Circle
                              size={100}
                              progress={uploadingImageProgress}
                              thickness={2}
                              showsText
                              color={"dodgerblue"}
                            />
                          )}
                        </View>
                      ) : (
                        <Image
                          source={{
                            uri: `data:image/jpg;base64,${values.receiptToShow}`,
                          }}
                          style={{
                            width: "100%",
                            height: "100%",

                            //borderRadius: 2,
                          }}
                          resizeMode="stretch"
                        />
                      )}
                    </View>
                  </View>
                )}
                <View style={styles.bottomWrapper}>
                  <Pressable
                    android_ripple={{ color: "indianred", borderless: false }}
                    style={styles.clearBtn}
                    onPress={() => {
                      resetForm();
                    }}
                  >
                    <Text style={styles.clearText}>CLEAR</Text>
                  </Pressable>
                  <Pressable
                    android_ripple={{ color: "lightgreen", borderless: false }}
                    style={styles.submitBtn}
                    onPress={handleSubmit}
                  >
                    {isSavingNoReceipt ? (
                      <ActivityIndicator size="small" color="black" />
                    ) : isSavingWithReceipt ? (
                      <Text style={{ ...styles.labelText, fontSize: 13 }}>
                        {loadingProgressText}
                      </Text>
                    ) : (
                      <FontAwesome name="check" size={24} color="darkgreen" />
                    )}
                  </Pressable>
                </View>
              </>
            )}
          </Formik>
        </View>
      </KeyboardAvoidingView>

      {/* <View style={styles.ghost}></View> */}
    </Modal>
  );
};

export default NewBalanceTransactionFormModal;

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

    alignSelf: "center",
    //backgroundColor: "rgb(242,242,242)",
    //height: 170,
    width: width * 0.8,
    borderRadius: 4,
    //padding: 5,
    borderWidth: 2,
    borderColor: "dodgerblue",
  },
  topWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#bfbfbf",
    width: "100%",
    height: 50,
    padding: 10,
    borderTopStartRadius: 4,
    borderTopEndRadius: 4,
  },
  formRow: {
    flexDirection: "row",
    backgroundColor: "white",

    //justifyContent: "center",
    //alignItems: "center",
    //width: "100%",
    //padding: 10,
    height: 55,
  },
  ghostIcon: {
    opacity: 0,
  },
  input: {
    flex: 1,
    textAlign: "center",
    //borderRadius: 5,
    borderColor: "#333333",
    //backgroundColor: "white",
    //borderTopWidth: 0.5,
    //borderBottomWidth:0.5,
    //padding: 10,
    //borderColor: "rgba(0, 0, 0, 0.2)",
    //borderWidth: 0.6,
    //fontSize: 15,
  },
  labelText: {
    color: "#262626",
    fontSize: 18,
    fontWeight: "600",
    alignSelf: "center",
    fontFamily: android ? "Roboto" : "Avenir",
    //backgroundColor: "#bfbfbf",
    //width: "100%",
    //textAlign: "center",
    //padding: 5,
    //borderTopStartRadius: 4,
    //borderTopEndRadius: 4,
  },
  bottomWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    //width: "100%",
    //height: 40,
    //padding: 10,
  },
  clearBtn: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#d9d9d9",
    //borderRadius: 4,
    //borderRightWidth: 1,
    borderColor: "whitesmoke",
    borderBottomLeftRadius: 4,
    //borderBottomRightRadius: 4,
    height: "100%",
  },
  clearText: {
    color: "indianred",
    fontSize: 17,
    fontWeight: "600",
    alignSelf: "center",
    fontFamily: android ? "Roboto" : "Avenir",
  },
  submitBtn: {
    justifyContent: "center",
    alignItems: "center",
    flex: 2,
    backgroundColor: "#bfbfbf",
    //borderRadius: 4,
    //borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    height: "100%",
    //backgroundColor: "rgb(220, 220, 220)",
    //width: "25%",
    //padding: 4,
  },
});

//---------------------------------------------------------------------------------

//TIMER ISSUE --> https://stackoverflow.com/a/65546948/14718856
//https://stackoverflow.com/a/64832663/14718856
//AROUND 4+ MEGABYTES BREAKS APP
