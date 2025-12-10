import { useDispatch, useSelector } from "react-redux"

const useStore = (slice) => {
 const dispatch = useDispatch();

 if (!slice) return;

if (Array.isArray(slice)) {
    const state = {};
    slice.forEach((s) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        state[s] = useSelector((state) => state[s]);
    });
    state.dispatch = dispatch;
    return state;
}
}
export default useStore;
