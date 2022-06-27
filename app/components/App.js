//--------------- IMPORT MODULES ----------------------------

import {
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { retrieveData } from "../../src/asyncStorageFunctions";
import AppContext from "./AppContext";

import { SET_LOGGED_AS } from "../../src/store/store";

import { ADMIN_ID } from "../../constants";
import EditActivityScreen from "../screens/admin/edit-activities/EditActivityScreen";
import EditAnnouncementsScreen from "../screens/admin/edit-announcements/EditAnnouncementsScreen";
import EditStaffScreen from "../screens/admin/edit-staff/EditStaffScreen";
import EditVehicleScreen from "../screens/admin/edit-vehicle/EditVehicleScreen";
import NewScheduleTaskScreen from "../screens/admin/new-schedule-task/NewScheduleTaskScreen";
import BalanceScreen from "../screens/BalanceScreen";
import HomeScreen from "../screens/HomeScreen";
import ScheduleScreen from "../screens/ScheduleScreen";
import ManageDevicesScreen from "../screens/staff/edit-devices/ManageDevicesScreen";
import StaffScreen from "../screens/StaffScreen";
import PickupsScreen from "./staff/schedule/PickupsScreen";

//--------------------------------------------------------------

const Stack = createNativeStackNavigator();

const App = () => {
  const store = useSelector((store) => store);
  const currentUser = store.data.currentUser;
  const isAdminPage = currentUser._id === ADMIN_ID;
  const [passwordAuthIsLoading, setPasswordAuthLoading] = useState(false);
  const [validationHasError, setValidationHasError] = useState(false);
  const [validationSuccesfull, setValidationSuccesfull] = useState(false);
  const [validationText, setValidationText] = useState("");
  const [requestedUser, setRequestedUser] = useState();
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [isStaffSelectionModalVisible, setIsStaffSelectionModalVisible] =
    useState(false);
  const [isMapsNavigationModalVisible, setIsMapsNavigationModalVisible] =
    useState(false);
  const [isAdminModalVisible, setOptionsModalVisible] = useState(false);
  const [isAnnouncementsModalVisible, setAnnouncementsModalVisible] =
    useState(false);
  const [isVehiclesModalVisible, setVehiclesModalVisible] = useState(false);
  const [isActivitiesModalVisible, setActivitiesModalVisible] = useState(false);
  const [isStaffModalVisible, setStaffModalVisible] = useState(false);
  const [isReceiptModalVisible, setIsReceiptModalVisible] = useState(false);
  const [
    isNewBalanceTransactionModalVisible,
    setIsNewBalanceTransactionModalVisible,
  ] = useState(false);
  const [isNewScheduleTaskModalVisible, setNewScheduleTaskModalVisible] =
    useState(false);

  const [receiptUrl, setReceiptUrl] = useState();

  const [isMsgModalVisible, setMsgModalVisible] = useState({
    msg: String(),
    isVisible: Boolean(),
    isSuccessfull: Boolean(),
  });

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleUserSelection = (user_id) => {
    if (currentUser._id === user_id) {
      setIsStaffSelectionModalVisible(false);
      navigation.navigate("Staff", {
        user: currentUser.name,
      });
    } else {
      setRequestedUser(user_id);
      setIsStaffSelectionModalVisible(false);
      appContext.functions.togglePasswordModalVisibility();
    }
  };

  const appContext = {
    states: {
      isPasswordModalVisible: isPasswordModalVisible,
      isStaffSelectionModalVisible: isStaffSelectionModalVisible,
      requestedUser: requestedUser,
      currentUser: currentUser,
      passwordAuthIsLoading: passwordAuthIsLoading,
      validationHasError: validationHasError,
      validationSuccesfull: validationSuccesfull,
      validationText: validationText,
      isMapsNavigationModalVisible: isMapsNavigationModalVisible,
      isAdminModalVisible: isAdminModalVisible,
      isStaffModalVisible: isStaffModalVisible,
      isVehiclesModalVisible: isVehiclesModalVisible,
      isActivitiesModalVisible: isActivitiesModalVisible,
      isAnnouncementsModalVisible: isAnnouncementsModalVisible,
      isNewBalanceTransactionModalVisible: isNewBalanceTransactionModalVisible,
      isNewScheduleTaskModalVisible: isNewScheduleTaskModalVisible,
      isMsgModalVisible: isMsgModalVisible,
      isReceiptModalVisible: isReceiptModalVisible,
      receiptUrl: receiptUrl,
    },
    functions: {
      setRequestedUser: setRequestedUser,
      setPasswordAuthLoading: setPasswordAuthLoading,
      setValidationText: setValidationText,
      setValidationHasError: setValidationHasError,
      handleUserSelection: handleUserSelection,
      toggleMapsNavigationModalVisibility: () => {
        setIsMapsNavigationModalVisible(!isMapsNavigationModalVisible);
      },
      togglePasswordModalVisibility: () => {
        setIsPasswordModalVisible(!isPasswordModalVisible);
      },
      toggleStaffSelectionModalVisibility: () => {
        setIsStaffSelectionModalVisible(!isStaffSelectionModalVisible);
      },
      toggleOptionsModalVisibility: () =>
        setOptionsModalVisible(!isAdminModalVisible),
      toggleAnnouncementsModalVisibility: () => {
        setAnnouncementsModalVisible(!isAnnouncementsModalVisible);
      },
      toggleVehiclesModalVisibility: () => {
        setVehiclesModalVisible(!isVehiclesModalVisible);
      },
      toggleActivitiesModalVisibility: () => {
        setActivitiesModalVisible(!isActivitiesModalVisible);
      },
      toggleStaffModalVisibility: () => {
        setStaffModalVisible(!isStaffModalVisible);
      },
      toggleNewBalanceTransactionModalVisibility: () => {
        setIsNewBalanceTransactionModalVisible(
          !isNewBalanceTransactionModalVisible
        );
      },
      toggleNewScheduleTaskModalVisibility: () => {
        setNewScheduleTaskModalVisible(!isNewScheduleTaskModalVisible);
      },
      showMsgModal: (msg, success) => {
        let hideTimeout;
        let showTimeout;
        if (isMsgModalVisible.isVisible === true) {
          clearTimeout(hideTimeout);

          setMsgModalVisible({
            isVisible: false,
            isSuccessfull: success,
          });

          setTimeout(() => {
            setMsgModalVisible({
              msg: msg,
              isVisible: true,
              isSuccessfull: success,
            });
          }, 100);

          hideTimeout = setTimeout(() => {
            setMsgModalVisible({
              isVisible: false,
              isSuccessfull: success,
            });
          }, 4000);
        } else {
          setMsgModalVisible({
            msg: msg,
            isVisible: true,
            isSuccessfull: success,
          });
          hideTimeout = setTimeout(() => {
            setMsgModalVisible({
              isVisible: false,
              isSuccessfull: success,
            });
          }, 4000);
        }
        //TODO cleanup timeout
      },
      toggleReceiptModalVisibility: () => {
        setIsReceiptModalVisible(!isReceiptModalVisible);
      },
      setReceiptUrl: (url) => {
        setReceiptUrl(url);
      },
    },
  };

  useEffect(() => {
    retrieveData("currentUser").then((value) => {
      if (value) {
        dispatch(SET_LOGGED_AS(JSON.parse(value)));
      }
    });
  }, []);

  return (
    <AppContext.Provider value={appContext}>
      <Stack.Navigator screenOptions={options}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Staff"
          component={StaffScreen}
          options={({ route, navigation }) => ({
            title: route.params.user,
            headerRight: () => (
              <TouchableOpacity
                onPress={() => {
                  appContext.functions.toggleOptionsModalVisibility();
                }}
                style={styles.icons}
              >
                {/* <Ionicons name="options" size={30} color="#262626" /> */}
                <FontAwesome name="navicon" size={23} color="#262626" />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Schedule"
          component={ScheduleScreen}
          options={{
            headerRight: isAdminPage
              ? () => (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("New task", {
                        title: "New task",
                        data: {
                          activity: null,
                          date: null,
                          vehicle: null,
                          crew: { drivers: [], escorts: [], guides: [] },
                          pickups: [],
                          details: null,
                        }, //formik expects as initial values,when param.title is Edit task,this comes from task item payload
                      });
                    }}
                    style={styles.icons}
                  >
                    <MaterialIcons name="add" size={30} color="#262626" />
                  </TouchableOpacity>
                )
              : null,
          }}
        />
        <Stack.Screen
          name="New task"
          component={NewScheduleTaskScreen}
          options={({ route, navigation }) => ({
            title: route.params.title,
          })}
        />
        <Stack.Screen
          name="Pickups"
          component={PickupsScreen}
          options={{
            headerRight: () => (
              <TouchableOpacity
                onPress={() => {
                  appContext.functions.toggleMapsNavigationModalVisibility();
                }}
                style={styles.icons}
              >
                {/* <Ionicons name="add" size={25} color="#262626" /> */}
                <MaterialCommunityIcons
                  name="google-maps"
                  size={30}
                  color="black"
                />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="Balance"
          component={BalanceScreen}
          options={{
            headerRight: () => (
              <TouchableOpacity
                onPress={() => {
                  appContext.functions.toggleNewBalanceTransactionModalVisibility();
                }}
                style={styles.icons}
              >
                {/* <Ionicons name="add" size={25} color="#262626" /> */}
                <MaterialIcons name="add" size={30} color="#262626" />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="Edit/Add staff"
          component={EditStaffScreen}
          options={{
            headerRight: () => (
              <TouchableOpacity
                onPress={() => {
                  appContext.functions.toggleStaffModalVisibility();
                }}
                style={styles.icons}
              >
                <MaterialIcons name="add" size={30} color="#262626" />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="Edit/Add vehicle"
          component={EditVehicleScreen}
          options={{
            headerRight: () => (
              <TouchableOpacity
                onPress={() => {
                  appContext.functions.toggleVehiclesModalVisibility();
                }}
                style={styles.icons}
              >
                <MaterialIcons name="add" size={30} color="#262626" />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="Edit/Add announcements"
          component={EditAnnouncementsScreen}
          options={{
            headerRight: () => (
              <TouchableOpacity
                onPress={() => {
                  appContext.functions.toggleAnnouncementsModalVisibility();
                }}
                style={styles.icons}
              >
                <MaterialIcons name="add" size={30} color="#262626" />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="Edit/Add activities"
          component={EditActivityScreen}
          options={{
            headerRight: () => (
              <TouchableOpacity
                onPress={() => {
                  appContext.functions.toggleActivitiesModalVisibility();
                }}
                style={styles.icons}
              >
                <MaterialIcons name="add" size={30} color="#262626" />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen name="Manage devices" component={ManageDevicesScreen} />
      </Stack.Navigator>
    </AppContext.Provider>
  );
};

const styles = StyleSheet.create({
  icons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

const options = {
  headerTitleAlign: "center",
  headerShadowVisible: false,
  headerStyle: {
    backgroundColor: "rgb(165, 147, 160)",
  },
  headerTintColor: "#fff",
  headerTitleStyle: {
    fontWeight: "bold",
  },
};

export default App;
