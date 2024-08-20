import React, { memo, useState, useCallback, useEffect } from "react";
import classnames from "classnames";

import { Input } from "./input";

import { TOGGLE_ITEM, REMOVE_ITEM, UPDATE_ITEM } from "../constants";

export const Item = memo(function Item({
  todo,
  dispatch,
  index,
  isNew,
  todos,
}) {
  const [isWritable, setIsWritable] = useState(false);
  const [isFading, setIsFading] = useState(isNew);
  const { title, completed, id, timestamp, completionTimestamp } = todo;

  useEffect(() => {
    if (isNew) {
      setIsFading(true);
      const timer = setTimeout(() => {
        setIsFading(false);
      }, 10000);
    }
  }, [isNew]);

  console.log("isFading", isFading, title);

  const toggleItem = useCallback(
    () => dispatch({ type: TOGGLE_ITEM, payload: { id } }),
    [dispatch, id]
  );
  const removeItem = useCallback(
    () => dispatch({ type: REMOVE_ITEM, payload: { id } }),
    [dispatch, id]
  );
  const updateItem = useCallback(
    (id, title) => dispatch({ type: UPDATE_ITEM, payload: { id, title } }),
    [dispatch]
  );

  const handleDoubleClick = useCallback(() => {
    setIsWritable(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsWritable(false);
  }, []);

  const handleUpdate = useCallback(
    (title) => {
      if (title.length === 0) removeItem(id);
      else updateItem(id, title);

      setIsWritable(false);
    },
    [id, removeItem, updateItem]
  );

  const getCompletionColor = () => {
    if (completionTimestamp) {
      const completedTodos = todos.filter((t) => t.completed);
      const sortedCompletedTodos = completedTodos.sort(
        (a, b) => b.completionTimestamp - a.completionTimestamp
      );
      const index = sortedCompletedTodos.findIndex((t) => t.id === id);
      switch (index) {
        case 0:
          return "#4169E1";
        case 1:
          return "#50C878";
        case 2:
          return "#FFBF00";
        default:
          return "#adb5bd";
      }
    }
    return "inherit";
  };

  return (
    <li
      className={classnames({
        completed: todo.completed,
      })}
      data-testid="todo-item"
    >
      <div className="view">
        {isWritable ? (
          <Input
            onSubmit={handleUpdate}
            label="Edit Todo Input"
            defaultValue={title}
            onBlur={handleBlur}
          />
        ) : (
          <>
            <input
              className="toggle"
              type="checkbox"
              data-testid="todo-item-toggle"
              checked={completed}
              onChange={toggleItem}
            />
            <label
              data-testid="todo-item-label"
              onDoubleClick={handleDoubleClick}
              className={classnames({ "fading-item": isFading })}
              style={{ color: getCompletionColor() }}
            >
              {title}
            </label>
            <div className="timestamp-container">
              <span className="creation-timestamp">
                Created: {new Date(timestamp).toLocaleString()}
              </span>
              {completionTimestamp && (
                <span className="completion-timestamp">
                  Completed: {new Date(completionTimestamp).toLocaleString()}
                </span>
              )}
            </div>
            <button
              className="destroy"
              data-testid="todo-item-button"
              onClick={removeItem}
            />
          </>
        )}
      </div>
    </li>
  );
});
