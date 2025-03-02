import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

const basePath = '/api/subscription'

const endpoint = {
    schedule: basePath + '/api/v1/schedule',
    extend: basePath + '/extend',
    create: basePath +'/create',
}

export {api, endpoint}
