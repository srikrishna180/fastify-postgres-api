import { createServer } from 'src/server'

const main = async () => {
    const fastify = await createServer();
    const port = Number(fastify.config.PORT)

    try {
        fastify.listen({ port }, () => {
            fastify.log.info(`Listening on ${port}...`)
        })
    } catch (error) {
        fastify.log.error('fastify.listen:', error)
        process.exit(1)
    }
}

main()
