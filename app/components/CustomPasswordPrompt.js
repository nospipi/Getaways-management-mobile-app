//--------------- IMPORT MODULES ----------------------------

import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useRef, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { SET_LOGGED_AS } from "../../src/store/store";

import { AntDesign } from "@expo/vector-icons";
import _ from "lodash";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ADMIN_ID } from "../../constants";
import { authWithPassword } from "../../src/api/api";
import { setObjectValue } from "../../src/asyncStorageFunctions";
import AppContext from "./AppContext";
import CustomCheckMark from "./CustomCheckMark";
const { width } = Dimensions.get("window");

//--------------------------------------------------------------

const CustomPasswordPrompt = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [userNameValue, setUserNameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const store = useSelector((store) => store);
  const appContext = useContext(AppContext);
  const { requestedUser, isPasswordModalVisible } = appContext.states;
  const isAdminRequested = requestedUser === ADMIN_ID;
  const { setRequestedUser, togglePasswordModalVisibility } =
    appContext.functions;
  const [validationSuccesfull, setValidationSuccesfull] = useState(false);
  const [validationHasError, setValidationHasError] = useState(false);
  const [validationText, setValidationText] = useState("");
  const [passwordAuthIsLoading, setPasswordAuthIsLoading] = useState(false);

  //----------- COMPONENT FUNCTIONS -----------------

  const fadeAnim = useRef(new Animated.Value(0)).current; //Animated view opacity to 0
  const fadeIn = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleSuccesfullValidation = (user) => {
    setValidationHasError(false);
    setValidationSuccesfull(true);
    setPasswordAuthIsLoading(false);
    setObjectValue("currentUser", user); //to local storage
    dispatch(SET_LOGGED_AS(_.omit(user, ["auth"])));
    setTimeout(() => {
      togglePasswordModalVisibility();
      navigation.navigate("Staff", { user: user.name });
      setValidationSuccesfull(false);
    }, 1300);
  };
  const handleFailedValidation = (failText) => {
    fadeIn();
    setValidationText(failText);
    setValidationHasError(true);
    setValidationSuccesfull(false);
    setPasswordAuthIsLoading(false);
    setPasswordValue("");
    setUserNameValue("");
  };

  const onPressFunctions = () => {
    if (isAdminRequested) {
      if (passwordValue.length > 5) {
        setPasswordAuthIsLoading(true);
        authWithPassword(ADMIN_ID, passwordValue).then((user) => {
          if (user.auth === true) {
            handleSuccesfullValidation(user);
          } else {
            handleFailedValidation("Wrong password");
          }
        });
      } else {
        handleFailedValidation("Password must be at least 6 characters");
      }
    } else {
      if (passwordValue.length > 5) {
        if (userNameValue.length > 0) {
          setPasswordAuthIsLoading(true);
          if (
            store.data.entities.staff
              .map((staffMember) => staffMember.username.toUpperCase())
              .includes(userNameValue.toUpperCase())
          ) {
            const foundUser_id = store.data.entities.staff.find(
              (staffMember) =>
                staffMember.username.toUpperCase() ===
                userNameValue.toUpperCase()
            )._id;

            authWithPassword(foundUser_id, passwordValue).then((user) => {
              if (user.auth === true) {
                handleSuccesfullValidation(user);
              } else {
                handleFailedValidation("Wrong password");
              }
            });
          } else {
            handleFailedValidation(`Username (${userNameValue}) not found`);
          }
        } else {
          handleFailedValidation("Please enter a valid account name");
        }
      } else {
        handleFailedValidation("Password must be at least 6 characters");
      }
    }
  };

  useEffect(() => {
    setValidationHasError(false);
    setValidationSuccesfull(false);
    setPasswordAuthIsLoading(false);
    setValidationText("");
    setPasswordValue("");
    setUserNameValue("");
  }, [isPasswordModalVisible]);

  //---------------------------------------------------------

  return (
    <Modal
      animationType="fade"
      //transparent
      visible={isPasswordModalVisible}
      presentationStyle="fullScreen"
      //onDismiss={props.toggleModalVisibility}
    >
      <View style={styles.viewWrapper}>
        {validationSuccesfull ? (
          <View style={styles.validationWrapper}>
            <CustomCheckMark
              visible={true}
              width={100}
              height={100}
              speed={1.5}
            />
          </View>
        ) : (
          <View style={styles.modalView}>
            <View style={styles.iconsWrapper}>
              <AntDesign name="close" size={24} style={styles.ghostIcon} />
              <AntDesign name="lock" size={24} color="black" />
              <AntDesign
                name="close"
                size={24}
                color="black"
                style={styles.closeBtn}
                onPress={() => {
                  togglePasswordModalVisibility();
                }}
              />
            </View>
            <View style={styles.inputWrapper}>
              {isAdminRequested ? null : (
                <TextInput
                  value={userNameValue}
                  style={{
                    ...styles.textInput,
                    marginBottom: 4,
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                    backgroundColor: validationHasError
                      ? "#f3d8d8"
                      : "rgb(235, 235, 235)",
                  }}
                  keyboardType="default"
                  onChangeText={setUserNameValue}
                  placeholder="Username"
                  autoCapitalize="none"
                  autoFocus
                  autoCorrect={false}
                />
              )}

              <TextInput
                value={passwordValue}
                style={{
                  ...styles.textInput,
                  borderRadius: isAdminRequested ? 5 : 0,
                  borderBottomLeftRadius: 5,
                  borderBottomRightRadius: 5,
                  backgroundColor: validationHasError
                    ? "#f3d8d8"
                    : "rgb(235, 235, 235)",
                }}
                keyboardType="numeric"
                maxLength={6}
                onChangeText={setPasswordValue}
                placeholder="Password"
                autoFocus={isAdminRequested ? true : false}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
              />
            </View>
            {validationHasError ? (
              <View style={styles.validationWrapper}>
                <Animated.View style={{ opacity: fadeAnim }}>
                  <Text style={styles.validationText}>{validationText}</Text>
                </Animated.View>
              </View>
            ) : null}
            <View style={styles.btnWrapper}>
              {passwordAuthIsLoading ? (
                <ActivityIndicator size="small" color="dodgerblue" />
              ) : (
                <TouchableOpacity
                  style={styles.customButton}
                  onPress={() => onPressFunctions()}
                >
                  <Text style={styles.buttonText}>{"OK"}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

export default CustomPasswordPrompt;

//---------------- COMPONENT STYLES ----------------------------------------------

const styles = StyleSheet.create({
  viewWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#a593a0",
  },
  modalView: {
    //alignItems: "center",
    //justifyContent: "center",
    //flexDirection: "column",
    //alignSelf: "center",
    //height: 170,
    width: width * 0.8,
    backgroundColor: "rgb(242, 242, 242)",
    //borderWidth: 1,
    borderColor: "dodgerblue",
    borderRadius: 7,
    padding: 12,
  },
  iconsWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    //alignItems: "flex-start",
    marginBottom: 15,
  },
  inputWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  validationWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  btnWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    width: "75%",
    textAlign: "center",
    //borderRadius: 7,
    backgroundColor: "rgb(235, 235, 235)",
    padding: 10,
    borderColor: "rgba(0, 0, 0, 0.2)",
    //borderWidth: 1,
    fontSize: 18,
    color: "grey",
  },
  validationText: {
    //marginBottom: 15,
    color: "indianred",
    fontSize: 15,
    fontWeight: "600",
  },
  customButton: {
    alignItems: "center",
    justifyContent: "center",
    textShadowColor: "red",
    backgroundColor: "#66b3ff",
    borderRadius: 15,
    padding: 8,
    width: "40%",
  },
  buttonText: {
    color: "whitesmoke",
    fontSize: 16,
    fontWeight: "800",
  },
  ghostIcon: {
    opacity: 0,
  },
});

//---------------------------------------------------------------------------------
