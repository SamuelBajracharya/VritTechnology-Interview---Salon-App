import api from './axios';

const getAppointments = (statusOrParams) => {
  let params = {};
  if (typeof statusOrParams === 'string') {
    params = statusOrParams ? { status: statusOrParams } : {};
  } else if (typeof statusOrParams === 'object' && statusOrParams !== null) {
    params = statusOrParams;
  }
  return api.get('/appointments/', { params });
};

const getAppointmentById = (id) => api.get(`/appointments/${id}/`);

const createAppointment = (appointmentData) => api.post('/appointments/', appointmentData);

const updateAppointment = (id, appointmentData) =>
  api.put(`/appointments/${id}/`, appointmentData);

const patchAppointment = (id, appointmentData) =>
  api.patch(`/appointments/${id}/`, appointmentData);

const updateAppointmentStatus = (id, status) =>
  api.patch(`/appointments/${id}/status/`, { status });

const deleteAppointment = (id) => api.delete(`/appointments/${id}/`);

export {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  patchAppointment,
  updateAppointmentStatus,
  deleteAppointment
};

export default {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  patchAppointment,
  updateAppointmentStatus,
  deleteAppointment
};