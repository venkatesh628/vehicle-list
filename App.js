import React, { useState, useEffect } from 'react';
import { View, Alert, PermissionsAndroid} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';

import VehicleList from './src/pages/VehicleList';
import AddVehicleForm from './src/pages/AddVehicleForm';


const App = () => {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    loadVehicles();
  }, []);

  //To load the vehicle list
  const loadVehicles = async () => {
    try {
      const storedVehicles = await AsyncStorage.getItem('vehicles');
      if (storedVehicles) {
        setVehicles(JSON.parse(storedVehicles));
      }
    } catch (error) {
      console.error('Error loading vehicles:', error);
    }
  };

  //To save the vehicle list in local storage
  const saveVehicles = async (updatedVehicles) => {
    try {
      await AsyncStorage.setItem('vehicles', JSON.stringify(updatedVehicles));
    } catch (error) {
      console.error('Error saving vehicles:', error);
    }
  };

  //To get location permissions
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app requires access to your location.',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  };

  //Get the location name
  const getPlaceName = async (latitude, longitude) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
      const data = await response.json();
      const placeName = data.display_name;
      return placeName;
    } catch (error) {
      console.error('Error getting place name:', error);
      return null;
    }
  };
  
  //To handle add vehicle action
  const handleAddVehicle = async (vehicle) => {
    const { name, price } = vehicle;
    // Check if name and price fields are empty
    if (!name || !price) {
      Alert.alert('Please enter a name and price for the vehicle.');
      return;
    }
    try {
      const granted = await requestLocationPermission();
      if (granted) {
        Geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            // Get the location name
            const placeName = await getPlaceName(latitude, longitude);
            const newVehicle = { ...vehicle,
                              placeName: placeName || 'Unknown Location' };
            const updatedVehicles = [...vehicles, newVehicle];
            setVehicles(updatedVehicles);
            saveVehicles(updatedVehicles);
          },
          (error) => {
            console.error('Error getting current location:', error);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } else {
        Alert.alert('Location permission not granted');
      }
    } catch (error) {
      console.error('Error getting current location:', error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <AddVehicleForm onSubmit={handleAddVehicle} />
      <VehicleList vehicles={vehicles} /> 
    </View>
  );
};


export default App;

