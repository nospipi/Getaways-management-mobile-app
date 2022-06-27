//--------------- IMPORT MODULES ----------------------------
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import moment from "moment-timezone";
import { useContext, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { deleteBalanceTransaction } from "../../../../src/api/api";
import AppContext from "../../AppContext";

//--------------------------------------------------------------

const android = Platform.OS === "android" ? true : false;

export const BalanceItem = ({ data, loadTransactions }) => {
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isReceiptLoading, setIsReceiptLoading] = useState(false);
  const appContext = useContext(AppContext);
  const showMsgModal = appContext.functions.showMsgModal;
  return (
    <View style={styles.outerContainer}>
      <View style={styles.innerContainer}>
        <TouchableOpacity
          style={styles.trashContainer}
          onPress={() => {
            setIsDeleteLoading(true);
            deleteBalanceTransaction(
              data._id,
              appContext.functions.showMsgModal
            ).then(() => {
              loadTransactions();
            });
          }}
        >
          {isDeleteLoading ? (
            <ActivityIndicator size="small" color="black" />
          ) : (
            <FontAwesome name="trash-o" size={21} color="indianred" />
          )}
        </TouchableOpacity>
        <View style={styles.typeContainer}>
          <View style={styles.typeInnerContainer}>
            <Text
              style={{
                ...styles.typeText,
                color: data.type === "expense" ? "red" : "green",
              }}
            >
              {data.type}
            </Text>
          </View>
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.dateItem}>{moment(data.date).format("DD")}</Text>
          <Text style={styles.dateItem}>{moment(data.date).format("MMM")}</Text>
          <Text style={styles.dateItem}>
            {new Date(data.date).getFullYear()}
          </Text>
        </View>
        <View style={styles.nameAndAmountContainer}>
          <View style={styles.nameContainer}>
            <Text style={styles.nameText}>{data.user.name}</Text>
          </View>
          <View style={styles.amountContainer}>
            <Text style={styles.amountText}>{data.amount} €</Text>
          </View>
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>{data.description}</Text>
        </View>
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={() => {
            setIsReceiptLoading(true);
            if (data.receiptUrl) {
              appContext.functions.setReceiptUrl(data.receiptUrl);
              appContext.functions.toggleReceiptModalVisibility();
              setIsReceiptLoading(false);
            } else {
              showMsgModal("There is no receipt uploaded", false, false);
              setIsReceiptLoading(false);
            }
          }}
        >
          {isReceiptLoading ? (
            <ActivityIndicator size="small" color="black" />
          ) : (
            <Ionicons name="receipt-outline" size={22} color="#333333" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

//TODO swipe to delete

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: "white",
    padding: 4,
    height: 60,
    borderRadius: 5,
    marginBottom: 3,
    shadowColor: "black",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    flex: 1,
  },
  innerContainer: {
    flexDirection: "row",
    flex: 1,
  },
  trashContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "hsl(0, 0%, 93%)",
    height: "100%",
    marginRight: 1,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    flex: 2,
  },
  typeContainer: {
    backgroundColor: "hsl(0, 0%, 93%)",
    marginRight: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  typeInnerContainer: {
    transform: [{ rotate: "-90deg" }],
  },
  typeText: {
    fontFamily: android ? "Roboto" : "Avenir",
    fontSize: 11,
    textTransform: "capitalize",
    fontWeight: "600",
  },
  dateContainer: {
    //flex: 1,
    //borderLeftWidth: 1,
    marginRight: 1,
    backgroundColor: "hsl(0, 0%, 93%)",
    paddingHorizontal: 10,
    justifyContent: "center",
    height: "100%",
  },
  dateItem: {
    fontFamily: android ? "Roboto" : "Avenir",
    fontSize: 11,
  },
  nameAndAmountContainer: {
    //justifyContent: "space-between",
    //alignItems: "center",
    //backgroundColor: "lightgrey",
    //padding: 10,
    height: "100%",
    marginRight: 1,
    flex: 4,
  },
  nameContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    //paddingHorizontal: 10,
    backgroundColor: "hsl(0, 0%, 93%)",
    //borderBottomWidth: 1,
    //borderColor: "grey",
    marginBottom: 1,
  },
  amountContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    //paddingHorizontal: 10,
    backgroundColor: "hsl(0, 0%, 93%)",
  },
  nameText: {
    fontFamily: android ? "Roboto" : "Avenir",
    fontSize: 12,
    //textTransform: "capitalize",
    //fontWeight: "600",
  },
  amountText: {
    fontFamily: android ? "Roboto" : "Avenir",
    fontSize: 13,
    //textTransform: "capitalize",
    fontWeight: "700",
    color: "dodgerblue",
  },
  descriptionContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "hsl(0, 0%, 93%)",
    paddingHorizontal: 4,
    height: "100%",
    flex: 5,
    marginRight: 1,
  },
  descriptionText: {
    fontFamily: android ? "Roboto" : "Avenir",
    fontSize: 12,
    //textTransform: "capitalize",
    //fontWeight: "600",
  },

  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 2.2,
    backgroundColor: "hsl(0, 0%, 93%)",
    height: "100%",
    padding: 3,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  image: {
    width: "75%",
    height: "63%",
    borderWidth: 1,
    borderColor: "#666666",
    borderRadius: 2,
  },
});
