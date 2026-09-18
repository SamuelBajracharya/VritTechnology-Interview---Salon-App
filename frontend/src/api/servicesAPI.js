import api from './axios';

const getServices = () => api.get('/services/');

const getServiceById = (id) => api.get(`/services/${id}/`);

const createService = (serviceData) => api.post('/services/', serviceData);

const updateService = (id, serviceData) => api.put(`/services/${id}/`, serviceData);

const patchService = (id, serviceData) => api.patch(`/services/${id}/`, serviceData);

const deleteService = (id) => api.delete(`/services/${id}/`);

export {
    getServices,
    getServiceById,
    createService,
    updateService,
    patchService,
    deleteService
};

export default {
    getServices,
    getServiceById,
    createService,
    updateService,
    patchService,
    deleteService
};