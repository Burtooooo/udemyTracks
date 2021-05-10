import { useState, useEffect } from 'react';
import { 
  Accuracy, 
  requestPermissionsAsync,
   watchPositionAsync
} from 'expo-location';

//use effect and state gets complicated here. Wtach 253 if confused wabout references

export default (shouldTrack, callback) => {
  const [err, setErr] = useState(null);

 
  //with use effect you can pass a cleanup function in the return
  //after the first time using effect it will run the cleanup function
  useEffect(() => {
    let subscriber
    const startWatching = async () => {
      try {
        const { granted } = await requestPermissionsAsync();
        if (!granted) {
          throw new Error('Location permission not granted');
        }
        subscriber = await watchPositionAsync({
          accuracy: Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 10
          }, callback
        );
      } catch (e) {
        setErr(e);
      }
    };
  
    if (shouldTrack) {
      startWatching();
    } else {
      if (subscriber) {
        subscriber.remove();
      }
      subscriber = null;
    }

    return () => {
      if (subscriber) {
        subscriber.remove();  
      }
    };
  }, [shouldTrack, callback]);

  //second argument of use effect
  //empty array means only runs once
  //putting in an element in the array will run the function whenever the variable changes
  return [err];
};