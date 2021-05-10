import axios from 'axios';


//in tracks run ngrok http 3000
export default axios.create({
  baseURL: 'http://e33059a3fdde.ngrok.io'
});