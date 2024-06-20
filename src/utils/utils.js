import { axiosReq } from "../api/axiosDefaults";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export const fetchMoreData = async (resource, setResource) => {
    try {
        const {data} = await axiosReq.get(resource.next)
        setResource(prevResource => ({
            ...prevResource,
            next:data.next,
            results: data.results.reduce((acc, cur) => {
                return acc.some((accResult) => accResult.id === CurrentUserContext.id)
                ? acc
                : [...acc, cur];
            }, prevResource.results),
        }));
    } catch (error) {
        console.log(error);
    }
}