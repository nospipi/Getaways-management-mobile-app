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
import AppContext from "../../../components/AppContext";
import CustomBottomMsgModal from "../../../components/CustomBottomMsgModal";
import EditVehicleListItem from "./EditVehicleListItem";
import NewVehicleFormModal from "./NewVehicleFormModal";

//------------------------------------------------------------

const EditVehicleScreen = () => {
  const navigation = useNavigation();
  const routes = navigation.getState().routeNames;
  const dispatch = useDispatch();
  const isLoading = useSelector((store) => store.data.isLoading);
  const appContext = useContext(AppContext);
  const vehicles = useSelector((store) => store.data.entities.vehicles);

  //-------------- ONLY ONE VEHICLE COMPONENT IS "EXPANDED" AT ONCE ---------
  const [expandedVehicle, setExpandedVehicle] = useState(
    vehicles.reduce(
      (obj, vehicle) => ({
        ...obj,
        [vehicle._id]: false,
      }),
      {}
    )
  );

  const setNewExpandedState = (id, state) => {
    let newExpandedVehicles = { ...expandedVehicle }; //deep copy object for immutability
    Object.keys(newExpandedVehicles).forEach((id) => {
      newExpandedVehicles[id] = false;
    }); //change all expanded states to false
    newExpandedVehicles[id] = state; //change given id to given value
    setExpandedVehicle(newExpandedVehicles); //set original state to new state
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
            data={vehicles}
            keyExtractor={(vehicles, index) => index}
            renderItem={({ item }) => (
              <EditVehicleListItem
                data={item}
                expanded={expandedVehicle[item._id]}
                setNewExpandedState={setNewExpandedState}
              />
            )}
          />
        </View>
        <NewVehicleFormModal />
        <CustomBottomMsgModal />
      </View>
    </KeyboardAvoidingView>
  );
};

export default EditVehicleScreen;

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
