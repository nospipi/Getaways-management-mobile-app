//--------------- IMPORT MODULES ----------------------------

import { FontAwesome } from "@expo/vector-icons";
import moment from "moment-timezone";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { deleteAnnouncement } from "../../../../src/api/api";
import AppContext from "../../../components/AppContext";

//--------------------------------------------------------------

const android = Platform.OS === "android" ? true : false;

const EditAnnouncementListItem = ({ data }) => {
  const [isLoading, setIsLoading] = useState(false);
  const appContext = useContext(AppContext);
  const showMsgModal = appContext.functions.showMsgModal;
  const dispatch = useDispatch();

  const bodyText =
    data.body.length > 60 ? `${data.body.substring(0, 45)}...` : data.body;

  useEffect(() => {
    return () => {
      setIsLoading(false);
    };
  }, []);
  // cleanup operation,because when a user is deleted the component is unmounted before deleteIsLoading is set back to false
  // The return function from the useEffect() hook is called when the component is unmounted
  // https://jasonwatmore.com/post/2021/08/27/react-how-to-check-if-a-component-is-mounted-or-unmounted
  // https://dev.to/robmarshall/how-to-use-componentwillunmount-with-functional-components-in-react-2a5g

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.trashContainer}
        onPress={() => {
          setIsLoading(true);
          deleteAnnouncement(data._id, showMsgModal, setIsLoading, dispatch);
        }}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="black" />
        ) : (
          <FontAwesome name="trash-o" size={24} color="indianred" />
        )}
      </TouchableOpacity>
      <View style={styles.rightContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{bodyText}</Text>
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.dateItem}>{moment(data.date).format("DD")}</Text>
          <Text style={styles.dateItem}>{moment(data.date).format("MMM")}</Text>
          <Text style={styles.dateItem}>
            {moment(data.date).format("YYYY")}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
    marginBottom: 2,
  },
  trashContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "lightgrey",
    height: "100%",
    marginRight: 2,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  rightContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "lightgrey",
    paddingHorizontal: 10,
    height: "100%",
    flex: 4,
  },

  textContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 5,
    flex: 1,
  },
  text: {
    fontFamily: android ? "Roboto" : "Avenir",
    fontSize: 15,
  },
  dateContainer: {
    borderLeftWidth: 1,
    paddingLeft: 10,
    justifyContent: "center",
    height: "80%",
  },
  dateItem: {
    fontFamily: android ? "Roboto" : "Avenir",
    fontSize: 13,
  },
});

export default EditAnnouncementListItem;
