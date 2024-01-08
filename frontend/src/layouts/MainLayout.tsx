import { Header } from "../components/Header";
import { Outlet } from "react-router-dom";
import "./mainlayout.module.css";

const MainLayout = () => {
	return (
		<div className="flex flex-col h-screen w-screen items-center">
			<div className="p-6">
				<Header mode="default" />
			</div>

			<main>
				<Outlet />
			</main>
		</div>
	);
};

export default MainLayout;
