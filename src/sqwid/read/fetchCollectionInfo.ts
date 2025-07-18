import axios from "axios";
import { SQWID_BACKEND_URL } from "../../utils/constants";

// pass the id which we get from fetchCollectionByStats
export const fetchCollectionInfo = async (id: string) => {
    try {
        const res = await axios(
            `${SQWID_BACKEND_URL}/get/marketplace/collection/${id}`
        );
        const { data } = res;
        if (data.error) {
            return [];
        }
        return data;
    } catch (error) {
        return {
            error: true,
        };
    }
};