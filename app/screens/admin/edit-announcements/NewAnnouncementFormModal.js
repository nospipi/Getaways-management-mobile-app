//--------------- IMPORT MODULES ----------------------------

import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { useContext, useState } from "react";
import { useDispatch } from "react-redux";

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
import BouncyCheckbox from "react-native-bouncy-checkbox";

import { Formik } from "formik";
import { publishAnnouncement } from "../../../../src/api/api";
import AppContext from "../../../components/AppContext";
//--------------------------------------------------------------

const android = Platform.OS === "android" ? true : false;
const { width } = Dimensions.get("window");

const NewAnnouncementFormModal = () => {
  const [isCritical, setIsCritical] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const appContext = useContext(AppContext);
  const dispatch = useDispatch();
  return (
    <Modal
      animationType="slide"
      visible={appContext.states.isAnnouncementsModalVisible}
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
            initialValues={{ message: "", critical: isCritical }}
            onSubmit={(values) => {
              setIsLoading(true);
              publishAnnouncement(
                values.message,
                values.critical,
                appContext.functions.showMsgModal,
                appContext.functions.toggleAnnouncementsModalVisibility,
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
                  <Text style={styles.labelText}>New announcement</Text>
                  <AntDesign
                    name="close"
                    size={27}
                    color="black"
                    style={styles.closeBtn}
                    onPress={() =>
                      appContext.functions.toggleAnnouncementsModalVisibility()
                    }
                  />
                </View>

                <TextInput
                  autoFocus
                  style={styles.textArea}
                  multiline={true}
                  numberOfLines={20}
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={handleChange("message")}
                />
                <View style={styles.bottomWrapper}>
                  <View style={styles.checkboxWrapper}>
                    <BouncyCheckbox
                      //value={isSelected}
                      onPress={(value) => {
                        setIsCritical(value);
                      }}
                      isChecked={isCritical}
                      //text="Synthetic Checkbox"
                      style={styles.checkbox}
                      fillColor="indianred"
                    />
                    <Text
                      style={[
                        styles.checkBoxLabelText,
                        {
                          color: isCritical ? "indianred" : "#4d4d4d",
                          textDecorationLine: isCritical
                            ? "none"
                            : "line-through",
                          //fontWeight: isCritical ? "700" : "600",
                        },
                      ]}
                    >
                      Important
                    </Text>
                  </View>
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

export default NewAnnouncementFormModal;

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
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "dodgerblue",
    //padding: 5,
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
  inputWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  textArea: {
    height: 200,
    textAlignVertical: "top",
    backgroundColor: "hsl(0, 0%, 92%)",
    width: "100%",
    padding: 6,
    marginBottom: 2,
    fontSize: 17,
  },
  ghostIcon: {
    opacity: 0,
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
  checkboxWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "hsl(0, 0%, 93%)",
    borderBottomLeftRadius: 4,
    flex: 4,
    height: 50,
    marginEnd: 2,
    padding: 4,
  },
  checkbox: {
    alignSelf: "center",
  },
  checkBoxLabelText: {
    color: "#262626",
    fontSize: 19,
    fontWeight: "600",
    fontFamily: android ? "Roboto" : "Avenir",
  },
  submitBtn: {
    justifyContent: "center",
    alignItems: "center",
    flex: 2,
    backgroundColor: "hsl(0, 0%, 93%)",
    borderBottomRightRadius: 4,
    height: 50,
    padding: 4,
  },
});

//---------------------------------------------------------------------------------
