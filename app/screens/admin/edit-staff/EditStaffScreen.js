//--------------- IMPORT MODULES ----------------------------

import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

//---------------- IMPORT COMPONENTS --------------------------

import AppContext from "../../../components/AppContext";
import CustomBottomMsgModal from "../../../components/CustomBottomMsgModal";
import EditStaffListItem from "./EditStaffListItem";
import NewStaffMemberFormModal from "./NewStaffMemberFormModal";

//---------------- IMPORT FUNCTIONS --------------------------

//------------------------------------------------------------

const EditStaffScreen = () => {
  const navigation = useNavigation();
  const routes = navigation.getState().routeNames;
  const dispatch = useDispatch();
  const isLoading = useSelector((store) => store.data.isLoading);
  const appContext = useContext(AppContext);
  const staff = useSelector((store) => store.data.entities.staff);
  const [isModalVisible, setIsModalVisible] = useState(false);

  //-------------- ONLY ONE STAFF MEMBER COMPONENT IS "EXPANDED" AT ONCE ---------
  const [expandedStaff, setExpandedStaff] = useState(
    staff.reduce(
      (obj, staffMember) => ({
        ...obj,
        [staffMember._id]: false,
      }),
      {}
    )

    //EXAMPLE BELOW
    // Object {
    //   "6212c140d9860a411f13783f": false,
    //   "6212c140d9860a411f13843f": false,
    //   "6212c140d9860a411f19743f": false,
    // } MAKE OBJECT FOR EVERY MEMBER WITH ID AS KEY
  );

  const setNewExpandedState = (id, state) => {
    let newExpandedStaff = { ...expandedStaff }; //deep copy object for immutability
    Object.keys(newExpandedStaff).forEach((id) => {
      newExpandedStaff[id] = false;
    }); //change all expanded states to false
    newExpandedStaff[id] = state; //change given id to given value
    setExpandedStaff(newExpandedStaff); //set original state to new state
  };

  //------------------------------------------------------------------------------

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      enabled={true}
      style={{ flex: 1 }}
    >
      <View style={styles.OuterContainer}>
        <View style={styles.InnerContainer}>
          <FlatList
            data={staff}
            keyExtractor={(staff, index) => index}
            renderItem={({ item }) => (
              <EditStaffListItem
                data={item}
                expanded={expandedStaff[item._id]}
                setNewExpandedState={setNewExpandedState}
              />
            )}
          />
        </View>
        <NewStaffMemberFormModal />
        <CustomBottomMsgModal />
      </View>
    </KeyboardAvoidingView>
  );
};

export default EditStaffScreen;

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
