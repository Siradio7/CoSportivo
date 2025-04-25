import { io } from "socket.io-client"

let socket

const initializeSocket = () => {
	const SOCKET_URL = import.meta.env.VITE_DEV_SOCKET_URL
  	socket = io(SOCKET_URL, {
		transports: ["websocket"],
		withCredentials: true
  	})

	socket.on("connect", () => {
		console.log("Connecté au serveur Socket.IO")
	})

	socket.on("disconnect", () => {
		console.log("Déconnecté du serveur Socket.IO")
	})

	socket.on("error", (error) => {
		console.error("Erreur socket:", error)
	})

	return socket
}

const getSocket = () => {
	if (!socket) {
		return initializeSocket()
	}

	return socket
}

const disconnectSocket = () => {
	if (socket) {
		socket.disconnect()
	}
}

export { initializeSocket, getSocket, disconnectSocket }