import axios from "axios";
import { SQWID_BACKEND_URL } from "../../utils/constants";

export const STATS_ORDER = {
    ITEMS: "items",
    VOLUME: "volume",
    ITEMS_SOLD: "itemsSold",
    AVERAGE: "average",
} as const;

export type StatsOrder = (typeof STATS_ORDER)[keyof typeof STATS_ORDER];

export const fetchCollectionsByStats = async (
    order: StatsOrder
) => {
    try {
        const res = await axios(
            `${SQWID_BACKEND_URL}/get/collections/all/by/stats.${order}`
        );
        return res.data;
    } catch (e) {
        console.error("Error fetching collections:", e);
        return { collections: [] };
    }
};
