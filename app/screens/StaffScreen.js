//--------------- IMPORT MODULES ----------------------------

import { StyleSheet, View } from "react-native";

import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

//---------------- IMPORT COMPONENTS --------------------------

import AppContext from "../components/AppContext";
import CustomButton from "../components/CustomButton";
import CustomAdminModal from "../components/CustomOptionsModal";
import TopLogoContainer from "../components/top_logos/TopLogoContainer";
import LoadingScreen from "./LoadingScreen";

//---------------- IMPORT FUNCTIONS --------------------------

import { setNotificationsToken } from "../../src/api/api";

//------------------------------------------------------------

const android = Platform.OS === "android" ? true : false;

const StaffScreen = ({
  route: {
    params: { user }, //DESTRUCTURING FROM SCREENOPTIONS PROPS OBJECT
  },
  navigation,
}) => {
  const isLoading = useSelector((store) => store.data.isLoading);
  const currentUser = useSelector((store) => store.data.currentUser);
  const appContext = useContext(AppContext);
  const dispatch = useDispatch();
  //console.log(navigation);
  useEffect(() => {
    setNotificationsToken(currentUser._id, dispatch);
  }, []);

  return isLoading ? (
    <LoadingScreen loadingText={`Loading ${user} data...`} />
  ) : (
    <View style={styles.OuterContainer}>
      <TopLogoContainer />
      <View style={styles.InnerContainer}>
        <View style={styles.buttonArea}>
          <CustomButton isNavigationBtn={true} text={"Schedule"} />
          <CustomButton isNavigationBtn={true} text={"Balance"} />
          <CustomButton isNavigationBtn={true} text={"Fuel"} />
          <CustomButton isNavigationBtn={true} text={"Fleet"} />
        </View>
      </View>
      <CustomAdminModal
        visible={appContext.states.isAdminModalVisible}
        toggleModalVisibility={() =>
          appContext.functions.toggleAdminModalVisibility()
        }
      />
    </View>
  );
};

export default StaffScreen;

const styles = StyleSheet.create({
  OuterContainer: {
    flex: 1,
    backgroundColor: "#a593a0",
    //marginTop: android ? StatusBar.currentHeight + 10 : 10, //for ios its under SafeAreaView
  },
  InnerContainer: {
    //backgroundColor: "red",
    justifyContent: "space-between",
    padding: 6,
    flex: 1,
  },
  buttonArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
});
