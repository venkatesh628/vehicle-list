import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const VehicleList = ({ vehicles }) => {
  const renderVehicleItem = ({ item }) => (
    <View style={styles.container}>
      <Text>Name: {item.name}</Text>
      <Text>Price: {item.price}</Text>
      <Text>Location: {item.location}</Text>
      <Text>PlaceName: {item.placeName}</Text>
    </View>
  );

  return (
    <FlatList
      data={vehicles}
      renderItem={renderVehicleItem}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: 'red',
        margin: 3
    }
})

export default VehicleList;
