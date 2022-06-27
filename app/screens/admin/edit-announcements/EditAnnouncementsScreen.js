//--------------- IMPORT MODULES ----------------------------

import { FlatList, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import CustomBottomMsgModal from "../../../components/CustomBottomMsgModal";
import EditAnnouncementListItem from "./EditAnnouncementListItem";
import NewAnnouncementFormModal from "./NewAnnouncementFormModal";

const EditAnnouncementsScreen = () => {
  const announcements = useSelector(
    (store) => store.data.entities.announcements
  );

  //------------------------------------------------------------------------------

  return (
    <View style={styles.OuterContainer}>
      <View style={styles.InnerContainer}>
        <FlatList
          data={announcements}
          keyExtractor={(announcement, index) => index}
          renderItem={({ item }) => <EditAnnouncementListItem data={item} />}
        />
      </View>
      <NewAnnouncementFormModal />
      <CustomBottomMsgModal />
    </View>
  );
};

export default EditAnnouncementsScreen;

const styles = StyleSheet.create({
  OuterContainer: {
    flex: 1,
    backgroundColor: "#a593a0",
  },
  InnerContainer: {
    padding: 6,
    flex: 1,
  },
});
