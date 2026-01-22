import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const posts = [
    {
      content: "生活不在于你呼吸了多少次，而在于那些让你屏住呼吸的时刻。",
      moodTag: "感悟",
      isAnonymous: true,
    },
    {
      content: "今天的风很温柔，像是在诉说一个古老的故事。",
      moodTag: "心情",
      isAnonymous: false,
    },
    {
      content: "代码是写给人看的，顺便给机器运行。",
      moodTag: "职场",
      isAnonymous: true,
    },
    {
      content: "所谓自由，不是随心所欲，而是自我主宰。",
      moodTag: "哲学",
      isAnonymous: false,
    },
    {
      content: "愿你出走半生，归来仍是少年。",
      moodTag: "祝愿",
      isAnonymous: true,
    },
  ];

  console.log("正在填充初始数据...");

  for (const post of posts) {
    await prisma.post.create({
      data: post,
    });
  }

  console.log("数据填充完成！");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
