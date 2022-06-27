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
import EditActivityListItem from "./EditActivityListItem";
import NewActivityFormModal from "./NewActivityFormModal";

//---------------- IMPORT FUNCTIONS --------------------------

//------------------------------------------------------------

const EditActivityScreen = () => {
  const navigation = useNavigation();
  const routes = navigation.getState().routeNames;
  const dispatch = useDispatch();
  const isLoading = useSelector((store) => store.data.isLoading);
  const appContext = useContext(AppContext);
  const activities = useSelector((store) => store.data.entities.activities);

  //-------------- ONLY ONE VEHICLE COMPONENT IS "EXPANDED" AT ONCE ---------
  const [expandedActivity, setExpandedActivity] = useState(
    activities.reduce(
      (obj, activity) => ({
        ...obj,
        [activity._id]: false,
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
    let newExpandedActivities = { ...expandedActivity }; //deep copy object for immutability
    Object.keys(newExpandedActivities).forEach((id) => {
      newExpandedActivities[id] = false;
    }); //change all expanded states to false
    newExpandedActivities[id] = state; //change given id to given value
    setExpandedActivity(newExpandedActivities); //set original state to new state
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
            data={activities}
            keyExtractor={(vehicles, index) => index}
            renderItem={({ item }) => (
              <EditActivityListItem
                data={item}
                expanded={expandedActivity[item._id]}
                setNewExpandedState={setNewExpandedState}
              />
            )}
          />
        </View>
        <NewActivityFormModal />
        <CustomBottomMsgModal />
      </View>
    </KeyboardAvoidingView>
  );
};

export default EditActivityScreen;

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
