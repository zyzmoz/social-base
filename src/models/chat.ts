import { Message } from './message';
export interface Chat {
    users: Object,
    messages?: Array<Message>,
}