import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useState, useEffect } from 'react';

export default function App() {

  const db = SQLite.openDatabase('example.db');
  const [isLoading, setIsLoading] = useState(true);
  const [names, setNames] = useState([]);
  const [currentName, setCurrentName] = useState(undefined);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS names (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)',
        [],
        () => {
          tx.executeSql('SELECT * FROM names',
            [],
            (txObj, resultSet) => setNames(resultSet.rows._array),
            (txObj, error) => console.log(error)
          );
        },
        (txObj, error) => console.log(error)
      );
    });

    setIsLoading(false);
  }, []);


  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading names...</Text>
      </View>
    );
  }

  const addName = () => {
    db.transaction(tx => {
      tx.executeSql('INSERT INTO names (name) values (?)', [currentName],
        (txObj, resultSet) => {
          let existingNames = [...names];
          existingNames.push({ id: resultSet.insertId, name: currentName });
          setNames(existingNames);
          setCurrentName(undefined);
        },
        (txObj, error) => console.log(error)
      );
    });
  }

  const showNames = () => {
    return names.map((name, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text>{name.name}</Text>
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      <TextInput value={currentName} placeholder='name' onChangeText={setCurrentName} />
      <Button title='Add name' onPress={addName} />
      {showNames()}
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
  wor: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    margin: 8
  }
});