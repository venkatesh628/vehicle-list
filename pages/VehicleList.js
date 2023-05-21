import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const VehicleList = ({ vehicles }) => {
  const renderVehicleItem = ({ item }) => (
    <View style={styles.container}>
      <Text>Name: {item.name}</Text>
      <Text>Price: {item.price}</Text>
      <Text>PlaceName: {item.placeName}</Text>
    </View>
  ); 

  return (
    <View>
      <FlatList
        data={vehicles}
        renderItem={renderVehicleItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: 'blue',
        margin: 3
    },
    buttonView: {
      margin: 5
    }
})

export default VehicleList;
