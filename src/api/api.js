import axios from "axios";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import _ from "lodash";
import { Alert } from "react-native";
import * as constants from "../../constants";
import { ENTITIES_LOADED, TOGGLE_IS_LOADING } from "../store/store";

//-----------------------------------------------------------

export const authWithPassword = async (user_id, password) => {
  return axios
    .get(`${constants.API_URL}api/users/${user_id}/auth/${password}`)
    .then((res) => res.data);
};
//request body is ignored in GET requests
//https://stackoverflow.com/questions/978061/http-get-with-request-body

//-----------------------------------------------------------

export const fetchEntities = async (dispatch) => {
  return axios.get(`${constants.API_URL}api/entities`).then((data) => {
    dispatch(ENTITIES_LOADED(data.data));
    return;
  });
};

//-----------------------------------------------------------

const getNotificationsToken = async () => {
  Notifications.setNotificationHandler({
    // set this in order to show notification with app in foreground
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  let token;
  if (Device.isDevice) {
    //if it runs on physical device
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync(); // check stored permission
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync(); // if not granted ask for permission
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      //if permissions rejected alert user
      Alert.alert("Failed to get push token for push notification!");
      return;
    } else {
      token = (await Notifications.getExpoPushTokenAsync()).data; //get token if permissions are granted
    }
  } else {
    //throw new Error("Must use physical device for Push Notifications"); //breaks flow
    //throw "Must use physical device for Push Notifications";  //breaks flow
    console.log("Must use physical device for Push Notifications"); //it runs on emulator,therefore cannot get a notifications token
  }

  return token;
};

//-----------------------------------------------------------

export const setNotificationsToken = (id, dispatch) => {
  dispatch(TOGGLE_IS_LOADING());
  getNotificationsToken().then(async (token) => {
    token = token !== undefined ? token : "emulator";
    axios
      .patch(`${constants.API_URL}api/users/update_tokens/${id}`, {
        token: token,
        device: Device.deviceName,
      })
      .then((response) => {
        dispatch(fetchEntities).then(() => {
          dispatch(TOGGLE_IS_LOADING());
        });
      })
      .catch((err) => console.log(err));
  });
};

//-----------------------------------------------------------

export const editStaffMember = async (
  id,
  payload,
  showMsgModal,
  setNewExpandedState,
  setIsLoading,
  dispatch
) => {
  return axios
    .patch(`${constants.API_URL}api/users/update/${id}`, payload)
    .then((data) => {
      return dispatch(fetchEntities).then(() => {
        setIsLoading(false);
        showMsgModal(data.data, true);
        setNewExpandedState(id, false);
        return data.data;
      });
    })
    .catch((error) => {
      setIsLoading(false);
      showMsgModal(error.response.data, false);
      return error.response.data;
    });
};

export const addStaffMember = async (
  payload,
  showMsgModal,
  toggleStaffModalVisibility,
  dispatch
) => {
  return (
    axios
      .post(`${constants.API_URL}api/users`, payload)
      // .then((response) => {
      //   if (!response.ok) {
      //     throw new Error("my api returned an error");
      //   } else {
      //     return response.json();
      //   }
      // })
      .then((data) => {
        return dispatch(fetchEntities).then(() => {
          toggleStaffModalVisibility();
          showMsgModal(data.data, true);
        });
      })
      .catch((error) => {
        console.log(error);
        showMsgModal(error.response.data, false);
      })
  );
};

export const deleteStaffMember = async (
  id,
  showMsgModal,
  setDeleteIsLoading,
  dispatch
) => {
  axios
    .delete(`${constants.API_URL}api/users/${id}`)
    .then((data) => {
      setDeleteIsLoading(true);
      dispatch(fetchEntities).then(() => {
        setDeleteIsLoading(false);
        showMsgModal(data.data, true);
      });
    })
    .catch((error) => {
      showMsgModal(error.response.data, false);
    });
};

//-----------------------------------------------------------

export const editVehicle = async (
  id,
  plate,
  showMsgModal,
  setNewExpandedState,
  setIsLoading,
  dispatch
) => {
  return axios
    .patch(`${constants.API_URL}api/vehicles/update/${id}`, { plate: plate })
    .then((data) => {
      return dispatch(fetchEntities).then(() => {
        setIsLoading(false);
        showMsgModal(data.data, true);
        setNewExpandedState(id, false);
        return data.data;
      });
    })
    .catch((error) => {
      setIsLoading(false);
      showMsgModal(error.response.data, false);
    });
};

export const addVehicle = async (
  plate,
  showMsgModal,
  toggleVehicleModalVisibility,
  dispatch
) => {
  return (
    axios
      .post(`${constants.API_URL}api/vehicles`, {
        plate: plate,
      })
      // .then((response) => {
      //   if (!response.ok) {
      //     throw new Error("my api returned an error");
      //   } else {
      //     return response.json();
      //   }
      // })
      .then((data) => {
        return dispatch(fetchEntities).then(() => {
          toggleVehicleModalVisibility();
          showMsgModal(data.data, true);
        });
      })
      .catch((error) => {
        showMsgModal(error.response.data, false);
      })
  );
};

export const deleteVehicle = async (
  id,
  showMsgModal,
  setDeleteIsLoading,
  dispatch
) => {
  axios
    .delete(`${constants.API_URL}api/vehicles/${id}`)
    .then((data) => {
      setDeleteIsLoading(true);
      dispatch(fetchEntities).then(() => {
        setDeleteIsLoading(false);
        showMsgModal(data.data, true);
      });
    })
    .catch((error) => {
      showMsgModal(error.response.data, false);
    });
};

//-----------------------------------------------------------

export const publishAnnouncement = async (
  message,
  critical,
  showMsgModal,
  toggleAnnouncementsModalVisibility,
  dispatch
) => {
  return axios
    .post(`${constants.API_URL}api/announcements`, {
      body: message,
      critical: critical,
    })
    .then((data) => {
      return dispatch(fetchEntities).then(() => {
        toggleAnnouncementsModalVisibility();
        showMsgModal(data.data, true);
      });
    })
    .catch((error) => {
      showMsgModal(error.response.data, false);
    });
};

export const deleteAnnouncement = async (
  id,
  showMsgModal,
  setIsLoading,
  dispatch
) => {
  axios
    .delete(`${constants.API_URL}api/announcements/${id}`)
    .then((data) => {
      setIsLoading(true);
      dispatch(fetchEntities).then(() => {
        setIsLoading(false);
        showMsgModal(data.data, true);
      });
    })
    .catch((error) => {
      showMsgModal(error.response.data, false);
    });
};

//-----------------------------------------------------------
//TODO FIX,sends 2 requests to server everyt
export const fetchScheduleData = async (
  user_id,
  skip,
  start_date,
  end_date,
  showMsgModal
) => {
  return axios
    .get(`${constants.API_URL}api/schedule/pagination/${user_id}`, {
      params: {
        skip: skip,
        start_date: start_date,
        end_date: end_date,
      },
    })
    .then((data) => {
      return data.data;
    })
    .catch((error) => {
      showMsgModal(error.response.data.toString(), false);
    });
};

export const addTask = async (payload, showMsgModal) => {
  return axios
    .post(`${constants.API_URL}api/schedule`, {
      ...payload,
    })
    .then((data) => {
      showMsgModal(data.data, true);
    })
    .catch((error) => {
      console.log(error);
      showMsgModal(error.response.data, false);
    });
};

export const editTask = async (id, payload, showMsgModal) => {
  return axios
    .patch(`${constants.API_URL}api/schedule/${id}`, {
      ...payload,
    })
    .then((data) => {
      showMsgModal(data.data, true);
    })
    .catch((error) => {
      console.log(error);
      showMsgModal(error.response.data, false);
    });
};

export const toggleScheduleStatus = async (task_id, user_id) => {
  return axios
    .put(`${constants.API_URL}api/schedule/toggle_status/${task_id}/${user_id}`)
    .then((data) => {
      return data.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const deleteTask = async (id, showMsgModal) => {
  return axios
    .delete(`${constants.API_URL}api/schedule/${id}`)
    .then((data) => {
      showMsgModal("Task has deleted succesfully", true);
    })
    .catch((error) => {
      //showMsgModal(error.response.data, false);
      console.log(error);
    });
};

//-----------------------------------------------------------

export const getBalanceTotals = async (user_id) => {
  return axios
    .get(`${constants.API_URL}api/balance/total/${user_id}`)
    .then((data) => {
      return data.data;
    })
    .catch((error) => {
      showMsgModal(error.response.data, false);
    });
};

export const fetchBalanceData = async (user_id, skip) => {
  return axios
    .get(`${constants.API_URL}api/balance/pagination/${user_id}/${skip}`)
    .then((data) => {
      return data.data;
    })
    .catch((error) => {
      showMsgModal(error.response.data, false);
    });
};

export const addBalanceTransaction = async (
  payload,
  showMsgModal,
  setUploadingImageProgress,
  setUploadingImageSucceded,
  setLoadingProgressText
) => {
  let id;

  const transactionPayload = _.omit(payload, ["receiptToUpload"]);
  return axios
    .post(`${constants.API_URL}api/balance`, transactionPayload)
    .then((response) => {
      // showMsgModal(response.data.message, true);
      // console.log(typeof JSON.stringify(response.data._doc));
      // toggleNewBalanceTransactionModalVisibility();
      // loadTransactions();
      // uploadReceiptToFirebase(payload.receiptToUpload,response);
      //console.log(response.data);
      setUploadingImageProgress(0.08);
      setLoadingProgressText("Saving transaction..");
      id = response.data._doc._id;
      return payload.receiptToUpload
        ? uploadReceiptToFirebase(
            payload.receiptToUpload,
            response.data._doc._id,
            setUploadingImageProgress,
            setLoadingProgressText
          )
        : response;
    })
    .then((response) => {
      if (payload.receiptToUpload) {
        setReceiptUrl(id, response).then((response) => {
          setLoadingProgressText("Done !");
          setUploadingImageSucceded(true);
          setTimeout(() => {
            showMsgModal(response, true);
          }, 2000);
        });
      } else {
        setTimeout(() => {
          showMsgModal(response.data.message, true);
        }, 1000);
      }
    })
    .catch((error) => {
      showMsgModal(error.response.data, false);
      console.log(error);
    });
};

export const deleteBalanceTransaction = async (id, showMsgModal) => {
  return axios
    .delete(`${constants.API_URL}api/balance/${id}`)
    .then((data) => {
      showMsgModal("Transaction has deleted succesfully", true);
    })
    .catch((error) => {
      showMsgModal(error.response.data, false);
      //console.log(error);
    });
};

export const uploadReceiptToFirebase = async (
  uri,
  name,
  setUploadingImageProgress,
  setLoadingProgressText
) => {
  const storage = getStorage(); //access firebase storage bucket
  const storageRef = ref(storage, `balance/receipts/${name}`); //file reference to the bucket
  const img = await fetch(uri);
  const blob = await img.blob();
  const uploadTask = uploadBytesResumable(storageRef, blob);
  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 0.8;

        //console.log(progress);
        setLoadingProgressText("Uploading receipt..");
        setUploadingImageProgress(progress);

        // switch (snapshot.state) { //pause/resume implementation --> https://firebase.google.com/docs/storage/web/upload-files#monitor_upload_progress
        //   case "paused":
        //     console.log("Upload is paused");
        //     break;
        //   case "running":
        //     console.log("Upload is running");
        //     break;
        // }
      },
      (error) => {
        console.log(error);
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
};

export const setReceiptUrl = async (id, url) => {
  return axios
    .put(`${constants.API_URL}api/balance/set_receipt_url/${id}`, {
      receiptUrl: url,
    })
    .then((data) => {
      return data.data;
    });
};

// export const getReceiptsDirectorySize = async () => {
//   return axios
//     .get(`${constants.API_URL}api/receipts/directory_size`)
//     .then((data) => {
//       return data.data;
//     });
// };

//-----------------------------------------------------------

export const updateDeviceName = async (
  id,
  token,
  new_name,
  dispatch,
  showMsgModal
) => {
  return axios
    .patch(`${constants.API_URL}api/devices/${id}/${token}`, { name: new_name })
    .then((data) => {
      dispatch(fetchEntities).then(() => {
        showMsgModal(data.data, true);
      });
    })
    .catch((error) => {
      showMsgModal(error.response.data, false);
      //console.log(error);
    });
};

export const deleteDevice = async (id, token, dispatch, showMsgModal) => {
  return axios
    .delete(`${constants.API_URL}api/devices/${id}/${token}`)
    .then((data) => {
      dispatch(fetchEntities).then(() => {
        showMsgModal(data.data, true);
      });
    })
    .catch((error) => {
      showMsgModal(error.response.data, false);
      //console.log(error);
    });
};

//-----------------------------------------------------------

export const editActivity = async (
  id,
  type,
  showMsgModal,
  setNewExpandedState,
  setIsLoading,
  dispatch
) => {
  return axios
    .patch(`${constants.API_URL}api/activities/${id}`, { type: type })
    .then((data) => {
      return dispatch(fetchEntities).then(() => {
        setIsLoading(false);
        showMsgModal(data.data, true);
        setNewExpandedState(id, false);
        return data.data;
      });
    })
    .catch((error) => {
      setIsLoading(false);
      showMsgModal(error.response.data, false);
      return error.response.data;
    });
};

export const addActivity = async (
  type,
  showMsgModal,
  toggleVehicleModalVisibility,
  dispatch
) => {
  return axios
    .post(`${constants.API_URL}api/activities`, {
      type: type,
    })
    .then((data) => {
      return dispatch(fetchEntities).then(() => {
        toggleVehicleModalVisibility();
        showMsgModal(data.data, true);
      });
    })
    .catch((error) => {
      console.log(error);
      showMsgModal(error.response.data, false);
    });
};

export const deleteActivity = async (
  id,
  showMsgModal,
  setDeleteIsLoading,
  dispatch
) => {
  axios
    .delete(`${constants.API_URL}api/activities/${id}`)
    .then((data) => {
      setDeleteIsLoading(true);
      dispatch(fetchEntities).then(() => {
        setDeleteIsLoading(false);
        showMsgModal(data.data, true);
      });
    })
    .catch((error) => {
      showMsgModal(error.response.data, false);
    });
};
