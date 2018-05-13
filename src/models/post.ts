export interface Post {
    createdAt: Date,
    text?: string,
    photoURL?: string,
    postBy: string,
    user: string,
    userPhoto?: string,
    likes?: Array<any>,
    comments?: Array<any>,
    location?: Object,
    address?: string,
    postOwner?: string,
    postOwnerId?: string
}