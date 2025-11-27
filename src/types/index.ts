export interface Court {
    id: string;
    name: string;
    type: 'SINGLE' | 'DOUBLE';
    baseRate: number;
    isActive: boolean;
}

export interface TimeSlot {
    startTime: string;
    endTime: string;
    hour: number;
    price: number;
    isBooked: boolean;
}

export interface DayAvailability {
    date: string;
    dayOfWeek: number;
    dayName: string;
    totalSlots: number;
    bookedSlots: number;
    availableSlots: number;
    slots: TimeSlot[];
}

export interface CourtWithAvailability extends Court {
    availability: DayAvailability[];
}

export interface Booking {
    id: string;
    userId: string;
    courtId: string;
    startTime: string;
    endTime: string;
    date: string;
    totalPrice: number;
    pricePerHour: number;
    durationHours: number;
    status: 'CONFIRMED' | 'CANCELLED' | 'PENDING';
    createdAt: string;
    court?: Court;
}

export interface Pass {
    id: string;
    userId: string;
    type: 'MONTHLY' | 'YEARLY';
    validUntil: string;
    remainingCredits: number | null;
    isActive: boolean;
    createdAt: string;
}

export interface PricingRule {
    id: string;
    courtId: string | null;
    dayOfWeek: number | null;
    hour: number;
    price: number;
    isActive: boolean;
    createdAt: string;
    court?: Court | null;
}

export interface RazorpayOrder {
    id: string;
    entity: string;
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: string;
    receipt: string;
    status: string;
    attempts: number;
    notes: any;
    created_at: number;
}

export interface BookingInitiateResponse {
    booking: Booking;
    order: RazorpayOrder;
}

export interface BookingVerifyDto {
    orderId: string;
    paymentId: string;
    signature: string;
}

export interface CreateBookingDto {
    courtId: string;
    startTime: string;
    endTime: string;
}

export interface PurchasePassDto {
    type: 'MONTHLY' | 'YEARLY';
}

export interface AvailabilitySlot {
    startTime: string;
    endTime: string;
}
