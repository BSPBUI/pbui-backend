import express, { Router } from 'express';
import { PBState } from '../lib/types/pb';
import path from 'path';
import fs from 'fs';
import io from 'socket.io-client';

const statePath = path.join(__dirname, '..', 'stores', 'currentState.json');

let currentState: PBState;

try {
    const raw = fs.readFileSync(statePath, 'utf-8');
    currentState = JSON.parse(raw);
} catch (error) {
    console.error('Failed to load currentState.json:', error);

    currentState = {
        song_states: {},
        current_flow_step: 0
    };
    fs.writeFileSync(statePath, JSON.stringify(currentState, null, 2));
}

const router: Router = express.Router();

router.get('/', (req, res) => {
    res.status(200).send({ status: 'success', state: currentState });
});

router.post('/update', (req, res) => {
    const newState = req.body as PBState;
    updateState(newState);
    res.json({ status: 'success', state: newState });
});

router.post('/reset', (req, res) => {
    try {
        const socket = io('http://localhost:3001/ws');

        currentState = {
            song_states: {},
            current_flow_step: 0
        };
        socket.emit('state-reset');
        res.status(200).send({ status: 'success' });
    } catch (err) {
        res.status(400).send({ status: 'error', error: err });
    }
});

function updateState(newState: Partial<PBState>) {
    const socket = io('http://localhost:3001/ws');

    if (newState.song_states) {
        currentState.song_states = newState.song_states;
    }
    if (newState.current_flow_step !== undefined) {
        currentState.current_flow_step = newState.current_flow_step;
    }

    setTimeout(() => {
        socket.emit('state-updated', currentState);
    }, 150);

    fs.writeFileSync(statePath, JSON.stringify(currentState, null, 2));
}

export default router;