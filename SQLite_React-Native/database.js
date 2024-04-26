// database.js

import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

const databaseName = 'MyAppDatabase.db';
const databaseVersion = '1.0';
const databaseDisplayname = 'My App Database';
const databaseSize = 200000;

const db = SQLite.openDatabase(
  databaseName,
  databaseVersion,
  databaseDisplayname,
  databaseSize
);

// Criação da tabela 'people' com campos 'id', 'name' e 'age'
db.transaction(tx => {
  tx.executeSql(
    'CREATE TABLE IF NOT EXISTS people (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, age INTEGER)',
    [],
    () => console.log('Tabela criada com sucesso.'),
    error => console.error('Erro ao criar tabela:', error)
  );
});

// Função para inserir uma pessoa na tabela 'people'
export const insertPerson = (name, age) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO people (name, age) VALUES (?, ?)',
        [name, age],
        (_, resultSet) => resolve(resultSet.insertId),
        (_, error) => reject(error)
      );
    });
  });
};

// Função para buscar todas as pessoas da tabela 'people'
export const getAllPeople = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM people',
        [],
        (_, resultSet) => resolve(resultSet.rows.raw()),
        (_, error) => reject(error)
      );
    });
  });
};

// Função para atualizar a idade de uma pessoa na tabela 'people'
export const updatePersonAge = (id, newAge) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE people SET age = ? WHERE id = ?',
        [newAge, id],
        () => resolve(),
        (_, error) => reject(error)
      );
    });
  });
};

// Função para excluir uma pessoa da tabela 'people' pelo ID
export const deletePersonById = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM people WHERE id = ?',
        [id],
        () => resolve(),
        (_, error) => reject(error)
      );
    });
  });
};

export default db;
