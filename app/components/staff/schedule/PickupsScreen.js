//--------------- IMPORT MODULES ----------------------------
import {
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import _ from "lodash";
import moment from "moment-timezone";
import { useContext } from "react";
import {
  FlatList,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AppContext from "../../AppContext";
import MapsNavigationModal from "./MapsNavigationModal";

//--------------------------------------------------------------

const android = Platform.OS === "android" ? true : false;
const ios = Platform.OS === "ios" ? true : false;

const PickupsScreen = ({ route }) => {
  const appContext = useContext(AppContext);
  const hasNoDrivers =
    !Array.isArray(route.params.data.crew.drivers) ||
    !route.params.data.crew.drivers.length;
  const hasNoEscorts =
    !Array.isArray(route.params.data.crew.escorts) ||
    !route.params.data.crew.escorts.length;
  const hasNoGuides =
    !Array.isArray(route.params.data.crew.guides) ||
    !route.params.data.crew.guides.length;
  const hasNoVehicle =
    _.isNull(route.params.data.vehicle) || _.isEmpty(route.params.data.vehicle);
  const mapSearchLocations = route.params.data.pickups
    .map((pickup) => pickup.meeting_point)
    .join("/");

  const onPressMobileNumberClick = (number) => {
    let phoneNumber = "";
    if (android) {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }
    Linking.openURL(phoneNumber);
  };

  return (
    <View style={styles.viewWrapper}>
      <View style={styles.infoContainer}>
        <View style={styles.infoLabel}>
          <Text
            style={{
              ...styles.text,
              color: "whitesmoke",
              fontSize: 15,
              //textAlign: "center",
              fontWeight: "700",
              letterSpacing: 1,
            }}
          >
            Task info
          </Text>
        </View>
        <View style={styles.info}>
          <View style={styles.row}>
            <View style={styles.label_cell}>
              <Text style={styles.infoText}>Task</Text>
            </View>
            <View style={styles.task_cell}>
              <Text style={styles.infoText}>
                {route.params.data.activity.type}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.label_cell}>
              <Text style={styles.infoText}>Date</Text>
            </View>
            <View style={styles.task_cell}>
              <Text style={styles.infoText}>
                {moment(route.params.data.date).format("DD MMMM YYYY")}
              </Text>
            </View>
          </View>
          {hasNoVehicle ? null : (
            <View style={styles.row}>
              <View style={styles.label_cell}>
                <Text style={styles.infoText}>Vehicle</Text>
              </View>

              <View style={styles.task_cell}>
                <Text style={styles.infoText}>
                  {route.params.data.vehicle.plate}
                </Text>
              </View>
            </View>
          )}
          {hasNoDrivers ? null : (
            <View style={styles.row}>
              <View style={styles.label_cell}>
                <Text style={styles.infoText}>Driver</Text>
              </View>
              <View style={styles.task_cell}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {route.params.data.crew.drivers.map((i, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: 5,
                      }}
                    >
                      <Text style={styles.infoText}>{i.name}</Text>
                      {i.contact.tel ? (
                        <Pressable
                          style={{
                            marginLeft: 4,
                          }}
                          onPress={() => {
                            onPressMobileNumberClick(i.contact.tel);
                          }}
                        >
                          <MaterialIcons
                            name="quick-contacts-dialer"
                            size={27}
                            color="#0EAD69"
                          />
                        </Pressable>
                      ) : null}
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}
          {hasNoEscorts ? null : (
            <View style={styles.row}>
              <View style={styles.label_cell}>
                <Text style={styles.infoText}>Escort</Text>
              </View>
              <View style={styles.task_cell}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {route.params.data.crew.escorts.map((i, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: 5,
                      }}
                    >
                      <Text style={styles.infoText}>{i.name}</Text>
                      {i.contact.tel ? (
                        <Pressable
                          style={{
                            marginLeft: 4,
                          }}
                          onPress={() => {
                            onPressMobileNumberClick(i.contact.tel);
                          }}
                        >
                          <MaterialIcons
                            name="quick-contacts-dialer"
                            size={27}
                            color="#0EAD69"
                          />
                        </Pressable>
                      ) : null}
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}
          {hasNoGuides ? null : (
            <View style={styles.row}>
              <View style={styles.label_cell}>
                <Text style={styles.infoText}>Guide</Text>
              </View>
              <View style={styles.task_cell}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {route.params.data.crew.guides.map((i, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: 5,
                      }}
                    >
                      <Text style={styles.infoText}>{i.name}</Text>
                      {i.contact.tel ? (
                        <Pressable
                          style={{
                            marginLeft: 4,
                          }}
                          onPress={() => {
                            onPressMobileNumberClick(i.contact.tel);
                          }}
                        >
                          <MaterialIcons
                            name="quick-contacts-dialer"
                            size={27}
                            color="#0EAD69"
                          />
                        </Pressable>
                      ) : null}
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}
          {route.params.data.details ? (
            <View style={styles.row}>
              <View style={styles.label_cell}>
                <Text style={styles.infoText}>Details</Text>
              </View>
              <View style={styles.task_cell}>
                <Text style={styles.infoText}>{route.params.data.details}</Text>
              </View>
            </View>
          ) : null}
        </View>
      </View>
      <View style={styles.pickupsContainer}>
        <View style={styles.infoLabel}>
          <Text
            style={{
              ...styles.text,
              color:
                route.params.data.pickups.length > 0 ? "whitesmoke" : "#ffeb4d",
              fontSize: 15,
              textAlign: "center",
              fontWeight: "700",
              letterSpacing: 1,
            }}
          >
            {route.params.data.pickups.length > 0
              ? "Pickups"
              : "No pickups yet!"}
          </Text>
        </View>
        <View style={styles.listContainer}>
          <FlatList
            data={route.params.data.pickups}
            //showsVerticalScrollIndicator={false}
            keyExtractor={(pickups, index) => index}
            renderItem={({ item, index }) => (
              <View style={styles.pickupItem}>
                <View
                  style={{
                    paddingVertical: 3,
                    paddingLeft: 5,
                    justifyContent: "center",
                    alignItems: "flex-start",
                  }}
                >
                  <Text
                    style={{
                      ...styles.pickupLabel,
                      fontWeight: "700",
                      // textDecorationLine: "underline",
                    }}
                  >
                    Pickup point {index + 1} /{" "}
                    {route.params.data.pickups.length}
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <View
                    style={{
                      backgroundColor: "rgb(248, 248, 255)",
                      paddingLeft: 5,
                      marginRight: 2,
                      flex: 1,
                      justifyContent: "flex-start",
                      alignItems: "center",
                      flexDirection: "row",
                      // borderTopLeftRadius: 4,
                      // borderBottomLeftRadius: 4,
                    }}
                  >
                    <FontAwesome
                      style={{ marginRight: 8 }}
                      name="map-marker"
                      size={16}
                      color="black"
                    />
                    <Text
                      style={{
                        ...styles.text,
                        fontSize: 16,
                        fontWeight: "700",
                      }}
                    >
                      {item.meeting_point}
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: "rgb(248, 248, 255)",
                      padding: 5,
                      justifyContent: "flex-start",
                      alignItems: "center",
                      flexDirection: "row",
                      // borderTopRightRadius: 4,
                      // borderBottomRightRadius: 4,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="clock-time-nine-outline"
                      size={16}
                      color="black"
                      style={{ marginRight: 5 }}
                    />
                    <Text style={styles.text}>
                      {item.time
                        ? moment(item.time).tz("Europe/Athens").format("HH:mm")
                        : "Time not set"}
                    </Text>
                  </View>
                </View>

                {item.guests.length > 0 ? (
                  item.guests.map((guest, index) => (
                    <View
                      key={index}
                      style={{
                        backgroundColor: "rgb(250, 240, 250)",
                        paddingLeft: 5,
                        paddingVertical: 2,
                        marginTop: 2,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        //borderRadius: 4,
                      }}
                    >
                      <View
                        style={{
                          marginRight: 7,
                          // alignSelf: "flex-start"
                        }}
                      >
                        <FontAwesome name="user" size={14} color="tomato" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.text}>
                          {guest.name} x {guest.count}
                        </Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <View
                    key={index}
                    style={{
                      backgroundColor: "rgb(250, 240, 250)",
                      paddingLeft: 5,
                      paddingVertical: 2,
                      marginTop: 2,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      //borderRadius: 4,
                    }}
                  >
                    <Text style={styles.text}>Guest names not provided</Text>
                  </View>
                )}
                {item.details ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "rgb(248, 248, 255)",
                      paddingLeft: 5,
                      paddingVertical: 2,
                      marginTop: 2,
                    }}
                  >
                    <View style={{ marginRight: 7, paddingHorizontal: 2 }}>
                      <FontAwesome name="info" size={17} color="black" />
                    </View>
                    <View>
                      <Text style={styles.text}>{item.details}</Text>
                    </View>
                  </View>
                ) : null}
              </View>
            )}
          />
        </View>
      </View>
      <MapsNavigationModal
        visible={appContext.states.isMapsNavigationModalVisible}
        hideModal={() => {
          appContext.functions.toggleMapsNavigationModalVisibility();
        }}
        pickups={route.params.data.pickups}
      />
    </View>
  );
};
//TODO replace all safeareaviews
export default PickupsScreen;

//---------------- COMPONENT STYLES ----------------------------------------------

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,

    //padding: 5,
  },
  viewWrapper: {
    //paddingVertical: 7,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "flex-start",
    //backgroundColor: "whitesmoke",
    backgroundColor: "#a593a0",
    flex: 1,
  },
  iconsWrapper: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    //backgroundColor: "red",
    //marginTop: 10,
    //flex: 1,
  },
  ghostIcon: {
    opacity: 0,
  },
  infoContainer: {
    //flex: 1,
    width: "100%",
    //padding: 7,
    //backgroundColor: "rgba(0, 0, 0, 0.1)",
    //borderWidth: 1,
    borderColor: "grey",

    //borderRadius: 3,
  },
  info: {
    padding: 3,
    backgroundColor: "white",
    borderRadius: 2,
    marginBottom: 2,
  },
  pickupsContainer: {
    width: "100%",
    //padding: 7,
    //borderWidth: 1,
    borderColor: "grey",
    borderRadius: 2,
    flex: 1,
  },
  pickupItem: {
    backgroundColor: "white",
    padding: 3,
    paddingTop: 0,
    marginBottom: 6,
    flex: 1,
    borderRadius: 2,
  },
  pickupLabel: {
    color: "dodgerblue",
    fontSize: 15,
    fontWeight: "600",
    fontFamily: android ? "Roboto" : "Avenir",
  },
  listContainer: {
    flex: 1,
  },
  infoLabel: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    //backgroundColor: "red",

    //marginTop: android ? 0 : 40,
    marginBottom: 1,
  },
  row: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 1,
    minHeight: 30,

    //backgroundColor: "#e6e6e6",
  },
  label_cell: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(245, 245, 255)",
    marginRight: 1,
    borderBottomWidth: 0,
    borderColor: "red",
    paddingVertical: 3,
    flex: 1,
    //borderRightWidth: 1,
    marginRight: 1,
    // borderTopLeftRadius: 4,
    // borderBottomLeftRadius: 4,
  },
  task_cell: {
    justifyContent: "center",
    alignItems: "flex-start",
    paddingVertical: 3,
    paddingLeft: 5,
    backgroundColor: "rgb(245, 245, 255)",
    flex: 4,
    // borderTopRightRadius: 4,
    // borderBottomRightRadius: 4,
    // borderBottomWidth: 1,
    // borderColor: "#e6e6e6",
  },
  text: {
    color: "black",
    fontSize: 16,
    fontWeight: "400",
    fontFamily: android ? "Roboto" : "Avenir",
  },
  infoText: {
    color: "black",
    fontSize: 14,
    fontWeight: "400",
    fontFamily: android ? "Roboto" : "Avenir",
  },
});

//---------------------------------------------------------------------------------
