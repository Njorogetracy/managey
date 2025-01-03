import { axiosReq } from "../api/axiosDefaults";
import { jwtDecode } from "jwt-decode";

export const fetchMoreData = async (resource, setResource) => {
    try {
        const { data } = await axiosReq.get(resource.next)
        setResource(prevResource => ({
            ...prevResource,
            next: data.next,
            results: data.results.reduce((acc, cur) => {
                return acc.some((accResult) => accResult.id === cur.id)
                    ? acc
                    : [...acc, cur];
            }, prevResource.results),
        }));
    } catch (error) {
        console.log(error);
    }
}

export const setTokenTimestamp = (data) => {
    if (data?.refresh_token) {
      try {
        const refreshTokenTimestamp = jwtDecode(data.refresh_token).exp;
        localStorage.setItem("refreshTokenTimestamp", refreshTokenTimestamp);
      } catch (error) {
        console.error('Error decoding refresh token:', error);
      }
    } else {
      console.warn('No refresh token found in data');
    }
};  

export const shouldRefreshToken = () => {
    return !!localStorage.getItem("refreshTokenTimestamp");
};

export const removeTokenTimestamp = () => {
    localStorage.removeItem("refreshTokenTimestamp");
};