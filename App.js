import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { initializeApp } from "firebase/app";
import { useEffect } from "react";
import { LogBox } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import App from "./app/components/App";
import { firebaseConfig } from "./firebase";
import { store } from "./src/store/store";
LogBox.ignoreLogs(["Setting a timer"]); // this disables a warning when uploading large images in firebase in NewBalanceTransaction component
initializeApp(firebaseConfig);

const Main = () => {
  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 2000);
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <SafeAreaProvider style={{ flex: 1 }}>
          <StatusBar style="dark" />
          <App />
        </SafeAreaProvider>
      </NavigationContainer>
    </Provider>
  );
};

export default Main;
