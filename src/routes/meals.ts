import { randomUUID } from 'node:crypto'
import { knex } from '../database'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { checkSessionIdExists } from '../middlewares/check-sessions-id-exists'

export async function mealsRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const userId = request.user?.id

      if (!userId) {
        return reply.status(401).send({
          error: 'Unauthorized.',
        })
      }
      const meals = await knex('meals')
        .select('*')
        .where('user_id', userId)
        .orderBy('date', 'desc')

      return { meals }
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const getMealParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealParamsSchema.parse(request.params)

      const userId = request.user?.id

      if (!userId) {
        return reply.status(401).send({
          error: 'Unauthorized.',
        })
      }
      const meal = await knex('meals')
        .where({
          id,
          user_id: userId,
        })
        .select()
        .orderBy('date', 'desc')
        .first()

      return { meal }
    },
  )

  app.get(
    '/summary',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const userId = request.user?.id

      if (!userId) {
        return reply.status(401).send({
          error: 'Unauthorized.',
        })
      }

      const totalMeals = await knex('meals')
        .select()
        .where({ user_id: userId })
        .orderBy('date', 'desc')

      const totalMealsInTheDiet = await knex('meals')
        .where({
          user_id: userId,
          is_diet: true,
        })
        .count('is_diet', {
          as: 'total',
        })
        .first()

      const totalMealsOutTheDiet = await knex('meals')
        .where({
          user_id: userId,
          is_diet: false,
        })
        .count('is_diet', {
          as: 'total',
        })
        .first()

      const { rankDietSequence } = totalMeals.reduce(
        (acc, meal) => {
          if (meal.is_diet) {
            acc.currentSequence += 1
          } else {
            acc.currentSequence = 0
          }

          if (acc.currentSequence > acc.rankDietSequence) {
            acc.rankDietSequence = acc.currentSequence
          }

          return acc
        },
        { rankDietSequence: 0, currentSequence: 0 },
      )

      return {
        summary: {
          totalMeals: totalMeals.length,
          totalMealsInTheDiet: totalMealsInTheDiet?.total,
          totalMealsOutTheDiet: totalMealsOutTheDiet?.total,
          rankDietSequence,
        },
      }
    },
  )

  app.post(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const createMealsBodySchema = z.object({
        title: z.string(),
        description: z.string(),
        isDiet: z.boolean(),
        date: z.coerce.date(),
      })

      const { title, description, isDiet, date } = createMealsBodySchema.parse(
        request.body,
      )

      await knex('meals').insert({
        id: randomUUID(),
        title,
        description,
        is_diet: isDiet,
        date: date.getTime(),
        user_id: request.user?.id,
      })

      return reply.status(201).send()
    },
  )

  app.put(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const editMealBodySchema = z.object({
        title: z.string(),
        description: z.string(),
        isDiet: z.boolean(),
        date: z.coerce.date(),
      })

      const { title, description, isDiet, date } = editMealBodySchema.parse(
        request.body,
      )

      const getMealParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealParamsSchema.parse(request.params)

      const userId = request.user?.id

      if (!userId) {
        return reply.status(401).send({
          error: 'Unauthorized.',
        })
      }

      await knex('meals')
        .where({
          id,
          user_id: userId,
        })
        .update({
          title,
          description,
          is_diet: isDiet,
          date: date.getTime(),
        })

      return reply.status(204).send()
    },
  )

  app.delete(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const deleteMealParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = deleteMealParamsSchema.parse(request.params)

      const userId = request.user?.id

      if (!userId) {
        return reply.status(401).send({
          error: 'Unauthorized',
        })
      }

      await knex('meals')
        .where({
          id,
          user_id: userId,
        })
        .del()

      return reply.status(204).send()
    },
  )
}
