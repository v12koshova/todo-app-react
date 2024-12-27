import { useEffect, useRef, useState } from "react";
import enter from "../assets/enter.svg";
import TodoItem from "./TodoItem";
import { ACTIONS, CATEGORIES } from "../constants";
import "../css/pages/Main.css";
import { useAuth } from "../contexts/AuthContext";
import { addDays, format, isAfter, isToday, subDays } from "date-fns";
import {
  addTodo,
  fetchTodos,
  fetchTodo,
  updateTodo,
  deleteTodo,
} from "../services/todosService";

function Main() {
  const [select, setSelect] = useState("general");
  const [task, setTask] = useState("");
  const [time, setTime] = useState("");
  const [todos, setTodos] = useState([]);
  const [day, setDay] = useState(new Date());

  const formattedDate = format(day, "yyyy-MM-dd");
  const today = new Date();

  const selectItem = useRef();

  const { currentUser } = useAuth();

  useEffect(() => {
    (async () => {
      const data = await fetchTodos(currentUser.uid, formattedDate);
      setTodos(data || []);
    })();
  }, [day]);

  function updateLocalTodos(fn) {
    let updatedTodos = fn(todos);
    setTodos(updatedTodos);
  }

  async function syncWithDatabase(fn) {
    try {
      await fn();
      const refreshedTodos = await fetchTodos(currentUser.uid, formattedDate);
      setTodos(refreshedTodos);
    } catch (error) {
      console.log("Failed to update database", error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!task) return;
    const newTodo = {
      task,
      time,
      type: select,
      completed: false,
    };

    updateLocalTodos((todos) => {
      return [...todos, newTodo];
    });

    syncWithDatabase(async () => {
      const newTodo = {
        task,
        time,
        type: select,
        completed: false,
      };
      await addTodo(currentUser.uid, formattedDate, newTodo);
    });

    setTask("");
    setTime("");
  }

  async function handleAction(action) {
    switch (action.type) {
      case ACTIONS.TODO_COMPLETE:
        updateLocalTodos((todos) =>
          todos.map((todo) =>
            todo.id === action.payload.id
              ? { ...todo, completed: !todo.completed }
              : todo
          )
        );

        syncWithDatabase(async () => {
          let todo = await fetchTodo(
            currentUser.uid,
            formattedDate,
            action.payload.id
          );

          const updatedTodo = {
            ...todo,
            completed: !todo.completed,
          };

          await updateTodo(
            currentUser.uid,
            formattedDate,
            action.payload.id,
            updatedTodo
          );
        });

        break;
      case ACTIONS.TODO_DELETE:
        updateLocalTodos((todos) =>
          todos.filter((todo) => todo.id !== action.payload.id)
        );

        syncWithDatabase(async () => {
          await deleteTodo(currentUser.uid, formattedDate, action.payload.id);
        });
    }
  }

  function handleDay(operation) {
    let newDate;
    switch (operation) {
      case "add":
        newDate = addDays(day, 1);
        break;
      case "sub":
        newDate = subDays(day, 1);
        break;
    }
    setDay(newDate);
  }

  return (
    <div className="todo-app">
      <div className="container">
        <div className="todo-app__wrapper">
          <div className="todo-app__heading">
            <button
              className="todo-app__change-day todo-app__change-day--prev"
              onClick={() => handleDay("sub")}
            ></button>
            <div className="todo-app__content">
              <h2 className="todo-app__day">{format(day, "cccc")}</h2>
              <p className="todo-app__date">{format(day, "LLLL dd, yyyy")}</p>
            </div>
            <button
              className="todo-app__change-day todo-app__change-day--next"
              onClick={() => handleDay("add")}
            ></button>
          </div>

          {(isToday(day) || isAfter(day, today)) && (
            <form className="todo-app__form" onSubmit={handleSubmit}>
              <div
                className="todo-app__select"
                onClick={() => selectItem.current.classList.toggle("hide")}
              >
                <div
                  className={`todo-app__selected-category category ${select}`}
                ></div>

                <div ref={selectItem} className="todo-app__categories hide">
                  {CATEGORIES.map((c) => {
                    return (
                      <div
                        data-value={c[0]}
                        className={`todo-app__category category ${c[0]}`}
                        key={c}
                        onClick={(e) => setSelect(e.target.dataset.value)}
                      >
                        {c[1]}
                      </div>
                    );
                  })}
                </div>
              </div>

              <input
                className="todo-app__task-input"
                type="text"
                placeholder="What is your next task?"
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />

              <input
                type="time"
                className={`todo-app__time-input ${time ? "filled" : ""}`}
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="15:40"
                onClick={() => (time ? setTime("") : "")}
              />
              <button className="todo-app__enter-button" type="submit">
                <img height="25px" src={enter} alt="" />
              </button>
            </form>
          )}

          <ul className="todo-app__task-box">
            {todos &&
              todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  handleAction={handleAction}
                />
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Main;
