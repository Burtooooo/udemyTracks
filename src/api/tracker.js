import axios from 'axios';
import AsyncStorage from "@react-native-community/async-storage";

//in tracks run ngrok http 3000
const instance = axios.create({
  baseURL: 'http://35205b681ad9.ngrok.io'
});


//first function called automatically when a request is made
//second function is called if theres some error when request is amde
instance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default instance;