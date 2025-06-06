import Analitic from "./pages/Analitic.jsx";
import TaskPage from "./pages/TaskPage.jsx";
import TaskBoard from "./pages/TaskBoard.jsx";
import Auth from "./pages/Auth.jsx";
import { ANALITIC_ROUTE, TASK_ROUTE, TASKBOARD_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE } from "./utils/consts.jsx";



export const authRoutes = [
	{
		path: ANALITIC_ROUTE,
		Component: Analitic
	},
	{
		path: TASK_ROUTE + '/:id',
		Component: TaskPage
	},
]

export const publicRoutes = [
	{
		path:LOGIN_ROUTE,
		Component: Auth
	},
	{
		path:REGISTRATION_ROUTE,
		Component: Auth
	},
		{
		path: TASKBOARD_ROUTE,
		Component: TaskBoard
	},
]