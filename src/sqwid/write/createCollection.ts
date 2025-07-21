import axios from "axios";
import { SQWID_BACKEND_URL } from "../../utils/constants";

const createCollection = async (file:any, name:string, description:string) => {
	const data = new FormData();
	data.append("fileData", file);
	data.append("name", name);
	data.append("description", description);
	const address = JSON.parse(localStorage.getItem("auth")!)?.auth.address;
	let jwt = address
		? JSON.parse(localStorage.getItem("tokens")!).find(
				(token:any) => token.address === address
		  )
		: null;
	if (jwt) {
		try {
			return await axios.post(`${SQWID_BACKEND_URL}/create/collection`, data, {
				headers: {
					Authorization: `Bearer ${jwt.token}`,
				},
			});
		} catch (error) {
			// console.log (error);
		}
	} else return null;
};

export { createCollection };
