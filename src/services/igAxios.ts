import API from "./api"

export const igPost = (url: any, data: any) => {
    return API.post(url, data);
}
