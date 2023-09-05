import { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

export default function App() {
  const [notes, setNotes] = useState([]);

  // Listar notas
  const getNotes = async () => {
    const savedNotes = await AsyncStorage.getItem("notes");
    setNotes(JSON.parse(savedNotes));
  };

  // Criar nota
  const saveNote = async (note) => {
    const updatedNotes = [...notes, note];
    await AsyncStorage.setItem("notes", JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

  // Editar nota
  const updateNote = async (note, newNote) => {
    const updatedNotes = notes.map((n) => (n === note ? newNote : n));
    await AsyncStorage.setItem("notes", JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

  // Apagar nota
  const deleteNote = async (note) => {
    const updatedNotes = notes.filter((n) => n !== note);
    await AsyncStorage.setItem("notes", JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

  // useEffect(() => {
  //   getNotes();
  // }, [notes]);

  // Tela inicial
  function Home({ navigation }) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>📌 Notas Rápidas</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Criar")}
          style={styles.create}
        >
          <Text>+ Nova Nota</Text>
        </TouchableOpacity>
        <FlatList
          data={notes}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("Exibir", { note: item })}
            >
              <View style={styles.card}>
                <Text>{item.title || "Sem título"}</Text>
                <Text>{item.content}</Text>
                <View style={styles.row}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("Editar", { note: item })
                    }
                    style={styles.button}
                  >
                    <Text>✏</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => deleteNote(item)}
                    style={styles.button}
                  >
                    <Text>🗑</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

  // Tela de criação
  function NewNote({ navigation }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    return (
      <View>
        <TextInput placeholder="Título" value={title} onChangeText={setTitle} />
        <TextInput
          placeholder="Conteúdo"
          value={content}
          onChangeText={setContent}
        />
        <TouchableOpacity
          onPress={() => {
            const note = { title, content };
            saveNote(note);
            navigation.goBack();
          }}
          style={styles.create}
        >
          <Text>Salvar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Tela de visualização
  function ViewNote({ route }) {
    const { note } = route.params;

    return (
      <View style={{ backgroundColor: "white", flex: 1 }}>
        <Text style={styles.noteTitle}>{note.title || "Sem título"}</Text>
        <Text style={styles.noteContent}>{note.content}</Text>
      </View>
    );
  }

  // Tela de edição
  function EditNote({ route, navigation }) {
    const { note } = route.params;
    const [title, setTitle] = useState(note.title);
    const [content, setContent] = useState(note.content);

    return (
      <View>
        <TextInput placeholder="Título" value={title} onChangeText={setTitle} />
        <TextInput
          placeholder="Conteúdo"
          value={content}
          onChangeText={setContent}
        />
        <TouchableOpacity
          onPress={() => {
            const newNote = { title, content };
            updateNote(note, newNote);
            navigation.goBack();
          }}
          style={styles.create}
        >
          <Text>Salvar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="Criar" component={NewNote} />
        <Stack.Screen name="Exibir" component={ViewNote} />
        <Stack.Screen name="Editar" component={EditNote} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
    paddingTop: 72,
    paddingBottom: 12,
  },
  create: {
    backgroundColor: "lightgray",
    borderRadius: 8,
    padding: 12,
    margin: 8,
  },
  card: {
    borderWidth: 1,
    padding: 4,
    margin: 8,
    borderRadius: 8,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    gap: 4,
  },
  button: {
    backgroundColor: "lightgray",
    borderRadius: 10,
    padding: 10,
  },
  noteTitle: {
    fontSize: 24,
  },
  noteContent: {
    fontSize: 12,
  },
});
