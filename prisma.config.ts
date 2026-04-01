import "dotenv/config";

// Отладочный вывод
console.log("POSTGRES_URI from env:", process.env.POSTGRES_URI);

export default {
    schema: "prisma/schema.prisma",
    datasource: {
        url: process.env.POSTGRES_URI,
    },
};