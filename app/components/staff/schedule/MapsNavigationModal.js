//--------------- IMPORT MODULES ----------------------------

import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";

import { useDispatch, useSelector } from "react-redux";

import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Dimensions,
  Linking,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AppContext from "../../AppContext";
const { width } = Dimensions.get("window");

const android = Platform.OS === "android" ? true : false;

//--------------------------------------------------------------

const MapsNavigationModal = ({ visible, hideModal, pickups }) => {
  //----------- COMPONENT STATES --------------------

  const mapSearchLocations = pickups
    .map((pickup) => pickup.meeting_point)
    .join("/");

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
            width: width * 0.83,
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
          <Pressable
            style={{
              flexDirection: "row",
              height: 50,
              backgroundColor: "#78aa9f",
              borderRadius: 3,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              Linking.openURL(
                `https://www.google.com/maps/dir//${mapSearchLocations}`
              );
            }}
          >
            <MaterialCommunityIcons
              name="google-maps"
              size={22}
              color="white"
              style={{ paddingHorizontal: 15 }}
            />
            <Text style={styles.text}>Navigate to all pickups</Text>
          </Pressable>
          {pickups.map((pickup, index) => {
            return (
              <Pressable
                key={index}
                style={{
                  flexDirection: "row",
                  height: 50,
                  backgroundColor: "#537874",
                  borderRadius: 3,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 5,
                }}
                onPress={() => {
                  Linking.openURL(
                    `https://www.google.com.sa/maps/search/${pickup.meeting_point}?hl=en`
                  );
                }}
              >
                <MaterialCommunityIcons
                  name="google-maps"
                  size={22}
                  color="white"
                  style={{ paddingHorizontal: 15 }}
                />
                <Text style={styles.text}>{pickup.meeting_point}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </Modal>
  );
};

export default MapsNavigationModal;

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
    width: width * 0.8,
    backgroundColor: "whitesmoke",
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 7,
    padding: 10,
  },
  text: {
    fontFamily: android ? "Roboto" : "Avenir",
    fontSize: 19,
    fontWeight: "400",
    alignSelf: "center",
    color: "whitesmoke",
    flex: 1,
    //textAlign: "center",
  },
});

//---------------------------------------------------------------------------------
