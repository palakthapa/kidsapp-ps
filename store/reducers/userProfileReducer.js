import Cookie from "js-cookie";
import axios, { AxiosError } from "axios";

const userProfileReducer = function (state = {}, action) {
  switch (action.type) {
    case "setUserProfile":
      state.userProfile = action.payload;
      break;
    case "unsetUserProfile":
      state.userProfile = null;
      break;
    default:
      break;
  }
  return state;
}

export default userProfileReducer;

export const logIn = async (payload) => {
  try {
    const { data } = await axios.post("/api/login", payload);

    Cookie.set("user_auth_token", data.token, {
      expires: new Date(Date.now() + data.expires_in * 1000),
    });
    return data.userDetails;
  } catch (error) {
    if (error instanceof AxiosError) throw new Error(error.response?.data);
    else throw error;
  }
};

export const signUp = async (payload) => {
  try {

    const { data } = await axios.post("/api/signup", payload);

    Cookie.set("user_auth_token", data.token, {
      expires: new Date(Date.now() + data.expires * 1000),
    });
    return data.userDetails;
  } catch (error) {
    if (error instanceof AxiosError) throw new Error(error.response?.data);
    else throw error;
  }
};

export const getUserData = async (verification = false) => {
  try {
    const userAuthToken = Cookie.get("user_auth_token");
    if (!userAuthToken) return false;

    const { data } = await axios.get("/api/userprofile", {
      headers: {
        "Authorization": userAuthToken
      }
    });

    if (data.token) {
      Cookie.set("user_auth_token", data.token, {
        expires: new Date(Date.now() + data.expires_in * 1000),
      });
      return data.userDetails;
    } else {
      if(verification) return false;
      else return data;
    }
  } catch (error) {
    if (error instanceof AxiosError) throw new Error(error.response?.data);
    else throw error;
  }
};

// export const resetPassword = async (payload) => {
//   try {
//     const { data } = await axiosApiCallHelper({
//       method: "POST",
//       url: "/api/resetPassword",
//       data: payload,
//     });
//     return {
//       resetPassword: data.reset_password,
//     };
//   } catch (error) {
//     throw new Error(error);
//   }
// };

export const logOut = async (payload) => {
  try {
    Cookie.remove("user_auth_token");
    return true;
  } catch (error) {
    throw error;
  }
};
