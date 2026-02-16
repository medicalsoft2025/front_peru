export interface AvailabilityUser {
    id: number;
    first_name: string;
    middle_name: string;
    last_name: string;
    second_last_name: string;
    full_name: string;
    user_specialty_name: string;
    city_id?: string;
    specialty?: {
        id: number;
        name: string;
    };
    branch?: {
        id: number;
        name: string;
        address: string;
    };
}

export interface AvailabilityBlock {
    start_time: string; // "HH:mm:ss"
    end_time: string;   // "HH:mm:ss"
}

export interface AvailabilityDay {
    date: string; // "YYYY-MM-DD"
    blocks: AvailabilityBlock[];
}

export interface AvailabilityData {
    availability_id: number;
    appointment_duration: number;
    appointment_type: {
        id: number;
        name: string;
    };
    user: AvailabilityUser;
    days: AvailabilityDay[];
}

export interface SelectedSlot {
    date: string;       // "YYYY-MM-DD"
    time: string;       // "HH:mm"
    user: AvailabilityUser;
    branch?: { name: string };
    appointmentType: { id: number; name: string };
    duration: number;
    availabilityId: number;
}

export interface AppointmentConfig {
    productId: string | null;
    productName?: string;
    consultationPurpose: string | null;
    consultationType: string | null;
    externalCause: string | null;
    appointmentType?: string;
}
