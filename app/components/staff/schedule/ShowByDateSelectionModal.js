//--------------- IMPORT MODULES ----------------------------

import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment-timezone";
import {
  Dimensions,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { DatePicker } from "react-native-woodpicker";
import AppContext from "../../AppContext";
const { width } = Dimensions.get("window");

const android = Platform.OS === "android" ? true : false;

//--------------------------------------------------------------

const ShowByDateSelectionModal = ({
  visible,
  hideModal,
  start_date,
  end_date,
  setStartDate,
  setEndDate,
  loadInitialTasks,
}) => {
  //----------- COMPONENT STATES --------------------

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const store = useSelector((store) => store);
  const appContext = useContext(AppContext);
  const hasDateSelection = start_date && end_date;
  const showMsgModal = appContext.functions.showMsgModal;
  const [thisStartDate, setThisStartDate] = useState(null);
  const [thisEndDate, setThisEndDate] = useState(null);

  //----------- COMPONENT FUNCTIONS -----------------

  //------------- COMPONENT RETURN ----------------------------

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      presentationStyle="overFullScreen"
      //onDismiss={props.toggleModalVisibility}
    >
      <View style={styles.viewWrapper}>
        <View
          style={{
            width: width * 0.73,
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <AntDesign
            name="close"
            size={40}
            color="whitesmoke"
            onPress={() => {
              hideModal();
            }}
          />
        </View>
        <View style={styles.modalView}>
          <View style={styles.inputWrapper}>
            <View
              style={{
                padding: 10,
                backgroundColor: "lightgrey",
                borderRadius: 5,
                marginBottom: 5,
                width: "100%",
              }}
            >
              <View style={{ marginBottom: 5 }}>
                <Text style={{ ...styles.text, fontWeight: "600" }}>
                  Specific day
                </Text>
              </View>
              <Pressable
                style={{
                  ...styles.dateButton,
                  marginBottom: 5,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <MaterialCommunityIcons
                  name="calendar"
                  size={22}
                  color="black"
                />
                <DatePicker
                  value={new Date()} //selected value
                  onDateChange={(date) => {
                    // setStartDate(moment(date).utc().startOf("day").toDate()); //https://stackoverflow.com/q/56080029
                    // setEndDate(
                    //   moment(date).tz("Europe/Athens").endOf("day").toDate()
                    // ); //https://stackoverflow.com/q/56080029

                    setStartDate(new Date(moment(date).utc().startOf("day")));
                    setEndDate(new Date(moment(date).utc().endOf("day")));
                  }}
                  text={"Select"}
                  containerStyle={{
                    justifyContent: "center",
                    alignItems: "center",
                    flex: 1,
                  }}
                  touchableStyle={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  textInputStyle={styles.text}
                  backdropAnimation={{ opacity: 0 }}
                  timeZoneOffsetInMinutes={180}
                  //maximumDate={new Date(Date.now())}
                  isNullable={false}
                />
                <MaterialCommunityIcons
                  name="calendar-arrow-right"
                  size={22}
                  color="black"
                  style={{ opacity: 0 }}
                />
              </Pressable>
            </View>
            <View
              style={{
                padding: 10,
                backgroundColor: "lightgrey",
                borderRadius: 5,
                width: "100%",
              }}
            >
              <View style={{ marginBottom: 5 }}>
                <Text style={{ ...styles.text, fontWeight: "600" }}>
                  Date range
                </Text>
              </View>
              <Pressable
                style={{
                  ...styles.dateButton,
                  marginBottom: 5,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <MaterialCommunityIcons
                  name="calendar-arrow-right"
                  size={22}
                  color="black"
                />
                <DatePicker
                  value={new Date()} //selected value
                  onDateChange={(date) => {
                    // setStartDate(moment(date).utc().startOf("day").toDate()); //https://stackoverflow.com/q/56080029

                    setStartDate(new Date(moment(date).utc().startOf("day")));
                  }}
                  text={
                    start_date
                      ? moment(start_date)
                          .utc()
                          .endOf("day")
                          .format("DD MMMM YYYY")
                      : "Select start date"
                  }
                  containerStyle={{
                    justifyContent: "center",
                    alignItems: "center",
                    flex: 1,
                  }}
                  touchableStyle={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  textInputStyle={styles.text}
                  backdropAnimation={{ opacity: 0 }}
                  maximumDate={end_date ? new Date(end_date) : null}
                  isNullable={false}
                />
                <MaterialCommunityIcons
                  name="calendar-arrow-right"
                  size={22}
                  color="black"
                  style={{ opacity: 0 }}
                />
              </Pressable>
              <Pressable
                style={{
                  ...styles.dateButton,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <MaterialCommunityIcons
                  name="calendar-arrow-left"
                  size={22}
                  color="black"
                />
                <DatePicker
                  value={new Date()} //selected value
                  onDateChange={(date) => {
                    setEndDate(new Date(moment(date).utc().endOf("day"))); //https://stackoverflow.com/q/56080029
                  }}
                  text={
                    end_date
                      ? moment(end_date)
                          .utc()
                          .endOf("day")
                          .format("DD MMMM YYYY")
                      : "Select end date"
                  }
                  containerStyle={{
                    justifyContent: "center",
                    alignItems: "center",
                    flex: 1,
                  }}
                  touchableStyle={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  textInputStyle={styles.text}
                  backdropAnimation={{ opacity: 0 }}
                  //maximumDate={new Date(Date.now())}
                  minimumDate={start_date ? new Date(start_date) : null}
                  isNullable={false}
                />
                <MaterialCommunityIcons
                  name="calendar-arrow-left"
                  size={22}
                  color="black"
                  style={{ opacity: 0 }}
                />
              </Pressable>
            </View>
          </View>

          <View style={styles.bottomButtonWrapper}>
            <TouchableOpacity
              style={{
                ...styles.bottomButton,
                marginRight: 5,
                backgroundColor: "#c8635c",
              }}
              onPress={() => {
                setStartDate(null);
                setEndDate(null);
              }}
            >
              <Text style={styles.buttonText}>{"Clear"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ ...styles.bottomButton, flex: 2 }}
              onPress={() => {
                if (hasDateSelection) {
                  loadInitialTasks();
                  hideModal();
                } else {
                  setStartDate(null);
                  setEndDate(null);
                  loadInitialTasks();
                  hideModal();
                }
              }}
            >
              <Text style={styles.buttonText}>{"Load tasks"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ShowByDateSelectionModal;

//---------------- COMPONENT STYLES ----------------------------------------------

const styles = StyleSheet.create({
  viewWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    //backgroundColor: "#a593a0",
  },
  modalView: {
    width: width * 0.7,
    backgroundColor: "whitesmoke",
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 7,
    padding: 10,
  },
  iconsWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  inputWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  dateButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "whitesmoke",
    borderRadius: 5,
    paddingHorizontal: 8,
    height: 40,
  },
  bottomButtonWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: "100%",
  },
  bottomButton: {
    alignItems: "center",
    justifyContent: "center",
    textShadowColor: "red",
    backgroundColor: "#66b3ff",
    borderRadius: 5,
    padding: 8,
    flex: 1,
    height: 40,
  },
  buttonText: {
    color: "whitesmoke",
    fontSize: 16,
    fontWeight: "800",
  },
  ghostIcon: {
    opacity: 0,
  },
  text: {
    fontFamily: android ? "Roboto" : "Avenir",
    fontSize: 17,
    alignSelf: "center",
  },
});

//---------------------------------------------------------------------------------
