//--------------- IMPORT MODULES ----------------------------
import { AntDesign } from "@expo/vector-icons";

import { Dimensions, Image, Modal, StyleSheet, View } from "react-native";

import { useContext } from "react";
import AppContext from "../../AppContext";

//--------------------------------------------------------------

const { width, height } = Dimensions.get("window");

const downloadReceipt = (url) => {}; //TODO this

const BalanceReceiptModal = () => {
  const appContext = useContext(AppContext);
  return (
    <Modal
      animationType="fade"
      transparent
      visible={appContext.states.isReceiptModalVisible}
      presentationStyle="overFullScreen"
    >
      <View style={styles.viewWrapper}>
        <View style={styles.modalView}>
          <View style={styles.iconsWrapper}>
            {/* <Feather
              name="download"
              size={26}
              color="black"
              onPress={() => {
                downloadReceipt(appContext.states.receiptUrl);
              }}
            /> */}
            <AntDesign
              name="close"
              size={30}
              color="black"
              onPress={() =>
                appContext.functions.toggleReceiptModalVisibility()
              }
            />
          </View>
          <View style={styles.imageWrapper}>
            <Image
              style={styles.image}
              source={{
                uri: appContext.states.receiptUrl,
              }}
            ></Image>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default BalanceReceiptModal;

//---------------- COMPONENT STYLES ----------------------------------------------

const styles = StyleSheet.create({
  viewWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 3,
  },
  modalView: {
    //alignItems: "center",
    //justifyContent: "center",
    //flexDirection: "column",
    //alignSelf: "center",
    //height: 170,
    width: width * 0.85,
    backgroundColor: "rgb(242, 242, 242)",
    //borderWidth: 1,
    borderColor: "grey",
    borderRadius: 2,
    padding: 3,
  },
  iconsWrapper: {
    flexDirection: "row",
    //justifyContent: "space-between",
    justifyContent: "flex-end",
    //paddingHorizontal: 5,
    padding: 5,
    alignItems: "center",
    //marginBottom: 2,
  },
  imageWrapper: {
    width: "100%",
    height: height / 1.7,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  ghostIcon: {
    opacity: 0,
  },
});

//---------------------------------------------------------------------------------
