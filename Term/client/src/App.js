import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TaskProvider } from "./context/tasksContext";
import Tasks from "./components/Tasks";
import { AuthContextProvider } from "./components/AuthContext";
import Signin from "./components/Signin";
import Signup from './components/Signup';
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./components/HomePage";
function App() {
	return (
		<>
			<BrowserRouter>
				{/* {loading && <AppLoader />} */}
				<Routes>

					<Route path='/' element={<AuthContextProvider><Signin /></AuthContextProvider>} />
					<Route path='/signup' element={<AuthContextProvider><Signup /></AuthContextProvider>} />
					<Route path="/home" element={<AuthContextProvider><TaskProvider><ProtectedRoute><HomePage /></ProtectedRoute></TaskProvider></AuthContextProvider>} />
					<Route path="/tasks" element={<AuthContextProvider><TaskProvider><ProtectedRoute><Tasks /></ProtectedRoute></TaskProvider></AuthContextProvider>} />
				</Routes>
			</BrowserRouter>
		</>

	);
}

export default App;
