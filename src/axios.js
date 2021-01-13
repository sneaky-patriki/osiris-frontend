import axios from 'axios'
import qs from 'qs';
import _ from 'lodash';

import { toast } from 'react-toastify';

// axios.defaults.baseURL = "http://127.0.0.1:8080"
axios.defaults.baseURL = "https://pure-chamber-53906.herokuapp.com"
axios.defaults.headers.put['Content-Type'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.delete['Content-Type'] = 'application/json';

// temporarily cancel all requests until backend is ready
const CancelToken = axios.CancelToken;

axios.interceptors.request.use((request) => {
    // if (request.method === 'put' || request.method === 'post' || request.method === 'delete') {
    //     request.data = qs.stringify(request.data);
    // }
    return request;
});

const errorHandler = (error) => {
    // great gist https://gist.github.com/saqueib/a495af17d7c0e2fd5c2316b0822ebac3

    // if has response show the error
    console.error(error);

    let message = 'An error occurred.';

    if (error.response) {
        console.log(error.response.data)
        message = _.get(error, 'response.data.message') || message;
    }
    console.log(message)

    // toast.error(message); // This isn't working
    var errorBlock = document.getElementById('error')
    errorBlock.innerHTML = message
    errorBlock.style.display = 'block'

    return Promise.reject({ ...error })
}

const responseHandler = (response) => {
    return response;
}

axios.interceptors.response.use(responseHandler, errorHandler);
