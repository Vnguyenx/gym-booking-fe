import { Role } from '../constants/roles';

export interface Banner {
    id?: string;
    imageUrl: string;
    isActive: boolean;
    link: string;
    order: number;
    subtitle: string;
    title: string;
}

export interface PT {
    id?: string;
    fullname: string;
    specialty: string;
    imageUrl: string;
    isActive: boolean;
    order: number;
}

// User này mở rộng từ User trong authSlice của bạn
export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    role: Role;
    phone?: string;
    avatarUrl?: string;
    createdAt?: any;
}


export interface Floor {
    id?: string;
    name: string;
    floorNumber: number;
    description: string;
    gymId: string;
    area: number;
    img: string;
}


export interface Location {
   latitude: number;
   longitude: number;
   mapUrl: string;
}

export interface Amenities{
    locker: boolean;
    parking: boolean;
    parkingNote: string;
    shower: boolean;
    toilet: boolean;
    toiletNote: string;
    waterFilter: number;
    waterFilterNote: string;
    wifi: boolean;
    wifiNote: string;
}

export interface GymInfo {
    id?: string;
    name: string;
    description: string;
    address: string;
    location: Location;
    phone: string;
    openTime: string;
    totalFloors: number;
    coverImageUrl: string;
    amenities: Amenities;

}

export interface Zone {
    id?: string;
    name: string;
    description: string;
    floorId: string;
    gymId: string;
}

export interface Equipment {
    id?: string;

    name: string;
    nameVi: string;

    description: string;
    category: string;
    subCategory: string;

    floorId: string;
    gymId: string;
    zoneId: string;

    imageUrls: string[];

    isActive: boolean;
    quantity: number;

    muscleGroups: string[];

    tips: string;

    updatedAt: Date;

}