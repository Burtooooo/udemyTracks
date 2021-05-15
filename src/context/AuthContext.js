import createDataContext from './createDataContext';
import trackerApi from '../api/tracker';
import AsyncStorage from "@react-native-community/async-storage"
import { navigate } from '../navigationRef';

const authReducer = (state, action) => {
  switch (action.type) {
    case 'add_error':
      return {...state, errorMessage: action.payload };
    case 'signin':
      return {errorMessage: '', token: action.payload };
    case 'clear_error_message':
      return {...state, errorMessage: '' };
    case 'signout':
      return { token: null, errorMessage: ''};
    default:
      return state;   
  }
};

const clearErrorMessage = dispatch => () => {
  dispatch({ type: 'clear_error_message' });
}

//arrow function shortening notation, identical to saying return async email password and having another set of brackets
const signup = (dispatch) => async ({ email, password }) => {
  //make api request to sign up with email and password
  //modify state and say we are authenticated
  //if singing up fails we need to reflect that
  
  try {
    const response = await trackerApi.post('/signup', { email, password });
    await AsyncStorage.setItem('token', response.data.token);
    dispatch({ type: 'signin', payload: response.data.token });
    console.log('yo')
    navigate('TrackList');
  } catch (err) {
    console.log(err)
    dispatch({ type: 'add_error', payload: 'Something went wrong with sign up' });
  }
};

const signin = (dispatch) => async ({ email, password }) => {
  //try to sign in
  //update state on success
  //handle failure by showing error message

  try {
    const response = await trackerApi.post('/signin', { email, password });
    await AsyncStorage.setItem('token', response.data.token);
    dispatch({ type: 'signin', payload: response.data.token });
    navigate('TrackList');
  } catch (err) {
    dispatch({
      type: 'add_error',
      payload: 'Something went wrong with signing in'
    });
  }
};

//if the device local storage has token go straight to track flow
//otherwise go to log in flow
const tryLocalSignin = (dispatch) => async () => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    dispatch({ type: 'signin', payload: token });
    navigate('TrackList');
  } else {
    navigate('loginFlow');
  }
};

const signout = (dispatch) => async () => {
  await AsyncStorage.removeItem('token');
  dispatch({ type: 'signout' });
};

export const { Provider, Context } = createDataContext(
  authReducer,
  { signin, signout, signup, clearErrorMessage, tryLocalSignin },
  { token: null, errorMessage: ''}
);