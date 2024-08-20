import React, { memo, useState, useCallback, useEffect } from "react";
import classnames from "classnames";

import { Input } from "./input";

import { TOGGLE_ITEM, REMOVE_ITEM, UPDATE_ITEM } from "../constants";

export const Item = memo(function Item({ todo, dispatch, index, isNew }) {
	const [isWritable, setIsWritable] = useState(false);
	const [isFading, setIsFading] = useState(isNew);
	const { title, completed, id } = todo;

	console.log("isNew: ", isNew);

	useEffect(() => {
		if (isNew) {
			setIsFading(true);
			const timer = setTimeout(() => {
				setIsFading(false);
			}, 15000);
			return () => clearTimeout(timer);
		}
	}, [isNew]);

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

	console.log("isFading", isFading);

	return (
		<li
			className={classnames({
				completed: todo.completed,
				"fading-item": isFading,
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
							className={classnames({
								"fading-item": isFading,
							})}
						>
							{title}
						</label>
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
