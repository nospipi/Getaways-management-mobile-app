import AsyncStorage from "@react-native-async-storage/async-storage";

//-------------------------------------------------------------

export const clearAll = async () => {
  try {
    await AsyncStorage.clear();
  } catch (err) {
    // clear error
  }

  console.log("Data cleared.");
};
//clearAll();

//-------------------------------------------------------------

export const getAllKeys = async () => {
  let keys = [];
  try {
    keys = await AsyncStorage.getAllKeys();
    return keys;
  } catch (err) {
    // read key error
  }
  // example console.log result:
  // ['@MyApp_user', '@MyApp_key']
};

/* 

getAllKeys().then((value) => console.log(value));
getAllKeys().then((value) =>
  value.map((key) => retrieveData(key).then((value) => console.log(key + ": " + value))
); 

*/

//-------------------------------------------------------------

export const setObjectValue = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (err) {
    // save error
  }
};
//setObjectValue("key", "value");

//-------------------------------------------------------------

export const setStringValue = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (err) {
    // save error
  }
};
//setStringValue("key", "value");

//-------------------------------------------------------------

export const retrieveData = async (key) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    // Error retrieving data
  }
};
//retrieveData("Count").then((value) => console.log(value));

//-------------------------------------------------------------
