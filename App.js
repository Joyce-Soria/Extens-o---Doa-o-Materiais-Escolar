// App.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, Alert, Platform } from 'react-native';
import * as Location from 'expo-location';
import { GiftedChat } from 'react-native-gifted-chat';
import { SafeAreaProvider } from 'react-native-safe-area-context'; // Importando SafeAreaProvider

export default function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android' || Platform.OS === 'ios') {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permissão negada', 'Não foi possível acessar a localização.');
          return;
        }

        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
      }
    })();

    setMessages([
      {
        _id: 1,
        text: 'Bem-vindo ao chat comunitário! Como posso ajudar?',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Sistema',
        },
      },
    ]);
  }, []);

  const addItem = () => {
    if (name.trim() === '' || description.trim() === '') {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    const newItem = {
      id: Math.random().toString(),
      name,
      description,
      location,
    };
    setItems((currentItems) => [...currentItems, newItem]);
    setName('');
    setDescription('');
  };

  const deleteItem = (id) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  };

  const onSend = (newMessages = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Text style={styles.title}>Doação e Troca de Materiais Escolares</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome do material"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Descrição do material"
          value={description}
          onChangeText={setDescription}
        />
        <Button title="Adicionar" onPress={addItem} />
        {location && (
          <Text style={styles.locationText}>
            Localização Atual: {location.coords.latitude}, {location.coords.longitude}
          </Text>
        )}
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>{item.name}</Text>
              <Text>{item.description}</Text>
              {item.location && (
                <Text>
                  Localização: {item.location.coords.latitude}, {item.location.coords.longitude}
                </Text>
              )}
              <Button title="Remover" color="red" onPress={() => deleteItem(item.id)} />
            </View>
          )}
        />
        <View style={styles.chatContainer}>
          <GiftedChat
            messages={messages}
            onSend={(messages) => onSend(messages)}
            user={{
              _id: 1,
            }}
          />
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  item: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  itemText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  locationText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  chatContainer: {
    flex: 1,
    marginTop: 20,
  },
});

