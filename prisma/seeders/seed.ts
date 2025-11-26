import prisma from "../../src/DB/prisma-client"

async function main() {
    console.log('🌱 Starting seed...')
    const interests = ["coding", "music", "sports", "traveling"];

    function pickTwoRandom(arr: string[]) {
        const shuffled = [...arr].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 2);
    }
    const users = await Promise.all(
        Array.from({ length: 100 }, (_, i) => {
            const userNum = i + 1

            return prisma.user.upsert({
                where: { email: `user${userNum}@example.com` },
                update: {},
                create: {
                    email: `user${userNum}@example.com`,
                    name: `User ${userNum}`,
                    hobbies: ["cycling", "hiking", "reading"],
                    interests: pickTwoRandom(interests)
                },
            })
        })
    )

    console.log(`✅ Created/updated ${users.length} users`)
    console.log(`📝 Total posts created: ${users.length * 2}`)
}

main()
    .catch((e) => {
        console.error('❌ Error during seeding:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
