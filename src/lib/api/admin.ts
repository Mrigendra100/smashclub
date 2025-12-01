import { apiClient } from '../api';

export interface AdminStats {
    totalBookings: number;
    bookingsToday: number;
    totalRevenue: number;
    revenueToday: number;
}

export interface AdminBooking {
    id: string;
    status: string;
    totalPrice: number;
    startTime: string;
    endTime: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
    court: {
        id: string;
        name: string;
    };
}

export interface PaginatedBookings {
    data: AdminBooking[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface ManualBookingInput {
    userId?: string;
    courtId?: string;
    startTime: string;
    endTime: string;
}

export interface BulkBookingInput {
    userId?: string;
    courtId?: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    daysOfWeek?: number[];
}

export interface BulkBookingResponse {
    successCount: number;
    failureCount: number;
    bookings: AdminBooking[];
    errors: Array<{ date: string; error: string }>;
}

export const adminApi = {
    // Get dashboard statistics
    getStats: async () => {
        const response = await apiClient.get<AdminStats>('/admin/stats');
        return response;
    },

    // Get all bookings with pagination
    getAllBookings: async (page: number = 1, limit: number = 10) => {
        const response = await apiClient.get<PaginatedBookings>(
            `/admin/bookings?page=${page}&limit=${limit}`
        );
        return response;
    },

    // Get today's bookings
    getTodayBookings: async () => {
        const response = await apiClient.get<AdminBooking[]>('/admin/bookings/today');
        return response;
    },

    // Create manual booking (admin only) with default values
    createManualBooking: async (data: ManualBookingInput) => {
        const bookingData = {
            userId: data.userId || '17a7f725-3b30-43e1-b151-a52e95e30bbe',
            courtId: data.courtId || '00000000-0000-0000-0000-000000000001',
            startTime: data.startTime,
            endTime: data.endTime,
        };
        const response = await apiClient.post<AdminBooking>('/admin/bookings', bookingData);
        return response;
    },

    // Create bulk booking across multiple days (admin only) with default values
    createBulkBooking: async (data: BulkBookingInput) => {
        const bulkData = {
            userId: data.userId || '17a7f725-3b30-43e1-b151-a52e95e30bbe',
            courtId: data.courtId || '00000000-0000-0000-0000-000000000001',
            startDate: data.startDate,
            endDate: data.endDate,
            startTime: data.startTime,
            endTime: data.endTime,
            daysOfWeek: data.daysOfWeek,
        };
        const response = await apiClient.post<BulkBookingResponse>('/admin/bookings/bulk', bulkData);
        return response;
    },
};
