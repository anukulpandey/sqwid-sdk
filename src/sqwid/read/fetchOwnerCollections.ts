import axios from "axios";
import { SQWID_BACKEND_URL } from "../../utils/constants";

export const fetchOwnerCollections = async (evmAddress: string) => {
    try {
      const res = await axios.get(`${SQWID_BACKEND_URL}/get/collections/owner/${evmAddress}`);
      const collections = res.data.collections;
      localStorage.setItem("collections", JSON.stringify(collections));
      return collections;
    } catch (err: any) {
      if (err.toString().includes("404")) {
        return [];
      } else {
        console.error("Error fetching collections:", err);
        return err.toString();
      }
    }
  };
  