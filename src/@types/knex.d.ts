// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      session_id: string

      name: string
      password: string
      email: string
      created_at: string
      updated_at: string
    }
    meals: {
      id: string
      user_id: string
      title: string
      description: string
      is_diet: boolean
      date: number

      created_at: string
      updated_at: string
    }
  }
}
