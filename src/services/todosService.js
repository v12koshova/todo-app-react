import { get, push, ref, set, update, remove } from "firebase/database";
import { db } from "../firebase";

async function addTodo(userId, day, todo) {
  const todoRef = ref(db, `users/${userId}/todos/${day}`);
  const newTodoRef = push(todoRef);
  await set(newTodoRef, { ...todo, id: newTodoRef.key });
  return newTodoRef;
}

async function fetchTodos(userId, day) {
  const todoRef = ref(db, `users/${userId}/todos/${day}`);
  const snapshot = await get(todoRef);
  if (snapshot.exists()) {
    return Object.values(snapshot.val());
  } else {
    console.log("Todos don't exist");
  }
}

async function fetchTodo(userId, day, todoId) {
  const newRef = ref(db, `users/${userId}/todos/${day}/${todoId}`);
  const snapshot = await get(newRef);
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    console.log("Todo doesn't exist");
  }
}

async function updateTodo(userId, day, todoId, todo) {
  const newRef = ref(db, `users/${userId}/todos/${day}/${todoId}`);
  await update(newRef, todo);
}
async function deleteTodo(userId, day, todoId) {
  const newRef = ref(db, `users/${userId}/todos/${day}/${todoId}`);
  await remove(newRef);
}

export { addTodo, fetchTodos, fetchTodo, updateTodo, deleteTodo }