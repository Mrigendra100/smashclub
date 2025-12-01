import axios from 'axios';
import { Court, CourtWithAvailability, Booking, Pass, CreateBookingDto, PurchasePassDto, AvailabilitySlot, PricingRule, BookingInitiateResponse, BookingVerifyDto } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
export const setAuthToken = (token: string | null) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

// Courts API
export const courtsApi = {
    getAll: () => api.get<Court[]>('/courts'),
    getAllWithAvailability: () => api.get<CourtWithAvailability[]>('/courts/with-availability'),
    getById: (id: string) => api.get<Court>(`/courts/${id}`),
};

// Bookings API
export const bookingsApi = {
    initiate: (data: CreateBookingDto) => api.post<BookingInitiateResponse>('/bookings/initiate', data),
    bulkInitiate: (data: CreateBookingDto[]) => api.post<{ bookings: Booking[], order: { id: string, amount: number, currency: string }, paymentId: string }>('/bookings/bulk', data),
    verify: (data: BookingVerifyDto) => api.post<Booking>('/bookings/verify', data),
    getMy: () => api.get<Booking[]>('/bookings/my'),
    getAvailability: (courtId: string, date: string) =>
        api.get<AvailabilitySlot[]>(`/bookings/availability/${courtId}`, { params: { date } }),
    cancel: (id: string) => api.delete(`/bookings/${id}`),
};

// Passes API
export const passesApi = {
    purchase: (data: PurchasePassDto) => api.post<Pass>('/passes/purchase', data),
    getMy: () => api.get<Pass[]>('/passes/my'),
};

// Pricing Rules API
export const pricingApi = {
    getRules: () => api.get<PricingRule[]>('/pricing/rules'),
    getRulesByCourt: (courtId: string) => api.get<PricingRule[]>(`/pricing/rules/court/${courtId}`),
};

// Users API
export const usersApi = {
    getMe: () => api.get<{ id: string; email: string; role: string; name?: string }>('/users/me'),
};

// Export the axios instance for use in other modules
export const apiClient = api;

export default api;
