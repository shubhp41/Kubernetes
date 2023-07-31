import { Axios } from "axios";
import AxiosInstance from "./axios";

const GetTodos = async (uniqueId, onSuccess, onError) => {
    try {
        const res = await AxiosInstance.get(
            "/todos",
            {
                headers: { "Content-Type": "application/json" },
                params: { uniqueId },
            }
        );

        onSuccess && onSuccess(res);
    } catch (err) {
        onError && onError(err);
    }
};
const AddTasks = async (data, onSuccess, onError) => {
    try {
        const res = await AxiosInstance.post("/todo/new", data, {
            headers: { "Content-Type": "application/json" },
        });
        onSuccess && onSuccess(res);
    } catch (err) {
        onError && onError(err);
    }
}
export { GetTodos, AddTasks }