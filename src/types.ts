export interface Item {
  id?: string;
  title: string;
  description: string;
  type: "lost" | "found";
  category: string;
  location: string;
  geopoint?: {
    latitude: number;
    longitude: number;
  };
  imageUrl?: string;
  createdAt: any;
  updatedAt?: any;
  status: "active" | "resolved";
  authorId: string;
  reportedBy: string;
  authorEmail: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  phoneNumber?: string;
  createdAt: any;
}
