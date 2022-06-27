//--------------- IMPORT MODULES ----------------------------

import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import * as constants from "../../constants";
import LoadingScreen from "./LoadingScreen";
import CustomBottomMsgModal from "../components/CustomBottomMsgModal";
import DropdownSelectList from "../components/DropdownSelectList";
import { BalanceItem } from "../components/staff/balance/BalanceItem";
import BalanceReceiptModal from "../components/staff/balance/BalanceReceiptModal";
import NewBalanceTransactionFormModal from "../components/staff/balance/NewBalanceTransactionFormModal";
import { ADMIN_ID } from "../../constants";
import { fetchBalanceData, getBalanceTotals } from "../../src/api/api";

//------------------------------------------------------------

const android = Platform.OS === "android" ? true : false;

const BalanceScreen = () => {
  const flatlistRef = useRef();
  const [isComponentLoading, setIsComponentLoading] = useState(true);
  const [isTotalsLoading, setIsTotalsLoading] = useState(true);
  const [isListLoading, setIsListLoading] = useState(false);
  const currentUser = useSelector((store) => store.data.currentUser);
  const [balanceData, setBalanceData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userIdToFetch, setUserIdToFetch] = useState(currentUser._id);

  const [skipTransactions, setSkipTransactions] = useState(0);
  const [loadMoreText, setLoadMoreText] = useState("Load more");
  const [totals, setTotals] = useState({
    expensesTotal: 0,
    incomeTotal: 0,
  });

  const store = useSelector((store) => store);
  let admin = { ...store.data.entities.staff.find((i) => i._id === ADMIN_ID) };
  admin.name = "All staff";
  const staff = [
    admin,
    ...store.data.entities.staff.filter((i) => i.name !== "Admin"),
  ];

  //----------------------------------------------------------------------
  const [dropdownModalVisibility, setDropdownModalVisibility] = useState({
    staff: false,
    actions: false,
  });
  //------------------------------------------------------------------------

  const handleDropdownsVisibility = (dropdownName) => {
    // -- With this function i make sure only one dropdown is shown in component.
    // -- goal is to make state object have only one true,rest will be false,as many properties it might have..
    // -- component uses this state to show or hide the "dropdown" component
    /*
      state obj looks like this -->
{
  "actions": false,
  "staff": true,
}
*/
    let newObj = { ...dropdownModalVisibility }; //when its called,its creating a new obj...

    Object.keys(newObj).forEach((i) => {
      if (i === dropdownName) {
        //..if key === given name as argument..
        newObj[i] = !dropdownModalVisibility[dropdownName]; //..it toggles the value..
      } else {
        newObj[i] = false; //..everything else become false..
      }
    });

    setDropdownModalVisibility(newObj); //..finally set as new state..
    //..so when the dropdown button calls it,it will set all values false,except the one with given key..
    //..and when the dropdown calls it,with zero parameters,undefined is passed and it goes directly to ELSE condition and it sets everything to false.
  };

  const loadInitialTransactions = async () => {
    setIsListLoading(true);
    setIsTotalsLoading(true);
    setLoadMoreText("Load more");

    const totals = await getBalanceTotals(userIdToFetch).then((data) => data);
    const data = await fetchBalanceData(userIdToFetch, 0).then((data) => data);
    Promise.all([totals, data]).then(() => {
      setSkipTransactions(8);
      setIsListLoading(false);
      setIsTotalsLoading(false);
      setIsComponentLoading(false);

      setTotals(totals);
      setBalanceData([...data]);
      if (data.length === 0) {
        setLoadMoreText("No transactions !");
      }
      return;
    });
  };

  const loadMore = () => {
    setIsRefreshing(true);
    fetchBalanceData(userIdToFetch, skipTransactions).then((data) => {
      if (data.length === 0) {
        setLoadMoreText("No more transactions !");
        setIsRefreshing(false);
        setTimeout(() => {
          flatlistRef.current.scrollToEnd({ animated: true });
        }, 200);
      } else {
        setLoadMoreText("Load more");
        setSkipTransactions(skipTransactions + 8);
        setBalanceData([...balanceData, ...data]);
        setIsRefreshing(false);
        setTimeout(() => {
          flatlistRef.current.scrollToEnd({ animated: true });
        }, 200);
      }
    });
  };

  useEffect(() => {
    loadInitialTransactions();
  }, [userIdToFetch]);

  return isComponentLoading ? (
    <LoadingScreen loadingText={`Loading balance data...`} />
  ) : (
    <View style={styles.OuterContainer}>
      <View
        style={styles.InnerContainer}
        onPress={() => handleDropdownsVisibility()} //press outside dropdown hides them
      >
        <View style={styles.topContainer}>
          <View style={styles.totalsContainer}>
            <View style={{ ...styles.totalContainer, flex: 2 }}>
              {isTotalsLoading ? (
                <ActivityIndicator size="small" color="black" />
              ) : (
                <>
                  <Text
                    style={{ ...styles.totalContainerText, color: "#008000" }}
                  >
                    Income
                  </Text>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{ ...styles.totalContainerText, color: "#4d4d4d" }}
                    >
                      {totals.incomeTotal.toFixed(2)}€
                    </Text>
                  </View>
                </>
              )}
            </View>
            <View style={{ ...styles.totalContainer, flex: 2 }}>
              {isTotalsLoading ? (
                <ActivityIndicator size="small" color="black" />
              ) : (
                <>
                  <Text
                    style={{ ...styles.totalContainerText, color: "#ff3333" }}
                  >
                    Expenses
                  </Text>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{ ...styles.totalContainerText, color: "#4d4d4d" }}
                    >
                      {totals.expensesTotal.toFixed(2)}€
                    </Text>
                  </View>
                </>
              )}
            </View>
            <View
              style={{
                ...styles.totalContainer,
                flex: 2,
                borderLeftWidth: isTotalsLoading ? null : 1,
                borderLeftColor: "#666666",
              }}
            >
              {isTotalsLoading ? (
                <ActivityIndicator size="small" color="black" />
              ) : (
                <>
                  <Text
                    style={{ ...styles.totalContainerText, color: "#4d4d4d" }}
                  >
                    Balance
                  </Text>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        ...styles.totalContainerText,
                        color: "dodgerblue",
                      }}
                    >
                      {(totals.incomeTotal - totals.expensesTotal).toFixed(2)}€
                    </Text>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>
        {currentUser._id === constants.ADMIN_ID ? (
          <View style={styles.adminControls}>
            <View style={{ flex: 3, marginRight: 5, height: "100%" }}>
              <DropdownSelectList
                items={staff.map((i) => {
                  return {
                    label: i.name,
                    value: i._id,
                  };
                })} //ARRAY OF --> {label:"it_will_show",value:"it_will_send_back"}
                selected={null} //value if passed,will trigger selection callback at component mount.
                placeholder={"Show by staff"}
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
                onSelect={setUserIdToFetch}
                // sendButtonState={(isShown) => {
                //   console.log(isShown);
                // }}
              />
            </View>
            <View style={{ flex: 2, height: "100%" }}>
              <DropdownSelectList
                items={[
                  {
                    label: "Reset",
                    value: "Reset",
                  },
                ]} //ARRAY OF --> {label:"it_will_show",value:"it_will_send_back"}
                selected={null} //value if passed,will trigger selection callback at component mount.
                placeholder={"Actions"}
                shouldChangePlaceholder={false}
                renderSearch={false}
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
                        justifyContent: "center",
                      },
                      pressed ? { backgroundColor: "white" } : {},
                    ]}
                    onPress={() => {
                      // console.log(item.value);
                      Alert.alert(
                        item.value,
                        "This feature will be enabled in future updates"
                      );
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
                onSelect={setUserIdToFetch}
                // sendButtonState={(isShown) => {
                //   console.log(isShown);
                // }}
              />
            </View>
          </View>
        ) : null}
        <View style={styles.listContainer}>
          {isListLoading ? (
            <ActivityIndicator size="large" color="black" />
          ) : (
            <FlatList
              ref={flatlistRef}
              data={balanceData}
              keyExtractor={(balanceData, index) => index}
              onRefresh={() => loadInitialTransactions()}
              refreshing={isListLoading}
              renderItem={({ item }) => (
                <BalanceItem
                  data={item}
                  loadTransactions={loadInitialTransactions}
                />
              )}
              ListFooterComponent={
                <Pressable
                  onPress={() => {
                    loadMore();
                  }}
                  style={{
                    ...styles.loadMoreWrapper,
                    backgroundColor:
                      loadMoreText === "No transactions !" ||
                      loadMoreText === "No more transactions !"
                        ? "#e6e6e6"
                        : "null",
                    borderWidth:
                      loadMoreText === "No transactions !" ||
                      loadMoreText === "No more transactions !"
                        ? null
                        : 2,
                    marginTop: balanceData.length === 0 ? null : 2,
                  }}
                >
                  {isRefreshing ? (
                    <ActivityIndicator size="small" color="black" />
                  ) : (
                    <Text
                      style={{
                        ...styles.loadMoreWrapperText,
                        color:
                          loadMoreText === "No transactions !" ||
                          loadMoreText === "No more transactions !"
                            ? "indianred"
                            : "whitesmoke",
                      }}
                    >
                      {loadMoreText}
                    </Text>
                  )}
                </Pressable>
              }
            />
          )}
        </View>
      </View>
      <BalanceReceiptModal />
      <NewBalanceTransactionFormModal
        loadTransactions={loadInitialTransactions}
      />
      <CustomBottomMsgModal />
    </View>
  );
};

export default BalanceScreen;

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
  adminControls: {
    flexDirection: "row",
    marginBottom: 5,
    height: 50,
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
});
