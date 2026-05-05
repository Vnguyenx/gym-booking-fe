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

// Thêm interface cho object bên trong mảng Benefits của PTInfo
export interface Benefit {
    title: string;
    content: string;
}

// Thêm collection pt_info
export interface PTInfo {
    id?: string;
    Benefits: Benefit[];
    description: string;
    img: string;
    updateAt: Date;
}

// Cập nhật lại collection pts theo đúng database
export interface PT {
    id?: string;
    avatar: string;
    bio: string;
    experience: string;
    fullName: string;
    gender: 'Nam' | 'Nữ' | string;
    isAvailable: boolean;
    specialty: string[]; // Trong DB đang là mảng string
    updateAt: Date;
}

// User này mở rộng từ User trong authSlice của bạn
export interface UserProfile {
    id?: string;
    uid: string;
    email: string;
    displayName: string;
    role: Role;
    phone: string;
    avatarUrl: string;
    createdAt: Date;
}

export interface PTApplication {
    id?: string;
    avatarUrl: string;
    fullName: string;
    email: string;
    phone: string;
    gender: string;
    specialty: string[];
    experience: string;
    bio: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: any;
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

export interface Membership {
    id?: string;
    /** Tên gói tập, ví dụ: "Gói tập 3 tháng" */
    name: string;
    /** Số tháng của gói */
    durationMonths: number;
    /** Giá gốc (đồng) */
    price: number;
    /** Giá khi đăng ký online (đồng) */
    priceOnline: number;
    /** Ghi chú ngắn, ví dụ: "330K/tháng" */
    note: string;
    /** Có phải gói phổ biến nhất không */
    isPopular?: boolean;
    /** Danh sách quyền lợi / tính năng nổi bật */
    promotions: string[];
}