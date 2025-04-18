import { Server, Socket } from 'socket.io';

export function setupSocketIO(io: Server) {
    io.on('connection', (socket: Socket) => {
        console.log('[Socket] New client connected:', socket.id);

        socket.on('disconnect', () => {
            console.log('[Socket] Client disconnected:', socket.id);
        });

        socket.on('state-updated', () => {
            console.log('[Socket] State updated');
        });

        socket.on('state-reset', () => {
            console.log('[Socket] State reset')
        })
    });
}