import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import ICONS from "@expo/vector-icons/MaterialIcons";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const COLORS = {
  primary: "#1f145c",
  white: "#ffffff",
  black: "#0000000",
  red: "#FB0000",
  green: "#014816",
};

export default function App() {
  const [todos, setTodos] = useState([]);
  const [textInput, setTextInput] = useState("");

  const addTodo = () => {
    if (textInput == "") {
      Alert.alert("Error", "Please input todo");
    } else {
      const newTodo = {
        id: Math.random(),
        task: textInput,
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setTextInput("");
      Keyboard.dismiss();
    }
  };

  const markTodoComplete = (todoId) => {
    const newTodo = todos.map((item) => {
      if (item.id == todoId) {
        return { ...item, completed: true };
      }
      return item;
    });
    setTodos(newTodo);
  };

  const deleteTodo = (todoId) => {
    const newTodo = todos.filter((item) => item.id != todoId);
    setTodos(newTodo);
  };

  const clearTodo = () => {
    Alert.alert("Confirm", "Clear todos?", [
      {
        text: "Yes",
        onPress: () => setTodos([]),
      },
      { text: "No" },
    ]);
  };

  const saveTodoToUserDevice = async (todos) => {
    try {
      const stringifyTodos = JSON.stringify(todos);
      await AsyncStorage.setItem("todos", stringifyTodos);
    } catch (e) {
      console.log(e);
    }
  };

  const getTodosToUserDevice = async () => {
    try {
      const todos = await AsyncStorage.getItem("todos");
      if (todos != null) {
        setTodos(JSON.parse(todos));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    saveTodoToUserDevice();
  }, [todos]);

  useEffect(() => {
    getTodosToUserDevice();
  }, []);

  const ListItem = ({ todo }) => {
    return (
      <View style={styles.listItem}>
        <View
          style={{
            flex: 1,
            height: 25,
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <Text
            style={[
              styles.listTextItems,
              { textDecorationLine: todo?.completed ? "line-through" : "none" },
            ]}
          >
            {todo?.task}
          </Text>
        </View>
        {!todo?.completed && (
          <TouchableOpacity
            style={styles.actionIcon}
            onPress={() => markTodoComplete(todo?.id)}
          >
            <ICONS name="done" size={20} color={COLORS.white} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => deleteTodo(todo?.id)}
          style={[styles.actionIcon, { backgroundColor: COLORS.red }]}
        >
          <ICONS name="delete" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Todo App</Text>
        <ICONS name="delete" size={25} color={COLORS.red} onPress={clearTodo} />
      </View>
      <FlatList
        data={todos}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ListItem todo={item} />}
      />
      <KeyboardAvoidingView style={styles.footer} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.inputContainer}>
          <TextInput
            placeholder="Add Todo"
            value={textInput}
            onChangeText={(text) => setTextInput(text)}
            style={styles.input}
          />
        </View>
        <TouchableOpacity onPress={addTodo}>
          <View style={styles.iconContainer}>
            <ICONS name="add" size={25} color={COLORS.white} />
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    color: COLORS.primary,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputContainer: {
    backgroundColor: COLORS.white,
    elevation: 40,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: Colors.black,
    shadowOpacity: 0.1,
    flex: 1,
    height: 50,
    marginVertical: 20,
    marginRight: 20,
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  input: {
    fontSize: 14,
    height: 30,
  },
  iconContainer: {
    height: 50,
    width: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    elevation: 40,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: COLORS.black,
    shadowOpacity: 0.1,
    justifyContent: "center",
    alignItems: "center",
  },
  listItem: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    elevation: 7,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: COLORS.black,
    shadowOpacity: 0.2,
    borderRadius: 7,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  listTextItems: {
    fontWeight: "bold",
    fontSize: 15,
    color: COLORS.primary,
  },
  actionIcon: {
    header: 25,
    width: 25,
    backgroundColor: COLORS.green,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    marginLeft: 5,
  },
});
