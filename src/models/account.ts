export interface Account {
    uid: string,
    name: string,
    username: string,
    description?: string,
    email: string,
    phone: string,
    photoURL: string,
    following?: Array<any>,
    followers?: Array<any>,
    friends?:  Array<any>,
    bookmark?: Array<any> 

  }
  