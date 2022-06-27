//--------------- IMPORT MODULES ----------------------------

import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { Formik } from "formik";
import { useContext, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { addActivity } from "../../../../src/api/api";
import AppContext from "../../../components/AppContext";
//--------------------------------------------------------------

const android = Platform.OS === "android" ? true : false;
const { width } = Dimensions.get("window");

const NewActivityFormModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const appContext = useContext(AppContext);
  const dispatch = useDispatch();

  return (
    <Modal
      animationType="slide"
      visible={appContext.states.isActivitiesModalVisible}
      //presentationStyle="fullScreen"
      transparent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        enabled={true}
        style={styles.viewWrapper}
      >
        <View style={styles.modalView}>
          <Formik
            enableReinitialize
            initialValues={{ type: "" }}
            onSubmit={(values) => {
              setIsLoading(true);
              addActivity(
                values.type,
                appContext.functions.showMsgModal,
                appContext.functions.toggleActivitiesModalVisibility,
                dispatch
              ).then((result) => {
                setIsLoading(false);
              });
            }}
          >
            {({ handleChange, handleSubmit, errors }) => (
              <>
                <View style={styles.topWrapper}>
                  <AntDesign name="close" size={27} style={styles.ghostIcon} />
                  <Text style={styles.labelText}>New activity</Text>
                  <AntDesign
                    name="close"
                    size={27}
                    color="black"
                    onPress={() =>
                      appContext.functions.toggleActivitiesModalVisibility()
                    }
                  />
                </View>

                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    autoFocus
                    placeholder="Activity title"
                    keyboardType="default"
                    onChangeText={handleChange("type")}
                  ></TextInput>
                </View>
                <View style={styles.bottomWrapper}>
                  <TouchableOpacity
                    style={styles.submitBtn}
                    onPress={handleSubmit}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="black" />
                    ) : (
                      <FontAwesome name="check" size={24} color="darkgreen" />
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Formik>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default NewActivityFormModal;

//---------------- COMPONENT STYLES ----------------------------------------------

const styles = StyleSheet.create({
  viewWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  modalView: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    alignSelf: "center",
    width: width * 0.8,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "dodgerblue",
  },
  topWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#d9d9d9",
    width: "100%",
    height: 50,
    padding: 10,
    borderTopStartRadius: 4,
    borderTopEndRadius: 4,
  },
  ghostIcon: {
    opacity: 0,
  },
  inputWrapper: {
    flexDirection: "row",
    height: 60,
  },
  input: {
    flex: 1,
    textAlign: "center",
    borderColor: "#333333",
    backgroundColor: "white",
    padding: 10,
  },

  labelText: {
    color: "#262626",
    fontSize: 18,
    fontWeight: "600",
    alignSelf: "center",
    fontFamily: android ? "Roboto" : "Avenir",
  },
  bottomWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  submitBtn: {
    justifyContent: "center",
    alignItems: "center",
    flex: 2,
    backgroundColor: "#d9d9d9",
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    height: 50,
    padding: 4,
  },
});

//---------------------------------------------------------------------------------
