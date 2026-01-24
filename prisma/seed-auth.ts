import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('123456', 10)
  
  const user = await prisma.user.upsert({
    where: { email: 'test@moodflow.com' },
    update: {},
    create: {
      email: 'test@moodflow.com',
      name: '星空旅人',
      password: hashedPassword,
    },
  })

  console.log('测试用户已创建:', user.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
