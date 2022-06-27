//--------------- IMPORT MODULES ----------------------------

import { EvilIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useDidMountEffect } from "../../customHooks";
//-----------------------------------------------

const DropdownSelectList = ({
  items,
  selected,
  renderSearch,
  renderIconComponent,
  selectionCheckIcon,
  buttonContainerStyles,
  roundCorners,
  placeholder,
  shouldChangePlaceholder,
  buttonStyles,
  dropdownContainerStyles,
  placeholderTextStyles,
  showsVerticalScrollIndicator,
  inputSearchStyle,
  maxHeight,
  flatListProps,
  renderItem,
  onSelect,
  sendButtonState,
}) => {
  //----------- COMPONENT STATES --------------------
  const [isDropdownSelectionOpen, setDropdownSelectionOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(selected);
  //const [isFocus, setIsFocus] = useState(false);
  const dropDownRef = useRef();
  //console.log("selectedItem", selectedItem);

  //-------------------------------------------------
  if (selected) {
    useEffect(() => {
      onSelect(selectedItem);
    }, [selectedItem]);
  } else {
    useDidMountEffect(() => {
      onSelect(selectedItem);
    }, [selectedItem]);
  }

  //------------------------------------------------>
  return (
    <View
      style={{
        ...buttonContainerStyles,
        borderTopLeftRadius: roundCorners ? roundCorners : 0,
        borderTopRightRadius: roundCorners ? roundCorners : 0,
        borderBottomLeftRadius:
          roundCorners && !isDropdownSelectionOpen ? roundCorners : 0,
        borderBottomRightRadius:
          roundCorners && !isDropdownSelectionOpen ? roundCorners : 0,
      }}
    >
      <Dropdown
        ref={dropDownRef}
        style={buttonStyles}
        containerStyle={dropdownContainerStyles}
        placeholderStyle={placeholderTextStyles}
        selectedTextStyle={placeholderTextStyles}
        inputSearchStyle={inputSearchStyle}
        // iconStyle={styles.iconStyle}
        data={items}
        search={renderSearch}
        maxHeight={maxHeight}
        autoScroll={false}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        shouldChangePlaceholder={shouldChangePlaceholder}
        searchPlaceholder="Search..."
        //disable={isDropdownSelectionOpen}
        value={selectedItem}
        // onFocus={() => setIsFocus(true)}
        // onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setSelectedItem(item.value);
          console.log(item);
        }}
        onFocus={() => setDropdownSelectionOpen(true)}
        onBlur={() => setDropdownSelectionOpen(false)}
        renderRightIcon={() => (
          <EvilIcons
            name={`chevron-${isDropdownSelectionOpen ? "up" : "down"}`}
            size={24}
            color="black"
          />
        )}
        activeColor={null}
        flatListProps={{ ...flatListProps }}
        renderItem={(item) =>
          renderItem(item, selectedItem, setSelectedItem, dropDownRef)
        }
      />
    </View>
  );
};

export default DropdownSelectList;

//---------------------------------------------------------------------------------------

//EXAMPLE STYLES
// const styles = StyleSheet.create({
// buttonContainerStyles: {
//   height: "100%",
//   backgroundColor: "#e6e6e6",
//   justifyContent: "center",
// },
// dropdownContainerStyles: {
//   marginTop: 8,
//   padding: 5,
//   paddingBottom: 2,
//   borderBottomRightRadius: 5,
//   borderBottomLeftRadius: 5,
// },
// buttonStyles: {
//   paddingHorizontal: 10,
//   width: "100%",
//   alignSelf: "center",
// },
// placeholderTextStyles: {
//   color: "black",
//   alignSelf: "center",
//   fontFamily: android ? "Roboto" : "Avenir",
//   fontSize: 14,
//   //opacity: 0.8,
//   //textTransform: "capitalize",
// },
// inputSearchStyle: {
//   color: "black",
//   //alignSelf: "center",
//   fontFamily: android ? "Roboto" : "Avenir",
//   fontSize: 14,
//   opacity: 0.8,
//   //textTransform: "capitalize",
// },
// items: {
//   backgroundColor: "rgb(235, 235, 235)",
//   marginBottom: 2,
//   height: 50,
//   justifyContent: "space-between",
//   alignItems: "center",
//   flexDirection: "row",
//   paddingHorizontal: 10,
// },
// });
