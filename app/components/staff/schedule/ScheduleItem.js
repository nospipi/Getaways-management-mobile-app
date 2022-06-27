//--------------- IMPORT MODULES ----------------------------
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import _ from "lodash";
import moment from "moment-timezone";
import { useContext, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { deleteTask, toggleScheduleStatus } from "../../../../src/api/api";
import AppContext from "../../AppContext";
//new Date(date).toLocaleString("en-US", { month: "short" }) NOT WORKING IN ANDROID

//--------------- IMPORT COMPONENTS ----------------------------

//--------------------------------------------------------------

const android = Platform.OS === "android" ? true : false;

export const ScheduleItem = ({ isAdminPage, loadInitialTasks, data }) => {
  const currentUser = useSelector((store) => store.data.currentUser);
  const navigation = useNavigation();
  const [itemData, setItemData] = useState(data);
  const [isLoading, setIsLoading] = useState(false);
  const [isToggleStatusLoading, setToggleStatusLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [componentWidth, setComponentWidth] = useState(0);
  const appContext = useContext(AppContext);
  const showMsgModal = appContext.functions.showMsgModal;
  const [isPickupsModalVisible, setIsPickupsModalVisible] = useState(false);
  const togglePickupsModalVisibility = () => {
    setIsPickupsModalVisible(!isPickupsModalVisible);
  };
  const hasNoDrivers =
    !Array.isArray(itemData.crew.drivers) || !itemData.crew.drivers.length;
  const hasNoEscorts =
    !Array.isArray(itemData.crew.escorts) || !itemData.crew.escorts.length;
  const hasNoGuides =
    !Array.isArray(itemData.crew.guides) || !itemData.crew.guides.length;

  const hasNoCrew = hasNoDrivers && hasNoEscorts && hasNoGuides;
  const scrollRef = useRef();
  const hasNoVehicle =
    _.isNull(itemData.vehicle) || _.isEmpty(itemData.vehicle);
  const isReported = isAdminPage
    ? {} //if is admin page it crashes the schedule screen because .find returns undefined if no match is found
    : Object.keys(itemData.crew)
        .map((i) => itemData.crew[i])
        .flat()
        .find((crewMember) => crewMember._id === currentUser._id).reported;
  return (
    <View
      style={styles.container}
      // ref={(view) => {
      //   if (!view) return;
      //   view.measureInWindow((x, y, width, height) => {
      //     setComponentWidth(width);
      //   });
      // }}
      onLayout={(event) => {
        setComponentWidth(event.nativeEvent.layout.width);
      }}
    >
      {isLoading ? (
        <ActivityIndicator
          style={{ width: "100%" }}
          size="small"
          color="black"
        />
      ) : null}
      <ScrollView
        ref={scrollRef}
        horizontal={true}
        pagingEnabled={android ? false : true} //not working on android unless second page has custom width more than 180
        showsHorizontalScrollIndicator={false}
      >
        <View
          style={{
            ...styles.leftView,
            width: componentWidth - 8,
            maxWidth: componentWidth - 8,
            //opacity: scale(scrollPosition, 86, 0, 0.3, 1),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              backgroundColor: "hsl(0, 0%, 94%)",
              borderRadius: 4,
              //borderWidth: 0.7,
              borderColor: "#8c8c8c",
            }}
          >
            {isAdminPage ? null : (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: 100,
                  borderRightWidth: 0.7,
                  borderColor: "#8c8c8c",
                }}
              >
                <View
                  style={{
                    backgroundColor: "white",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 60,
                    height: 60,
                    borderRadius: 100,
                    //padding: 15,
                  }}
                >
                  {isToggleStatusLoading ? (
                    <ActivityIndicator size="small" color="black" />
                  ) : isReported ? (
                    <FontAwesome name="check" size={30} color="green" />
                  ) : (
                    <FontAwesome name="close" size={30} color="indianred" />
                  )}
                </View>
              </View>
            )}
            <View
              style={{
                flex: 1,
                paddingVertical: 5,
                paddingHorizontal: 10,
              }}
            >
              <View
                style={{
                  ...styles.leftViewItem,
                  //marginBottom: 1,
                }}
              >
                <Text
                  style={{
                    ...styles.text,
                    fontSize: 16,
                    fontWeight: "700",
                    //textDecorationLine: "underline",
                  }}
                >
                  {itemData.activity.type}
                </Text>
              </View>
              <View
                style={{
                  ...styles.leftViewItem,
                  //marginBottom: hasNoVehicle && hasNoCrew ? 0 : 1,
                }}
              >
                <Text
                  style={{
                    ...styles.text,
                    fontSize: 16,
                    color: "dodgerblue",
                    fontWeight: "700",
                    //textDecorationLine: "underline",
                  }}
                >
                  {moment(itemData.date).format("DD MMMM YYYY")}
                </Text>
              </View>

              <View
                style={{
                  ...styles.leftViewItem,
                  //marginBottom: hasNoCrew ? 0 : 0.5,
                }}
              >
                <Text
                  style={{
                    ...styles.text,
                    color: hasNoVehicle ? "indianred" : "black",
                  }}
                >
                  {hasNoVehicle
                    ? "Vehicle to be decided later"
                    : itemData.vehicle.plate}
                </Text>
              </View>

              <View
                style={{
                  ...styles.leftViewItem,
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                {hasNoCrew ? (
                  <Text
                    style={{
                      ...styles.text,
                      color: "indianred",
                    }}
                  >
                    Crew to be decided later
                  </Text>
                ) : (
                  Object.keys(itemData.crew)
                    .map((i) => itemData.crew[i])
                    .flat()
                    .map((crewMember, index) => (
                      <View
                        key={index}
                        style={{
                          flexDirection: "row",
                          marginRight: 5,
                          justifyContent: "center",
                          alignItems: android ? "center" : "flex-start",
                        }}
                      >
                        {/* style={{ marginLeft: 2 }} */}
                        <Text style={styles.text}>{crewMember.name}</Text>
                        {crewMember.reported ? (
                          <View
                            style={{
                              marginLeft: 2,
                              height: "100%",
                              justifyContent: "center",
                              alignItems: "center",
                              //backgroundColor: "green",
                            }}
                          >
                            <FontAwesome name="check" size={15} color="green" />
                          </View>
                        ) : (
                          <View
                            style={{
                              marginLeft: 2,
                              height: "100%",
                              justifyContent: "center",
                              alignItems: "center",
                              //backgroundColor: "green",
                            }}
                          >
                            <FontAwesome
                              name="close"
                              size={15}
                              color="indianred"
                            />
                          </View>
                        )}
                      </View>
                    ))
                )}
              </View>
            </View>
          </View>
        </View>
        <View style={styles.editView}>
          {isAdminPage ? null : (
            <TouchableOpacity
              style={styles.editViewButtonContainer}
              onPress={() => {
                if (!isReported) {
                  setToggleStatusLoading(true);
                  toggleScheduleStatus(itemData._id, currentUser._id).then(
                    (itemData) => {
                      setItemData(itemData.document);
                      setToggleStatusLoading(false);
                      scrollRef.current.scrollTo({ x: 0, animated: true });
                      showMsgModal(itemData.msg, true);
                    }
                  );
                } else {
                  scrollRef.current.scrollTo({ x: 0, animated: true });
                  showMsgModal("Task already reported", false);
                }
              }}
            >
              {isToggleStatusLoading ? (
                <ActivityIndicator size="small" color="black" />
              ) : (
                <FontAwesome name="check" size={22} color="green" />
              )}
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.editViewButtonContainer}
            onPress={() => {
              scrollRef.current.scrollTo({ x: 0, animated: true });
              navigation.navigate("Pickups", {
                title: `${itemData.activity.type}`,
                data: itemData,
              });
            }}
          >
            <FontAwesome name="info" size={22} color="black" />
          </TouchableOpacity>

          {isAdminPage ? (
            <>
              <TouchableOpacity
                style={styles.editViewButtonContainer}
                onPress={() => {
                  navigation.navigate("New task", {
                    title: "Edit task",
                    data: data,
                  });
                  scrollRef.current.scrollTo({ x: 0, animated: true });
                }}
              >
                <AntDesign name="edit" size={22} color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editViewButtonContainer}
                onPress={() => {
                  setIsDeleteLoading(true);
                  deleteTask(itemData._id, showMsgModal).then(() => {
                    //setIsDeleteLoading(false);
                    loadInitialTasks();
                  });
                }}
              >
                {isDeleteLoading ? (
                  <ActivityIndicator size="small" color="black" />
                ) : (
                  <AntDesign name="delete" size={22} color="indianred" />
                )}
              </TouchableOpacity>
            </>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 5,
    flexDirection: "row",
    //paddingVertical: 4,
    padding: 4,
    backgroundColor: `white`,
    borderRadius: 3,
    minHeight: 105,
  },

  leftView: {
    flex: 1,
    flexDirection: "row",
  },
  editView: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#e6e6e6",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
    marginLeft: 4,
  },
  editViewButtonContainer: {
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    padding: 10,
    width: 55,
    height: 55,
    borderRadius: 100,
  },
  leftViewItem: {
    justifyContent: "center",
    alignItems: "flex-start",
    flex: 1,
  },
  text: {
    fontFamily: android ? "Roboto" : "Avenir",
    fontSize: 15,
    fontWeight: "600",
  },
});
