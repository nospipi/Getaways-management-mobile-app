//--------------- IMPORT MODULES --------------------------

import { AntDesign } from "@expo/vector-icons";
import { useContext, useEffect } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

//---------------- IMPORT COMPONENTS -------------------------

import AnnouncementContainer from "../components/announcements/home_page/Announcements";
import CustomPasswordPrompt from "../components/CustomPasswordPrompt";
import CustomStaffSelectionModal from "../components/staff/home/CustomStaffSelectionModal";
import TopLogoContainer from "../components/top_logos/TopLogoContainer";

//---------------- IMPORT FUNCTIONS ---------------------------

import { fetchEntities } from "../../src/api/api";
import { TOGGLE_IS_LOADING } from "../../src/store/store";
import AppContext from "../components/AppContext";

//--------------------------------------------------------------

const HomeScreen = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((store) => store.data.isLoading);

  const appContext = useContext(AppContext);

  useEffect(() => {
    dispatch(TOGGLE_IS_LOADING());
    dispatch(fetchEntities).then(() => {
      dispatch(TOGGLE_IS_LOADING());
    });
  }, []);

  return (
    <View style={styles.OuterContainer}>
      <TopLogoContainer />
      <View
        style={[
          styles.InnerContainer,
          { justifyContent: isLoading ? "space-between" : "flex-start" },
        ]}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (!isLoading) {
              appContext.functions.toggleStaffSelectionModalVisibility();
            }
          }}
        >
          <Text style={styles.buttonText}>Login</Text>
          <AntDesign name="lock" size={20} color="whitesmoke" />
        </TouchableOpacity>
        {isLoading ? (
          <ActivityIndicator size="large" color="whitesmoke" />
        ) : (
          <AnnouncementContainer />
        )}
        {isLoading ? <View style={styles.ghost}></View> : null}
      </View>
      <CustomPasswordPrompt />
      <CustomStaffSelectionModal />
    </View>
  );
};

export default HomeScreen;

const width = Dimensions.get("window").width;
const ios = Platform.OS === "ios" ? true : false;
const android = Platform.OS === "android" ? true : false;
const styles = StyleSheet.create({
  OuterContainer: {
    backgroundColor: "#a593a0",
    flexGrow: 1,
    paddingTop: android ? StatusBar.currentHeight + 10 : 10, //for ios its under SafeAreaView
  },
  InnerContainer: {
    paddingLeft: 15,
    paddingRight: 15,
    flex: 1,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "dodgerblue",
    borderRadius: 4,
    height: 60,
    width: "100%",
    marginBottom: 5,
  },
  buttonText: {
    color: "whitesmoke",
    fontSize: 19,
    fontWeight: "600",
    fontFamily: android ? "Roboto" : "Avenir",
    marginRight: 5,
  },
  ghost: {
    //flex: 1,
    //backgroundColor: "red",
  },
});
