import { io } from 'socket.io-client';

const URL = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace('/api', '') : 'http://localhost:5000';
const socket = io(URL, { autoConnect: false });

export default socket;
