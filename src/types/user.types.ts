export interface IEmail {
  email: string
  verified: boolean
  primary: boolean
}

export interface IPhone {
  phone: string
  verified: boolean
  primary: boolean
}

export interface IUser {
  _id: string
  username: string
  name?: string
  emails: IEmail[]
  phones?: IPhone[]
  image?: string
  isAdmin: boolean
  verificationCode: string
  verified: boolean
  createdAt: number
  updatedAt: number
  deleted: boolean
}
