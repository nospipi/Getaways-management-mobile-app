//--------------- IMPORT MODULES ----------------------------

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
} from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useState } from "react";
import moment from "moment-timezone";
//new Date(date).toLocaleString("en-US", { month: "short" }) NOT WORKING IN ANDROID

//--------------- IMPORT COMPONENTS ----------------------------

//--------------------------------------------------------------

const AnnouncementsListItem = ({ critical, body, date }) => {
  const [truncatedBodyText, setTruncatedBodyText] = useState(true);
  const bodyText = truncatedBodyText
    ? body.length > 60
      ? `${body.substring(0, 60)}...`
      : body
    : body;
  const toggleTruncatedBodyText = () => {
    setTruncatedBodyText(!truncatedBodyText);
  };
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => toggleTruncatedBodyText()}
    >
      <View style={styles.listItem}>
        <View style={styles.iconAndBody}>
          {critical ? (
            <AntDesign name="exclamationcircleo" size={24} color="red" />
          ) : (
            <Feather name="check-circle" size={24} color="green" />
          )}
          <Text
            style={[styles.body, { color: critical ? "#b30000" : "#001a00" }]}
          >
            {bodyText}
          </Text>
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.dateItem}>{moment(date).format("DD")}</Text>
          <Text style={styles.dateItem}>{moment(date).format("MMM")}</Text>
          <Text style={styles.dateItem}>{new Date(date).getFullYear()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const width = Dimensions.get("window").width;
const ios = Platform.OS === "ios" ? true : false;
const android = Platform.OS === "android" ? true : false;
const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgb(240, 240, 230)",
    marginBottom: 5,
    padding: 10,
    alignSelf: "stretch",
    borderRadius: 4,
    //shadowOpacity: 0.2,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    color: "whitesmoke",
    fontSize: 19,
    fontWeight: "600",
    fontFamily: android ? "Roboto" : "Avenir",
    flexShrink: 1,
  },
  iconAndBody: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    flexShrink: 1,
  },

  body: {
    fontSize: 17,
    fontWeight: android ? "700" : "600",
    fontFamily: android ? "Roboto" : "Avenir",
    marginLeft: 12,
    marginRight: 5,
    flexShrink: 1,
  },
  dateContainer: {
    borderLeftWidth: 1,
    paddingLeft: 7,
    justifyContent: "center",
  },
  dateItem: {
    fontFamily: android ? "Roboto" : "Avenir",
    fontSize: 13,
  },
});

export default AnnouncementsListItem;
