//--------------- IMPORT MODULES ----------------------------

import { FontAwesome } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useContext, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import * as constants from "../../constants";
import { useDidMountEffect } from "../../customHooks";
import AppContext from "../components/AppContext";
import CustomBottomMsgModal from "../components/CustomBottomMsgModal";
import DropdownSelectList from "../components/DropdownSelectList";
import { ScheduleItem } from "../components/staff/schedule/ScheduleItem";
import ShowByDateSelectionModal from "../components/staff/schedule/ShowByDateSelectionModal";
import LoadingScreen from "./LoadingScreen";
import { fetchScheduleData } from "../../src/api/api";

//------------------------------------------------------------
import moment from "moment-timezone";
import { ADMIN_ID } from "../../constants";

const android = Platform.OS === "android" ? true : false;
const ScheduleScreen = () => {
  const flatlistRef = useRef();
  const [isComponentLoading, setIsComponentLoading] = useState(true);
  const [isListLoading, setIsListLoading] = useState(true);
  const [isDateModalVisible, setIsDateModalVisible] = useState(false);
  const currentUser = useSelector((store) => store.data.currentUser);
  const [start_date, setStartDate] = useState(null);
  const [end_date, setEndDate] = useState(null);
  const [scheduleData, setScheduleData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userIdToFetch, setUserIdToFetch] = useState(currentUser._id);
  const [skipTransactions, setSkipTransactions] = useState(0);
  const [loadMoreText, setLoadMoreText] = useState("Load more");
  const isFocused = useIsFocused();
  const appContext = useContext(AppContext);
  const showMsgModal = appContext.functions.showMsgModal;

  //----------------------------------------------------------------------

  const store = useSelector((store) => store);
  let admin = { ...store.data.entities.staff.find((i) => i._id === ADMIN_ID) };
  admin.name = "All staff";
  const staff = [
    admin,
    ...store.data.entities.staff.filter((i) => i.name !== "Admin"),
  ];
  const isAdminPage = currentUser._id === constants.ADMIN_ID;
  const selectedUserName =
    store.data.entities.staff.find((user) => user._id === userIdToFetch)
      .name === "Admin"
      ? "All"
      : store.data.entities.staff.find((user) => user._id === userIdToFetch)
          .name;
  const hasDateSelection = start_date && end_date ? true : false;
  const datesAreEqual =
    moment(start_date).utc().format("DDMMYY") ===
    moment(end_date).utc().format("DDMMYY")
      ? true
      : false;
  //------------------------------------------------------------------------

  const loadInitialTasks = async () => {
    setIsListLoading(true);
    setLoadMoreText("Load more");
    return fetchScheduleData(
      userIdToFetch,
      0,
      start_date,
      end_date,
      showMsgModal
    ).then((data) => {
      setSkipTransactions(8);
      setScheduleData(data);
      setIsListLoading(false);
      setIsComponentLoading(false);

      if (data.length === 0) {
        setLoadMoreText("Selection returned 0 tasks !");
      }
      return;
    });
  };

  useDidMountEffect(() => {
    loadInitialTasks();
  }, [userIdToFetch]); // it runs only when dependencies change state and not on initial render --> https://stackoverflow.com/a/55075818/14718856 --> https://stackoverflow.com/a/57941438

  useEffect(() => {
    if (isFocused) {
      loadInitialTasks();
    } //runs on component load and every time isFocused becomes true (navigated to this screen)
  }, [isFocused]);

  const loadMore = () => {
    setIsRefreshing(true);
    fetchScheduleData(
      userIdToFetch,
      skipTransactions,
      start_date,
      end_date,
      showMsgModal
    ).then((data) => {
      if (data.length === 0) {
        setLoadMoreText("No more tasks for current selection !");
        setIsRefreshing(false);
        setTimeout(() => {
          flatlistRef.current.scrollToEnd({ animated: true });
        }, 200);
      } else {
        setLoadMoreText("Load more");
        setSkipTransactions(skipTransactions + 8);
        setScheduleData([...scheduleData, ...data]);
        setIsRefreshing(false);
        setTimeout(() => {
          flatlistRef.current.scrollToEnd({ animated: true });
        }, 200);
      }
    });
  };

  return isComponentLoading ? (
    <LoadingScreen loadingText={`Loading schedule data...`} />
  ) : (
    <View style={styles.OuterContainer}>
      <View style={styles.InnerContainer}>
        <View style={styles.selectionControls}>
          {currentUser._id === constants.ADMIN_ID ? (
            <View style={{ flex: 3, marginRight: 5 }}>
              <DropdownSelectList
                items={staff.map((i) => {
                  return {
                    label: i.name,
                    value: i._id,
                  };
                })} //ARRAY OF --> {label:"it_will_show",value:"it_will_send_back"}
                selected={null} //value if passed,will trigger selection callback at component mount.
                placeholder={"All staff"}
                shouldChangePlaceholder={true}
                renderSearch
                buttonContainerStyles={styles.buttonContainer}
                roundCorners={5}
                buttonStyles={styles.button}
                placeholderTextStyles={styles.placeholderTextStyles}
                showsVerticalScrollIndicator={true}
                inputSearchStyle={styles.inputSearchStyle}
                dropdownContainerStyles={styles.dropdownContainerStyles}
                maxHeight={400}
                renderItem={(
                  item,
                  selectedItem,
                  setSelectedItem,
                  dropDownRef
                ) => (
                  <Pressable
                    style={({ pressed }) => [
                      {
                        ...styles.items,
                        width: "100%",
                      },
                      pressed ? { backgroundColor: "white" } : {},
                    ]}
                    onPress={() => {
                      setSelectedItem(item.value);
                      //onSelect(item.value);
                      dropDownRef.current.close();
                    }}
                  >
                    <Text
                      style={{
                        textTransform: "capitalize",
                        color: "black",
                        alignSelf: "center",
                        fontFamily: android ? "Roboto" : "Avenir",
                        fontSize: 14,
                      }}
                    >
                      {item.label}
                    </Text>
                    {selectedItem === item.value ? (
                      <FontAwesome name="check" size={13} color="darkgreen" />
                    ) : null}
                  </Pressable>
                )}
                flatListProps={
                  {
                    // ItemSeparatorComponent: () => (
                    //   <View
                    //     style={{
                    //       marginVertical: 5,
                    //     }}
                    //   ></View>
                    // ),
                    // refreshControl:
                    // <RefreshControl
                    // refreshing={false}
                    // onRefresh={() => { }}
                    // />
                    // ,
                    // onEndReachedThreshold: 0.5,
                    // onEndReached: () => {
                    //   console.log("the end");
                    // },
                    //style: {},
                    //ListFooterComponent: <Text>csdcsdc</Text>,
                  }
                }
                onSelect={(userIdToFetch) => {
                  setUserIdToFetch(userIdToFetch);
                }}
                // sendButtonState={(isShown) => {
                //   console.log(isShown);
                // }}
              />
            </View>
          ) : null}
          <Pressable
            style={{
              flex: 2,
              backgroundColor: "#e6e6e6",
              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              setIsDateModalVisible(true);
            }}
          >
            <Text style={styles.text}>
              {hasDateSelection
                ? datesAreEqual
                  ? moment(start_date).utc().format("DD MMM YY")
                  : moment(start_date).utc().format("DD MMM YY") +
                    " - " +
                    moment(end_date).utc().format("DD MMM YY")
                : "All dates"}
            </Text>
          </Pressable>
        </View>

        <View style={styles.listContainer}>
          {isListLoading ? (
            <ActivityIndicator size="large" color="black" />
          ) : (
            <FlatList
              ref={flatlistRef}
              data={scheduleData}
              showsVerticalScrollIndicator={false}
              onRefresh={() => loadInitialTasks()}
              refreshing={isListLoading}
              keyExtractor={(i, index) => index}
              renderItem={({ item }) => (
                <ScheduleItem
                  isAdminPage={isAdminPage}
                  loadInitialTasks={loadInitialTasks}
                  data={item}
                />
              )}
              ListFooterComponent={
                <TouchableOpacity
                  onPress={() => {
                    loadMore();
                  }}
                  style={{
                    ...styles.loadMoreWrapper,
                    backgroundColor: "#796a74",

                    marginTop: scheduleData.length === 0 ? null : 2,
                  }}
                >
                  {isRefreshing ? (
                    <ActivityIndicator size="small" color="black" />
                  ) : (
                    <Text
                      style={{
                        ...styles.loadMoreWrapperText,
                        color:
                          loadMoreText === "No tasks !" ||
                          loadMoreText === "No more tasks !"
                            ? "indianred"
                            : "whitesmoke",
                      }}
                    >
                      {loadMoreText}
                    </Text>
                  )}
                </TouchableOpacity>
              }
            />
          )}
        </View>
      </View>
      <ShowByDateSelectionModal
        visible={isDateModalVisible}
        hideModal={() => setIsDateModalVisible(false)}
        start_date={start_date}
        end_date={end_date}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        loadInitialTasks={loadInitialTasks}
      />
      <CustomBottomMsgModal />
    </View>
  );
};

