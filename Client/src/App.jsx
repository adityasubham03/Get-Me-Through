import { Routes, Route, Navigate } from "react-router-dom";

import "./App.css";

import Layout from "./Layout";
import RegistrationForm from "./pages/register";
import Test from "./pages/test";
import axios from "axios";
import { UserContextProvider } from "./UserContext";
import LoginForm from "./pages/login";
import EventAddForm from "./pages/event/add";
import EventPage from "./pages/event/event";
import LoginForm2 from "./pages/login2";
import EventApplyPage from "./pages/event/apply";
import ForgetPassPage from "./pages/ForgetPassPage";
import EventAttendance from "./pages/event/mark";
import AccountPage from "./pages/AccountPage";
import Verify from "./pages/verify";
import Email from "./pages/email";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Logout from "./pages/logout";
import Intro from "./pages/intro";
import NotFound404 from "./pages/components/NotFound/NotFound404";

// axios.defaults.baseURL = "https://coral-app-xybu6.ondigitalocean.app";

const baseURL =
	window.location.hostname === "frontend.unknownclub.me"
		? "https://backend.unknownclub.me"
		: "http://localhost:5000";
// console.log(baseURL);

axios.defaults.baseURL = baseURL;

axios.defaults.withCredentials = true;

function App() {
	return (
		<UserContextProvider>
			<Routes>
				<Route path="/" element={<Layout />}>
					{/* <Route index element={<IndexPage />} />
					<Route path="/account/:subpage?" element={<AccountPage />} />
					<Route path="/account/:subpage/:action" element={<AccountPage />} /> */}
					<Route index element={<Navigate to="/dashboard" replace />} />
					<Route path="/events/add" element={<EventAddForm />} />
					<Route path="/events/apply/:eventId" element={<EventApplyPage />} />
					<Route path="/account/:subpage?" element={<AccountPage />} />
					<Route path="/test" element={<Test />} />
					<Route
						path="/events/mark/:eventId"
						element={<EventAttendance />}
						exact
					/>
					<Route path="/events" element={<EventPage />} />
					<Route path="/login2" element={<LoginForm />} />
					<Route path="/dashboard" element={<Intro />} />
					<Route path="/emails" element={<Email />} />
					<Route path="/about" element={<AboutUs />} />
					<Route path="/contact" element={<ContactUs />} />
				</Route>
				<Route path="/login" element={<LoginForm2 />} />
				<Route path="/logout" element={<Logout />} />
				<Route path="/register" element={<RegistrationForm />} />
				<Route path="/forget/:subpage?" element={<ForgetPassPage />} />
				<Route path="/verify" element={<Verify />} />
				<Route path="*" element={<NotFound404 />} />

				{/* <Route path="/login" element={<LoginPage />} />
				<Route path="/forget/:subpage?" element={<ForgetPassPage />} /> */}
			</Routes>
		</UserContextProvider>
	);
}

export default App;
