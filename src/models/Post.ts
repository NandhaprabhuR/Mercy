export interface User {
    id: string;
    username: string;
    avatarUrl: string;
}

export interface Post {
    id: string;
    author: User;
    imageUrl: string;
    likes: number;
    caption: string;
    // Specific properties for the custom PEAK aesthetic mockups
    overlayType?: 'diagonal-green' | 'bottom-gradient' | 'diagonal-white';
    overlayTextLine1?: string;
    overlayTextLine2?: string;
    overlayTextLine3?: string;
    overlayTextLine4?: string;
}
