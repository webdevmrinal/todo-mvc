import { useReducer, useState, useCallback } from "react";
import { Header } from "./components/header";
import { Main } from "./components/main";
import { Footer } from "./components/footer";

import { todoReducer } from "./reducer";

import "./app.css";

export function App() {
	const [todos, dispatch] = useReducer(todoReducer, []);
	const [newestItemTimestamp, setNewestItemTimestamp] = useState(null);

	const wrappedDispatch = useCallback(
		(action) => {
			if (action.type === "ADD_ITEM") {
				const timestamp = Date.now();
				dispatch({
					...action,
					payload: {
						...action.payload,
						timestamp,
					},
				});
				setNewestItemTimestamp(timestamp);
			} else {
				dispatch(action);
			}
		},
		[dispatch]
	);

	return (
		<>
			<Header dispatch={wrappedDispatch} />
			<Main
				todos={todos}
				dispatch={wrappedDispatch}
				newestItemTimestamp={newestItemTimestamp}
			/>
			<Footer todos={todos} dispatch={wrappedDispatch} />
		</>
	);
}
