import React from "react";

//include images into your bundle
import rigoImage from "../../img/rigo-baby.jpg";

import Todo from "./Todo.jsx";


//create your first component
const Home = () => {
	return (
		<div className="text-center">
            

			<Todo/>
		</div>
	);
};

export default Home;