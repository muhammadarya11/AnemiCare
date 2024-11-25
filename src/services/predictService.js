import axios from 'axios';
import { spawnSync } from 'child_process';
import path from 'path';

export const predictAnemia = async (input) => {

    try {
        const { data } = await axios.post('http://localhost:5000/predict', {
            input: input
        });

        return data.data;
    } catch (error) {
        return null;
    }
};

