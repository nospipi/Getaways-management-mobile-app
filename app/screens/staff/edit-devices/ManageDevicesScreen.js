//--------------- IMPORT MODULES ----------------------------

import { FlatList, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";

//---------------- IMPORT COMPONENTS --------------------------

import CustomBottomMsgModal from "../../../components/CustomBottomMsgModal";
import DevicesListItem from "./DevicesListItem";

//---------------- IMPORT FUNCTIONS --------------------------

//------------------------------------------------------------

const ManageDevicesScreen = () => {
  const devices = useSelector(
    (store) =>
      store.data.entities.staff.find(
        (staffMember) =>
          staffMember._id === useSelector((store) => store.data.currentUser._id)
      ).loggedDevices
  );
  //------------------------------------------------------------------------------

  return (
    <View style={styles.OuterContainer}>
      <View style={styles.InnerContainer}>
        <FlatList
          data={devices}
          keyExtractor={(device, index) => index}
          renderItem={({ item }) => <DevicesListItem data={item} />}
        />
      </View>
      <CustomBottomMsgModal />
    </View>
  );
};

export default ManageDevicesScreen;

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
