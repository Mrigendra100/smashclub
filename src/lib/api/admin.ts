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
    userId: string;
    courtId: string;
    startTime: string;
    endTime: string;
}

export interface BulkBookingInput {
    userId: string;
    courtId: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    daysOfWeek?: number[]; // Optional: [1,3,5] for Mon, Wed, Fri
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

    // Create manual booking (admin only)
    createManualBooking: async (data: ManualBookingInput) => {
        const response = await apiClient.post<AdminBooking>('/admin/bookings', data);
        return response;
    },

    // Create bulk booking across multiple days (admin only)
    createBulkBooking: async (data: BulkBookingInput) => {
        const response = await apiClient.post<BulkBookingResponse>('/admin/bookings/bulk', data);
        return response;
    },
};
