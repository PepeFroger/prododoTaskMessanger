import {Routes, Route, Navigate} from "react-router-dom"
import { authRoutes, publicRoutes } from "../routes"
import { useContext } from "react"
import { Context } from "../main"

function ApiRouter(){
	const {user} = useContext(Context)
	console.log(user)
	return(
		<Routes>
				{user.isAuth && authRoutes.map(({path, Component})=>
					<Route key={path} path={path} element={<Component/>} exact/>
				)}
				{publicRoutes.map(({path, Component})=>
					<Route key={path} path={path} element={<Component/>} exact/>
				)}
				<Route path="*" element={<Navigate to="/" />} />

		</Routes>
	)
}


export default ApiRouter