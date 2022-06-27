//--------------- IMPORT MODULES ----------------------------

import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import _ from "lodash";
import moment from "moment-timezone";
import { useContext, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { DatePicker, Picker } from "react-native-woodpicker";
import { useDispatch, useSelector } from "react-redux";
import { addTask, editTask } from "../../../../src/api/api";
import CustomBottomMsgModal from "../../../components/CustomBottomMsgModal";

//---------------- IMPORT COMPONENTS --------------------------

import * as constants from "../../../../constants";
import AppContext from "../../../components/AppContext";
import AddPickupsModal from "./AddPickupsModal";
import PickupItem from "./PickupItem";
import SelectCrewModal from "./SelectCrewModal";

//---------------- IMPORT FUNCTIONS --------------------------

//------------------------------------------------------------

const android = Platform.OS === "android" ? true : false;

const NewScheduleTaskScreen = ({ route }) => {
  const currentUser = useSelector((store) => store.data.currentUser);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [isTaskDetailsShown, setIsTaskDetailsShown] = useState(
    route.params.data.details ? true : false
  );
  const [isCrewModalVisible, setIsCrewModalVisible] = useState(false);
  //const [isPickupsModalVisible, setPickupsModalVisible] = useState(false);
  const [pickupsModalData, setPickupsModalData] = useState({
    isVisible: false,
  });
  const [pickupIndex, setPickupIndex] = useState(1);
  //TODO NEW task pickups fix time
  const appContext = useContext(AppContext);
  const dispatch = useDispatch();
  const store = useSelector((store) => store);
  const staff = store.data.entities.staff
    .filter((staffMember) => staffMember._id !== constants.ADMIN_ID)
    .map((staffMember) => {
      return { label: staffMember.name, value: staffMember._id };
    });
  const activities = store.data.entities.activities.map((activity) => {
    return { label: activity.type, value: activity._id };
  });
  const vehicles = store.data.entities.vehicles.map((vehicle) => {
    return { label: vehicle.plate, value: vehicle._id };
  });

  return (
    <View style={styles.viewWrapper}>
      <Formik
        //enableReinitialize
        initialValues={{
          ...route.params.data,
          drivers: [
            ...route.params.data.crew.drivers.map((driver) => {
              return {
                label: driver.name,
                value: driver._id,
              };
            }),
          ],
          escorts: [
            ...route.params.data.crew.escorts.map((escort) => {
              return {
                label: escort.name,
                value: escort._id,
              };
            }),
          ],
          guides: [
            ...route.params.data.crew.guides.map((guide) => {
              return {
                label: guide.name,
                value: guide._id,
              };
            }),
          ],
        }}
        onSubmit={(values) => {
          const payload = {
            activity: values.activity,
            date: values.date,
            vehicle: values.vehicle,
            crew: {
              drivers: values.drivers.map((driver) => {
                return {
                  ...store.data.entities.staff.find(
                    (staffMember) => staffMember._id === driver.value
                  ),
                  reported: false,
                };
              }),
              escorts: values.escorts.map((escort) => {
                return {
                  ...store.data.entities.staff.find(
                    (staffMember) => staffMember._id === escort.value
                  ),
                  reported: false,
                };
              }),
              guides: values.guides.map((guide) => {
                return {
                  ...store.data.entities.staff.find(
                    (staffMember) => staffMember._id === guide.value
                  ),
                  reported: false,
                };
              }),
            },
            pickups: values.pickups,
            details: values.details,
          };

          if (route.params.title === "New task") {
            setIsLoading(true);
            addTask(payload, appContext.functions.showMsgModal).then((data) => {
              setIsLoading(false);
              navigation.navigate("Schedule");
            });
          } else {
            setIsLoading(true);
            editTask(
              route.params.data._id,
              payload,
              appContext.functions.showMsgModal
            ).then((data) => {
              setIsLoading(false);
              navigation.navigate("Schedule");
            });
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
            <View style={styles.formRow}>
              <View style={{ ...styles.formField, borderRadius: 5 }}>
                <Picker
                  item={{
                    label:
                      _.isObject(values.activity) &&
                      values.activity.type.length > 0
                        ? values.activity.type
                        : "Select a task..",
                    value: null,
                  }}
                  items={[
                    { label: "Select a task..", value: null },
                    ...activities,
                  ]}
                  onItemChange={(data) => {
                    if (data.label !== "Select a task..") {
                      setFieldValue("activity", {
                        type: data.label,
                        id: data.value,
                      });
                    }
                  }}
                  //onDonePress={(data) => setSelectedMember(1)}
                  //placeholder={"Select a member.."}
                  //isNullable
                  //backdropAnimation={{ opacity: 0 }}
                  //mode="dropdown"
                  //disable
                  containerStyle={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  touchableStyle={styles.touchableStyle}
                  textInputStyle={{
                    ...styles.textInputStyle,
                    opacity: values.activity ? 1 : 0.4,
                  }}
                />
                {_.isObject(values.activity) &&
                values.activity.type.length > 0 ? (
                  <Pressable
                    style={{
                      position: "absolute",
                      left: "90%",
                      padding: 4,
                      justifyContent: "center",
                      alignItems: "center",
                      //backgroundColor: "lightblue",
                    }}
                    onPress={() => {
                      setFieldValue("activity", null);
                    }}
                  >
                    <AntDesign name="close" size={21} color="#bfbfbf" />
                  </Pressable>
                ) : null}
              </View>
            </View>
            <View style={styles.formRow}>
              <View
                style={{
                  ...styles.formField,
                  borderTopLeftRadius: 5,
                  borderBottomLeftRadius: 5,
                  marginRight: 3,
                }}
              >
                <DatePicker
                  value={new Date()}
                  onDateChange={(date) => {
                    setFieldValue(
                      "date",
                      new Date(moment(date).utc().startOf("day"))
                    );
                  }}
                  text={
                    values.date
                      ? `${moment(values.date).format("DD")} ${moment(
                          values.date
                        ).format("MMM")} ${moment(values.date).format("YY")}`
                      : "Pick a date.."
                  }
                  containerStyle={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  touchableStyle={styles.touchableStyle}
                  textInputStyle={{
                    ...styles.textInputStyle,
                    opacity: values.date ? 1 : 0.4,
                  }}
                  //isNullable

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
                {values.date ? (
                  <Pressable
                    style={{
                      position: "absolute",
                      left: "80%",
                      padding: 4,
                      justifyContent: "center",
                      alignItems: "center",
                      //backgroundColor: "lightblue",
                    }}
                    onPress={() => {
                      setFieldValue("date", null);
                    }}
                  >
                    <AntDesign name="close" size={21} color="#bfbfbf" />
                  </Pressable>
                ) : null}
              </View>
              <View
                style={{
                  ...styles.formField,
                  borderTopRightRadius: 5,
                  borderBottomRightRadius: 5,
                }}
              >
                <Picker
                  item={{
                    label:
                      _.isObject(values.vehicle) &&
                      values.vehicle.plate.length > 0
                        ? values.vehicle.plate
                        : "Select a vehicle..",
                    value: null,
                  }}
                  items={[
                    { label: "Select a vehicle..", value: null },
                    ...vehicles,
                  ]}
                  onItemChange={(data) => {
                    if (data.label !== "Select a vehicle..") {
                      setFieldValue("vehicle", {
                        plate: data.label,
                        id: data.value,
                      });
                    }
                  }}
                  //onDonePress={(data) => setSelectedMember(1)}
                  //placeholder={"Select a member.."}
                  //isNullable
                  //backdropAnimation={{ opacity: 0 }}
                  //mode="dropdown"
                  //disable
                  containerStyle={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  touchableStyle={styles.touchableStyle}
                  textInputStyle={{
                    ...styles.textInputStyle,
                    opacity: values.vehicle ? 1 : 0.4,
                  }}
                />
                {_.isObject(values.vehicle) &&
                values.vehicle.plate.length > 0 ? (
                  <Pressable
                    style={{
                      position: "absolute",
                      left: "80%",
                      padding: 4,
                      justifyContent: "center",
                      alignItems: "center",
                      //backgroundColor: "lightblue",
                    }}
                    onPress={() => {
                      setFieldValue("vehicle", null);
                    }}
                  >
                    <AntDesign name="close" size={21} color="#bfbfbf" />
                  </Pressable>
                ) : null}
              </View>
            </View>
            <View style={styles.formRow}>
              <Pressable
                style={{
                  ...styles.formField,
                  borderTopLeftRadius: 5,
                  borderBottomLeftRadius: 5,
                  marginRight: 3,
                }}
                onPress={() => {
                  setIsCrewModalVisible(!isCrewModalVisible);
                }}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      ...styles.textInputStyle,
                      opacity:
                        [...values.drivers, ...values.escorts, ...values.guides]
                          .length === 0
                          ? 0.4
                          : 1,
                    }}
                  >
                    {[...values.drivers, ...values.escorts, ...values.guides]
                      .length === 0
                      ? "Select crew.."
                      : [...values.drivers, ...values.escorts, ...values.guides]
                          .map((i) => i.label)
                          .join(",")}
                  </Text>
                </View>
              </Pressable>
              <Pressable
                style={{
                  ...styles.formField,
                  borderTopRightRadius: 5,
                  borderBottomRightRadius: 5,
                }}
                onPress={() => {
                  setPickupsModalData({
                    ...pickupsModalData,
                    isVisible: true,
                    pickupIndex: values.pickups.length + 1,
                  });
                }}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text>Add pickup</Text>
                </View>
              </Pressable>
            </View>
            {values.details || isTaskDetailsShown ? null : (
              <View style={styles.formRow}>
                <Pressable
                  style={{
                    backgroundColor: "white",
                    flex: 1,
                    height: "100%",
                    borderRadius: 5,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    setIsTaskDetailsShown(true);
                  }}
                >
                  <Text style={styles.textInputStyle}>Add task details</Text>
                </Pressable>
              </View>
            )}
            {values.details || isTaskDetailsShown ? (
              <View
                style={{
                  ...styles.formRow,
                  maxHeight: 80,
                }}
              >
                <TextInput
                  autoCorrect={false}
                  value={values.details}
                  style={{
                    ...styles.textInput,
                    borderTopLeftRadius: 5,
                    borderBottomLeftRadius: 5,
                    borderTopRightRadius:
                      values.details || isTaskDetailsShown ? 0 : 5,
                    borderBottomRightRadius:
                      values.details || isTaskDetailsShown ? 0 : 5,
                    //textAlign: "center",
                    flex: 7,
                    paddingTop: 15,
                    textAlignVertical: "center",
                  }}
                  keyboardType="default"
                  multiline={true}
                  //numberOfLines={3}
                  autoCapitalize="none"
                  //maxLength={6}
                  onChangeText={handleChange("details")}
                  //placeholder="Pickup details"
                  autoFocus
                />

                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                  }}
                >
                  <Pressable
                    style={{
                      // position: "absolute",
                      // left: "90%",
                      flex: 1,
                      padding: 4,
                      justifyContent: "center",
                      borderTopRightRadius: 5,
                      borderBottomRightRadius: 5,
                      alignItems: "center",
                      backgroundColor: "white",
                      alignItems: "center",
                      //backgroundColor: "lightblue",
                    }}
                    onPress={() => {
                      setFieldValue("details", null);
                      setIsTaskDetailsShown(false);
                    }}
                  >
                    <AntDesign name="close" size={21} color="#bfbfbf" />
                  </Pressable>
                </View>
              </View>
            ) : null}

            {values.pickups.length === 0 ? null : (
              <View style={styles.pickupsContainer}>
                <FlatList
                  //ref={flatlistRef}
                  data={values.pickups}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(i, index) => index}
                  renderItem={({ item, index }) => (
                    <PickupItem
                      data={item}
                      index={index}
                      showEditModal={(data) => {
                        setPickupsModalData({
                          ...pickupsModalData,
                          data: data,
                          isVisible: true,
                          pickupIndex: index + 1,
                        });
                      }}
                      deleteThis={() => {
                        setFieldValue(
                          "pickups",
                          values.pickups.filter((i, ind) => ind !== index)
                        );
                      }}
                    />
                  )}
                />
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
                android_ripple={{
                  color: "lightgreen",
                  borderless: false,
                }}
                style={styles.submitBtn}
                onPress={handleSubmit}
              >
                {isLoading ? (
                  <ActivityIndicator size={"small"} color={"black"} />
                ) : (
                  <FontAwesome name="check" size={24} color="darkgreen" />
                )}
              </Pressable>
            </View>
            <SelectCrewModal
              visible={isCrewModalVisible}
              setVisible={setIsCrewModalVisible}
              setCrew={setFieldValue} //TODO prevent adding same member twice
              selectedDrivers={values.drivers}
              selectedEscorts={values.escorts}
              selectedGuides={values.guides}
            />
            <AddPickupsModal
              pickupData={pickupsModalData}
              setPickupData={setPickupsModalData}
              setPickups={(pickupObj) => {
                let newPickups = [...values.pickups];
                newPickups[pickupsModalData.pickupIndex - 1] = pickupObj;
                setFieldValue("pickups", newPickups);
              }}
            />

            <CustomBottomMsgModal />
          </>
        )}
      </Formik>
    </View>
  );
};

export default NewScheduleTaskScreen;

const styles = StyleSheet.create({
  viewWrapper: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#a593a0",
    padding: 5,
  },
  TopContainer: {
    //flex: 1,
    // maxHeight: 300,
  },
  formRow: {
    //backgroundColor: "grey",
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 3,
    borderColor: "grey",
    maxHeight: 60,
  },
  formField: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  pickupsContainer: {
    //marginTop: 2,
  },
  touchableStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    //backgroundColor: "indianred",
    height: "100%",
  },
  textInputStyle: {
    fontSize: 15,
    fontFamily: android ? "Roboto" : "Avenir",
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
  textInput: {
    flex: 1,
    // borderRadius: 4,
    backgroundColor: "white",
    padding: 10,
    borderColor: "rgba(0, 0, 0, 0.2)",
    //borderWidth: 1,
    fontSize: 15,
    height: "100%",
    width: "100%",
    color: "grey",
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
    borderTopLeftRadius: 4,
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
    borderTopRightRadius: 4,
    height: "100%",
    //backgroundColor: "rgb(220, 220, 220)",
    //width: "25%",
    //padding: 4,
  },
});
