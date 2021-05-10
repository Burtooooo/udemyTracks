// this file gets access to the navigator from the app.js file
// usually only the screens that are linked to the stack navigator have access to navigation
// this will give us a work around so that any component can get access to navigate
import { NavigationActions } from 'react-navigation';

let navigator;

export const setNavigator = (nav) => {
  // first brown boy to get it poppin
  navigator = nav;
};

export const navigate = (routeName, params) => {
  navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params
    })
  );
};
