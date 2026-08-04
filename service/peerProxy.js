const { WebSocketServer, WebSocket } = require("ws");

const connections = new Map();

function peerProxy(httpServer) {
	const socketServer = new WebSocketServer({ server: httpServer });

	socketServer.on("connection", (socket) => {
		socket.isAlive = true;

		socket.on("error", (err) => {
			console.log("WebSocket connection dropped:", err.message);
		});

		socket.on("message", function message(data) {
			try {
				const parsed = JSON.parse(data);

				if (parsed.type === "auth" && parsed.userId) {
					socket.userId = parsed.userId;
					connections.set(parsed.userId, socket);
				}
			} catch (err) {
				console.error("WebSocket message error:", err);
			}
		});

		socket.on("pong", () => {
			socket.isAlive = true;
		});

		socket.on("close", () => {
			if (socket.userId) {
				if (connections.get(socket.userId) === socket) {
					connections.delete(socket.userId);
				}
			}
		});
	});

	setInterval(() => {
		socketServer.clients.forEach(function each(client) {
			if (client.isAlive === false) return client.terminate();
			client.isAlive = false;
			client.ping();
		});
	}, 10000);
}

function notifyUser(userId, type, payload) {
	const socket = connections.get(userId.toString());
	if (socket && socket.readyState === WebSocket.OPEN) {
		socket.send(JSON.stringify({ type, payload }));
	}
}

module.exports = { peerProxy, notifyUser };
