//--------------- IMPORT MODULES ----------------------------

import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useContext, useState } from "react";
import { useSelector } from "react-redux";

import { Formik } from "formik";
import moment from "moment-timezone";
import {
  Dimensions,
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
import { DatePicker, Picker } from "react-native-woodpicker";
import AppContext from "../../../components/AppContext";

//--------------------------------------------------------------

const { width } = Dimensions.get("window");
const android = Platform.OS === "android" ? true : false;

const AddPickupsModal = ({ pickupData, setPickupData, setPickups }) => {
  const appContext = useContext(AppContext);
  const showMsgModal = appContext.functions.showMsgModal;
  const [mpPickedFromPicker, setMpPickedFromPicker] = useState(false);
  const [mpPickedFromInput, setMpPickedFromInput] = useState(false);
  const store = useSelector((store) => store);
  const frequentMeetingPoints = store.data.entities.frequentMeetingPoints.map(
    (point) => {
      return {
        label: point,
        value: point,
      };
    }
  );
  const hasData = pickupData.hasOwnProperty("data");

  return (
    <Modal animationType="slide" visible={pickupData.isVisible} transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        enabled={true}
        style={styles.viewWrapper}
      >
        <View style={styles.modalView}>
          <View style={styles.topWrapper}>
            <AntDesign name="close" size={27} style={styles.ghostIcon} />
            <Text style={styles.labelText}>
              Pickup #{pickupData.pickupIndex}
            </Text>
            <AntDesign
              name="close"
              size={27}
              color="white"
              onPress={() => {
                setMpPickedFromInput(false);
                setMpPickedFromPicker(false);
                setPickupData({ isVisible: false });
              }}
            />
          </View>
          <Formik
            //enableReinitialize
            initialValues={{
              meetingPoint: hasData
                ? {
                    label: pickupData.data.meeting_point,
                    value: pickupData.data.meeting_point,
                  }
                : { label: "Choose from list", value: null },
              time: hasData ? pickupData.data.time : null,
              guests: hasData ? pickupData.data.guests : [],
              details: hasData ? pickupData.data.details : "",
            }}
            onSubmit={(values) => {
              if (
                !values.meetingPoint.value ||
                !/\S/.test(values.meetingPoint.value) //if it contains only whitespace
              ) {
                Keyboard.dismiss();
                showMsgModal(`Meeting point cannot be empty !`, false);
              } else {
                setMpPickedFromInput(false);
                setMpPickedFromPicker(false);
                setPickups({
                  meeting_point: values.meetingPoint.value,
                  time: values.time,
                  guests: values.guests,
                  details: values.details,
                });
                setPickupData({ isVisible: false });
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
                <View
                  style={{
                    height: 45,
                    flexDirection: "row",
                  }}
                >
                  {mpPickedFromPicker ? null : (
                    <View
                      style={{
                        flex: 3,
                        marginRight: mpPickedFromInput ? 0 : 4,
                        justifyContent: "center",
                      }}
                    >
                      <TextInput
                        autoCorrect={false}
                        value={
                          values.meetingPoint.label === "Choose from list"
                            ? ""
                            : values.meetingPoint.label
                        }
                        style={styles.textInput}
                        keyboardType="default"
                        //maxLength={6}
                        onChangeText={(newValue) => {
                          if (newValue.length > 0) {
                            setMpPickedFromInput(true);
                            setFieldValue("meetingPoint", {
                              label: newValue,
                              value: newValue,
                            });
                          } else {
                            setMpPickedFromInput(false);
                            setFieldValue("meetingPoint", {
                              label: "Choose from list",
                              value: null,
                            });
                          }
                        }}
                        placeholder="Meeting point"
                        // autoFocus
                      />
                      {mpPickedFromInput ? (
                        <Pressable
                          style={{
                            position: "absolute",
                            left: "90%",
                            padding: 4,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          onPress={() => {
                            setMpPickedFromInput(false);
                            setFieldValue("meetingPoint", {
                              label: "Choose from list",
                              value: null,
                            });
                          }}
                        >
                          <AntDesign name="close" size={21} color="#bfbfbf" />
                        </Pressable>
                      ) : null}
                    </View>
                  )}
                  {mpPickedFromInput ? null : (
                    <View
                      style={{
                        flex: 2,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Picker
                        items={[
                          { label: "Choose from list", value: null },
                          ...frequentMeetingPoints,
                        ]}
                        item={values.meetingPoint}
                        onItemChange={(data) => {
                          if (data.label !== "Choose from list") {
                            setMpPickedFromPicker(true);
                            setFieldValue("meetingPoint", {
                              label: data.label,
                              value: data.value,
                            });
                          } else {
                            setMpPickedFromPicker(false);
                            setFieldValue("meetingPoint", {
                              label: "Choose from list",
                              value: null,
                            });
                          }
                        }}
                        //placeholder={"Choose from list"}
                        style={{
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        containerStyle={{
                          flex: 1,
                          backgroundColor: "rgb(235, 235, 235)",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        textInputStyle={{
                          textAlign: "center",
                          fontSize: 16,
                        }}
                      />
                      {mpPickedFromPicker ? (
                        <Pressable
                          style={{
                            position: "absolute",
                            left: "90%",
                            padding: 4,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          onPress={() => {
                            setMpPickedFromPicker(false);
                            setFieldValue("meetingPoint", {
                              label: "Choose from list",
                              value: null,
                            });
                          }}
                        >
                          <AntDesign name="close" size={21} color="#bfbfbf" />
                        </Pressable>
                      ) : null}
                    </View>
                  )}
                </View>
                <View
                  style={{
                    height: 45,
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 4,
                  }}
                >
                  <View
                    style={{
                      flex: 3,
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 4,
                    }}
                  >
                    <DatePicker
                      iosMode="time"
                      androidMode="time"
                      is24Hour={true}
                      value={new Date()}
                      onDateChange={(date) => {
                        setFieldValue("time", date);
                      }}
                      text={
                        values.time
                          ? `${moment(values.time)
                              .tz("Europe/Athens")
                              .format("HH:mm")}`
                          : "Pick a time.."
                      }
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      containerStyle={{
                        flex: 1,
                        backgroundColor: "rgb(235, 235, 235)",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      textInputStyle={{
                        textAlign: "center",
                        fontSize: 16,
                      }}
                    />
                    {values.time ? (
                      <Pressable
                        style={{
                          position: "absolute",
                          left: "85%",
                          padding: 4,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        onPress={() => {
                          setFieldValue("time", null);
                        }}
                      >
                        <AntDesign name="close" size={21} color="#bfbfbf" />
                      </Pressable>
                    ) : null}
                  </View>
                  <Pressable
                    style={{
                      flex: 2,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "rgb(235, 235, 235)",
                      flexDirection: "row",
                      height: "100%",
                    }}
                    onPress={() => {
                      setFieldValue("guests", [
                        ...values.guests,
                        { name: "", count: null },
                      ]);
                    }}
                  >
                    <MaterialIcons name="group-add" size={28} color="black" />
                  </Pressable>
                </View>

                {values.guests.map((guest, index) => (
                  <View
                    style={{
                      height: 45,
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 4,
                    }}
                    key={index}
                  >
                    <View
                      style={{
                        flex: 3,
                        justifyContent: "center",
                        marginRight: 4,
                      }}
                    >
                      <TextInput
                        autoCorrect={false}
                        value={values.guests[index].name}
                        style={{
                          ...styles.textInput,
                          fontSize: 15,
                          backgroundColor: "rgb(235, 235, 245)",
                        }}
                        keyboardType="default"
                        //maxLength={6}
                        onChangeText={(newValue) => {
                          setFieldValue(`guests[${index}].name`, newValue);
                        }}
                        placeholder="Guest name"
                        autoFocus
                      />
                      {values.guests[index].name.length > 0 ? (
                        <Pressable
                          style={{
                            position: "absolute",
                            left: "85%",
                            padding: 4,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          onPress={() => {
                            setFieldValue(`guests[${index}].name`, "");
                          }}
                        >
                          <AntDesign name="close" size={21} color="#bfbfbf" />
                        </Pressable>
                      ) : null}
                    </View>
                    <View
                      style={{
                        flex: 2,
                        alignItems: "center",
                        flexDirection: "row",
                      }}
                    >
                      <Picker
                        items={[
                          { label: "0", value: 0 },
                          { label: "1", value: 1 },
                          { label: "2", value: 2 },
                          { label: "3", value: 3 },
                          { label: "4", value: 4 },
                          { label: "5", value: 5 },
                          { label: "6", value: 6 },
                          { label: "7", value: 7 },
                          { label: "8", value: 8 },
                          { label: "9", value: 9 },
                          { label: "10", value: 10 },
                          { label: "11", value: 11 },
                          { label: "12", value: 12 },
                          { label: "13", value: 13 },
                          { label: "14", value: 14 },
                          { label: "15", value: 15 },
                        ]}
                        item={{
                          label: values.guests[index].count
                            ? values.guests[index].count.toString()
                            : "0",
                          value: values.guests[index].count
                            ? values.guests[index].count
                            : 0,
                        }}
                        onItemChange={(data) => {
                          setFieldValue(`guests[${index}].count`, data.value);
                        }}
                        placeholder={0}
                        style={{
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        containerStyle={{
                          flex: 1,
                          backgroundColor: "rgb(235, 235, 245)",
                          justifyContent: "center",
                          alignItems: "center",
                          marginRight: 4,
                        }}
                        textInputStyle={{
                          textAlign: "center",
                          fontSize: 16,
                        }}
                        //mode="dropdown"
                      />
                      <Pressable
                        style={{
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "rgb(235, 235, 245)",
                        }}
                        onPress={() => {
                          let newGuests = [...values.guests];
                          newGuests.splice(index, 1);
                          setFieldValue("guests", newGuests);
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <FontAwesome
                            name="trash-o"
                            size={21}
                            color="indianred"
                          />
                        </View>
                      </Pressable>
                    </View>
                  </View>
                ))}
                <View
                  style={{
                    height: 45,
                    flexDirection: "row",
                    marginTop: 4,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextInput
                    autoCorrect={false}
                    value={values.details}
                    style={{ ...styles.textInput, flex: 7 }}
                    keyboardType="default"
                    //maxLength={6}
                    onChangeText={handleChange("details")}
                    placeholder="Pickup details"
                    // autoFocus
                  />
                  {values.details ? (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                      }}
                    >
                      <Pressable
                        style={{
                          flex: 1,
                          padding: 4,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "rgb(235, 235, 235)",
                          alignItems: "center",
                        }}
                        onPress={() => {
                          setFieldValue("details", null);
                        }}
                      >
                        <AntDesign name="close" size={21} color="#bfbfbf" />
                      </Pressable>
                    </View>
                  ) : null}
                </View>
                <View style={styles.bottomWrapper}>
                  <Pressable
                    android_ripple={{ color: "indianred", borderless: false }}
                    style={styles.clearBtn}
                    onPress={() => {
                      setMpPickedFromInput(false);
                      setMpPickedFromPicker(false);
                      resetForm();
                    }}
                  >
                    <Text style={styles.clearText}>CLEAR</Text>
                  </Pressable>
                  <Pressable
                    android_ripple={{
                      color: "lightgreen",
                      borderless: false,
                    }}
                    style={styles.submitBtn}
                    onPress={handleSubmit}
                  >
                    <FontAwesome name="check" size={24} color="darkgreen" />
                  </Pressable>
                </View>
              </>
            )}
          </Formik>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddPickupsModal;

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
    width: width * 0.95,
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
    marginBottom: 4,
  },
  textInput: {
    flex: 1,
    textAlign: "center",
    backgroundColor: "rgb(235, 235, 235)",
    padding: 10,
    borderColor: "rgba(0, 0, 0, 0.2)",
    fontSize: 18,
    height: "100%",
    color: "grey",
  },
  text: {
    fontFamily: android ? "Roboto" : "Avenir",
    fontSize: 15,
    fontWeight: "600",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
    height: 50,
  },
  clearBtn: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#d9d9d9",
    borderColor: "whitesmoke",
    borderBottomLeftRadius: 4,
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
    borderBottomRightRadius: 4,
    height: "100%",
  },
  ghostIcon: {
    opacity: 0,
  },
});

//---------------------------------------------------------------------------------
