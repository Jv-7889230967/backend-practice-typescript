import prisma from "../../src/DB/prisma-client";


const interestesSeeder = async () => {
    const interests = ["coding", "music", "sports", "traveling"];

    function pickTwoRandom(arr: string[]) {
        const shuffled = [...arr].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 2);
    }
    try {
        const addedInterests = await Promise.all(
            Array.from({ length: 100 }, (_, i) => {
                const index: number = i + 1;
                return prisma.user.update({
                    where: { id: index },
                    data: {
                        interests: pickTwoRandom(interests)
                    }
                })
            }
            )
        )
        console.log("users", addedInterests);
        console.log(`✅ Added interests to ${addedInterests.length} users`)
    } catch (error) {
        console.error('❌ Error during interests seeding:', error)
    }
}

interestesSeeder();