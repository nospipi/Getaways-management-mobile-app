//--------------- IMPORT MODULES ----------------------------

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  RefreshControl,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";

//--------------- IMPORT COMPONENTS ----------------------------

import AnnouncementsListItem from "./AnnouncementListItem";
import { fetchEntities } from "../../../../src/api/api";

//--------------------------------------------------------------

const AnnouncementsContainer = () => {
  //const isLoading = useSelector((store) => store.data.isLoading);
  const dispatch = useDispatch();
  const announcements = useSelector(
    (store) => store.data.entities.announcements
  );
  const [refreshingAnnouncements, setRefreshingAnnouncements] = useState(false);

  const onRefresh = () => {
    setRefreshingAnnouncements(true);
    dispatch(fetchEntities).then(() => {
      setRefreshingAnnouncements(false);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Announcements board</Text>
      <FlatList
        data={announcements}
        keyExtractor={(announcement) => announcement._id}
        renderItem={({ item }) => (
          <AnnouncementsListItem
            key={item._id}
            body={item.body}
            date={item.date}
            critical={item.critical}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshingAnnouncements}
            onRefresh={() => onRefresh()}
          />
        }
      />
    </View>
  );
};

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
const ios = Platform.OS === "ios" ? true : false;
const android = Platform.OS === "android" ? true : false;
const styles = StyleSheet.create({
  container: {
    //justifyContent: "flex-end",
    //alignItems: "center",
    //borderWidth: 0.2,
    //borderColor: "lightgrey",
    //borderRadius: 6,

    //backgroundColor: "rgb(135, 115, 130)",
    flexShrink: 1,
    height: "auto",
  },
  label: {
    fontSize: 20,
    fontFamily: android ? "Roboto" : "Avenir",
    color: "whitesmoke",
    alignSelf: "center",
    fontWeight: "700",
    letterSpacing: 3,
    marginBottom: 5,
    //textDecorationLine: "underline",
  },
});

export default AnnouncementsContainer;
