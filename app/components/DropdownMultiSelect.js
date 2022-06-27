//--------------- IMPORT MODULES ----------------------------

import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import _ from "lodash";
import { useEffect, useState } from "react";

import { FlatList, Pressable, Text, View } from "react-native";
import { arrayIncludesObject } from "../../functions";

//-----------------------------------------------

const DropdownMultiSelect = ({
  isExpanded,
  keyIdentifier, //set when we need to have only one open at a time
  setExpandedState,
  items, //array of --> {label:string,value:any}
  selectedItems,
  containerStyles,
  buttonContainerStyles,
  buttonStyles,
  buttonTextStyles,
  itemStyles,
  buttonText,
  sendDataToParent,
}) => {
  //----------- COMPONENT STATES --------------------
  const [checkItems, setCheckItems] = useState(selectedItems);
  //-------------------------------------------------
  useEffect(() => {
    sendDataToParent(checkItems);
  }, [checkItems]);

  return (
    <View style={containerStyles}>
      <View style={buttonContainerStyles}>
        <Pressable
          style={buttonStyles}
          onPress={() => {
            keyIdentifier
              ? setExpandedState(keyIdentifier, !isExpanded)
              : setExpandedState();
          }}
        >
          <Text style={buttonTextStyles}>{buttonText}</Text>
          <FontAwesome
            name={`caret-${isExpanded ? "up" : "down"}`}
            size={22}
            color="grey"
          />
        </Pressable>
      </View>
      {isExpanded ? (
        <FlatList
          style={{ width: "100%" }}
          data={items}
          keyExtractor={(items, index) => index}
          renderItem={({ item }) => (
            <Pressable
              style={itemStyles}
              onPress={() => {
                setCheckItems(
                  arrayIncludesObject(checkItems, item)
                    ? [...checkItems.filter((i) => !_.isEqual(i, item))]
                    : [...checkItems, item]
                );
              }}
            >
              <Text style={{ textTransform: "capitalize" }}>{item.label}</Text>
              <MaterialIcons
                name={`radio-button-${
                  arrayIncludesObject(checkItems, item)
                    ? "checked"
                    : "unchecked"
                }`}
                size={22}
                color="#404040"
              />
            </Pressable>
          )}
        />
      ) : null}
    </View>
  );
};

export default DropdownMultiSelect;

//---------------------------------------------------------------------------------------

//EXAMPLE STYLES
// const styles = StyleSheet.create({
//   buttonContainer: {
//     height: 60,
//     backgroundColor: "white",
//     justifyContent: "center",
//     marginBottom: 2,
//   },
//   button: {
//     flexDirection: "row",
//     height: "100%",
//     paddingHorizontal: 10,
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   buttonTextStyles: {
//     color: "#262626",
//     alignSelf: "center",
//     fontFamily: android ? "Roboto" : "Avenir",
//     fontSize: 14,
//     opacity: 0.4,
//     textTransform: "capitalize",
//   },
//   items: {
//     backgroundColor: "whitesmoke",
//     marginBottom: 1.5,
//     justifyContent: "space-between",
//     alignItems: "center",
//     flexDirection: "row",
//     paddingHorizontal: 10,
//     height: 50,
//   },
// });