export default ScheduleScreen;

const styles = StyleSheet.create({
  OuterContainer: {
    flex: 1,
    backgroundColor: "#a593a0",
  },
  InnerContainer: {
    justifyContent: "flex-start",
    padding: 10,
    flex: 1,
  },
  topContainer: {},
  totalsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e6e6e6",
    height: 70,
    borderRadius: 4,
    marginBottom: 5,
  },
  totalContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  totalContainerText: {
    color: "whitesmoke",
    fontFamily: android ? "Roboto" : "Avenir",
    fontSize: 18,
    fontWeight: "700",
  },
  selectionControls: {
    flexDirection: "row",
    height: 50,
    marginBottom: 5,
  },
  dropdownModalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
  },
  listContainer: {
    flex: 1,
    justifyContent: "center",
  },
  naviconContainer: {
    backgroundColor: "#e6e6e6",
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    flex: 1,
    height: 50,
    marginLeft: 5,
  },
  loadMoreWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
    borderColor: "darkgrey",
    height: 45,
    borderRadius: 5,
  },
  loadMoreWrapperText: {
    color: "whitesmoke",
    fontFamily: android ? "Roboto" : "Avenir",
    fontSize: 15,
    fontWeight: "700",
  },
  buttonContainer: {
    height: "100%",
    backgroundColor: "#e6e6e6",
    justifyContent: "center",
  },
  dropdownContainerStyles: {
    marginTop: 8,
    padding: 5,
    paddingBottom: 2,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
  },
  button: {
    paddingHorizontal: 13,
    width: "100%",
    alignSelf: "center",
  },
  placeholderTextStyles: {
    color: "black",
    alignSelf: "center",
    fontFamily: android ? "Roboto" : "Avenir",
    fontSize: 14,
  },
  inputSearchStyle: {
    borderWidth: 0.5,
    borderColor: "#DDDDDD",
    paddingHorizontal: 10,
    marginBottom: 5,
    height: 40,
    color: "black",
    fontFamily: android ? "Roboto" : "Avenir",
    fontSize: 14,
  },
  items: {
    backgroundColor: "rgb(235, 235, 235)",
    marginBottom: 2,
    height: 50,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  text: {
    fontFamily: android ? "Roboto" : "Avenir",
    fontSize: 13,
    alignSelf: "center",
  },
});
