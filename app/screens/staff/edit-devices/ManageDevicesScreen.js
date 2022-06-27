//--------------- IMPORT MODULES ----------------------------

import { FlatList, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import CustomBottomMsgModal from "../../../components/CustomBottomMsgModal";
import DevicesListItem from "./DevicesListItem";

//------------------------------------------------------------

const ManageDevicesScreen = () => {
  const devices = useSelector(
    (store) =>
      store.data.entities.staff.find(
        (staffMember) =>
          staffMember._id === useSelector((store) => store.data.currentUser._id)
      ).loggedDevices
  );

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
  },
  InnerContainer: {
    padding: 6,
    flex: 1,
  },
});
