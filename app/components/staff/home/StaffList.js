//--------------- IMPORT MODULES ----------------------------

import { AntDesign } from "@expo/vector-icons";
import { useContext } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { ADMIN_ID } from "../../../../constants";
import AppContext from "../../AppContext";

//--------------- IMPORT COMPONENTS ----------------------------

const android = Platform.OS === "android" ? true : false;

//--------------------------------------------------------------

const StaffList = () => {
  const appContext = useContext(AppContext);
  const currentUser = useSelector((store) => store.data.currentUser);
  const { width } = Dimensions.get("window");
  const staff = useSelector((store) =>
    store.data.entities.staff.filter(
      (staffMember) =>
        staffMember.name === "Admin" || staffMember._id === currentUser._id
    )
  );

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      backgroundColor: "lightgrey",
      alignItems: "center",
      justifyContent: "center",
      height: 50,
      padding: 5,
      margin: 2,
      borderRadius: 3,
    },
    content: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    text: {
      fontSize: 16,
      fontWeight: "600",
      alignSelf: "center",
      fontFamily: android ? "Roboto" : "Avenir",
      color: "#1a1a00",
    },
    icon: {
      marginLeft: 10,
    },
  });

  return (
    <>
      <Pressable
        style={{ ...styles.container, backgroundColor: "dodgerblue" }}
        onPress={() => appContext.functions.handleUserSelection(ADMIN_ID)}
      >
        <View style={styles.content}>
          <Text style={{ ...styles.text, color: "whitesmoke" }}>
            Admin login
          </Text>
          {currentUser._id === ADMIN_ID ? (
            <AntDesign
              style={styles.icon}
              name="login"
              size={16}
              color={"whitesmoke"}
            />
          ) : null}
        </View>
      </Pressable>
      {currentUser._id && currentUser._id !== ADMIN_ID ? (
        <Pressable
          style={styles.container}
          onPress={() =>
            appContext.functions.handleUserSelection(currentUser._id)
          }
        >
          <View style={styles.content}>
            <Text style={styles.text}>{`${currentUser.name} login`}</Text>
            <AntDesign
              style={styles.icon}
              name="login"
              size={16}
              color={"black"}
            />
          </View>
        </Pressable>
      ) : null}
      <Pressable
        style={styles.container}
        onPress={() => appContext.functions.handleUserSelection(null)}
      >
        <View style={styles.content}>
          <Text style={styles.text}>Staff login</Text>
        </View>
      </Pressable>
    </>
  );
};

export default StaffList;
