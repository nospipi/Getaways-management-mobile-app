//--------------- IMPORT MODULES ----------------------------

import { FlatList, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";

//---------------- IMPORT COMPONENTS --------------------------

import CustomBottomMsgModal from "../../../components/CustomBottomMsgModal";
import EditAnnouncementListItem from "./EditAnnouncementListItem";
import NewAnnouncementFormModal from "./NewAnnouncementFormModal";

//---------------- IMPORT FUNCTIONS --------------------------

//------------------------------------------------------------

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
    //marginTop: android ? StatusBar.currentHeight + 10 : 10, //for ios its under SafeAreaView
  },
  InnerContainer: {
    //backgroundColor: "red",
    padding: 6,
    flex: 1,
  },
});
