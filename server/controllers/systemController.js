import * as systemService from '../services/system.service.js';
import prisma from '../prismaClient.js'
export const getSystemParameters = async (req, res) => {
    try {
        const parameters = await systemService.getSystemParameters();
        return res.status(200).json(parameters);
    } catch (err) {
        return res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
    }
}
export const updateSystemParameters = async (req, res) => {
    try {
        const params = req.body;
        const updatedParams = await systemService.updateSystemParameters(params);
        return res.status(200).json(updatedParams);
    } catch (err) {
        return res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
    }
}