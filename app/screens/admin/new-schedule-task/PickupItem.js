//--------------- IMPORT MODULES ----------------------------

import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";
import moment from "moment-timezone";
import { useRef, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

//--------------------------------------------------------------

const android = Platform.OS === "android" ? true : false;

const PickupItem = ({ data, index, showEditModal, deleteThis }) => {
  const [componentWidth, setComponentWidth] = useState(0);
  const scrollRef = useRef();

  return (
    <View
      style={styles.container}
      onLayout={(event) => {
        setComponentWidth(event.nativeEvent.layout.width);
      }}
    >
      <ScrollView
        ref={scrollRef}
        horizontal={true}
        pagingEnabled={android ? false : true} //not working on android unless second page has custom width more than  ? half width ?
        showsHorizontalScrollIndicator={false}
      >
        <View
          style={{
            ...styles.leftView,
            width: componentWidth - 8,
            maxWidth: componentWidth - 8,
            paddingRight: 5,
          }}
        >
          <View
            style={{
              //flex: 1,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              paddingHorizontal: 10,
              marginRight: 5,
              borderTopLeftRadius: 3,
              borderBottomLeftRadius: 3,
              width: 50,
              borderRightWidth: 0.5,
            }}
          >
            <Text style={{ ...styles.text, fontSize: 18 }}>#{index + 1}</Text>
          </View>
          <View
            style={{
              flex: 1,
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "flex-start",
                alignItems: "center",
                flexDirection: "row",
                height: "100%",
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  //backgroundColor: "grey",
                  width: "100%",
                }}
              >
                <MaterialIcons
                  name="location-pin"
                  style={{
                    marginRight: 4,
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",

                    // width: 18,
                    // maxWidth: 18,
                  }}
                  size={17}
                  color="black"
                />
                <View style={{ maxWidth: "90%" }}>
                  <Text style={styles.text}>{data.meeting_point}</Text>
                </View>
              </View>
              <View
                style={{
                  flexShrink: 1,
                  justifyContent: "flex-end",
                  alignItems: "center",
                  flexDirection: "row",
                  //backgroundColor: "lightgrey",
                  height: "100%",
                }}
              >
                <FontAwesome5
                  name="clock"
                  size={14}
                  color="black"
                  style={{
                    marginRight: 4,
                  }}
                />
                <Text style={styles.text}>
                  {data.time
                    ? moment(data.time).tz("Europe/Athens").format("HH:mm")
                    : "Time not set"}
                </Text>
              </View>
            </View>
            <View
              style={{
                justifyContent: "flex-start",
                alignItems: "center",
                flexDirection: "row",
                flex: 1,
                height: "100%",

                //backgroundColor: "lightblue",
              }}
            >
              <View
                style={{
                  marginRight: 3,
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  textAlign: "center",

                  // width: 18,
                  // maxWidth: 18,
                }}
              >
                <Feather name="user" size={18} color="black" />
              </View>
              <View
                style={{
                  flexShrink: 1,
                  height: "100%",
                  justifyContent: "flex-end",
                }}
              >
                <Text
                  style={{
                    ...styles.text,
                    width: "100%",
                  }}
                >
                  {data.guests.length > 0
                    ? data.guests
                        .map(
                          (guest) =>
                            `${guest.name ? guest.name : "(..)"} x ${
                              guest.count ? guest.count : "(..)"
                            }`
                        )
                        .join(", ")
                    : "Guest names to be added later"}
                </Text>
              </View>
            </View>
            {data.details ? (
              <View
                style={{
                  justifyContent: "flex-start",
                  alignItems: "center",
                  flexDirection: "row",
                  //backgroundColor: "lightblue",
                }}
              >
                <Entypo
                  name="info"
                  size={16}
                  color="black"
                  style={{
                    marginRight: 3,
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    alignSelf: "flex-start",
                    // width: 18,
                    // maxWidth: 18,
                  }}
                />
                <View style={{ flexShrink: 1 }}>
                  <Text
                    style={{
                      ...styles.text,
                      width: "100%",
                      //fontStyle: "italic",
                    }}
                  >
                    {data.details}
                  </Text>
                </View>
              </View>
            ) : null}
          </View>
        </View>
        <View style={styles.editView}>
          <TouchableOpacity
            style={styles.editViewButtonContainer}
            onPress={() => {
              showEditModal(data);
              scrollRef.current.scrollTo({ x: 0, animated: true });
            }}
          >
            <AntDesign name="edit" size={20} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editViewButtonContainer}
            onPress={() => {
              deleteThis();
              scrollRef.current.scrollTo({ x: 0, animated: true });
            }}
          >
            <AntDesign name="delete" size={20} color="indianred" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 3,
    flexDirection: "row",
    padding: 4,
    backgroundColor: `white`,
    borderRadius: 3,
    shadowColor: "black",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },

  leftView: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "whitesmoke",
    borderRadius: 3,
    paddingVertical: 4,
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
    width: 45,
    height: 45,
    borderRadius: 100,
  },
  leftViewItem: {
    justifyContent: "center",
    alignItems: "flex-start",
    flex: 1,
  },
  text: {
    fontFamily: android ? "Roboto" : "Avenir",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default PickupItem;
