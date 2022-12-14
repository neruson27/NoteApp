import axios from 'axios';

function backendNoteApp(method, route, data=undefined, token=undefined) {
  return axios({
    method,
    url: process.env.REACT_APP_BACKEND_URL + route,
    data,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }).catch(err => {
    throw err;
  })
}

export default backendNoteApp;