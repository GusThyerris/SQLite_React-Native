import React, { useState, useEffect } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { getAllPeople } from './database';

export default function OtherPage() {
  const [names, setNames] = useState([]);

  useEffect(() => {
    fetchNames();
  }, []);

  const fetchNames = async () => {
    try {
      const people = await getAllPeople();
      setNames(people);
    } catch (error) {
      console.error('Erro ao buscar nomes:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Names in Database:</Text>
      {names.map((person, index) => (
        <View key={index} style={styles.row}>
          <Text>{person.name}</Text>
        </View>
      ))}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    marginVertical: 8,
  },
});
