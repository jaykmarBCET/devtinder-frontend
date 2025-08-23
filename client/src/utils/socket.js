import io from "socket.io-client";

export const createSocketConnection = (options) => io(import.meta.env.VITE_BACKEND_URL, options); 

