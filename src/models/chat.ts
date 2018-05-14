import { Message } from './message';
export interface Chat {
    users: Object,
    recipient: string,
    recipientPhoto: string,
    messages?: Array<Message>,
    unread?: boolean
}