import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const moodTags = ["平静", "喜悦", "忧伤", "迷茫", "感激", "孤独", "期待", "疲惫", "感悟", "灵感"];
  const quotes = [
    "生活不在于你呼吸了多少次，而在于那些让你屏住呼吸的时刻。",
    "今天的风很温柔，像是在诉说一个古老的故事。",
    "代码是写给人看的，顺便给机器运行。",
    "所谓自由，不是随心所欲，而是自我主宰。",
    "愿你出走半生，归来仍是少年。",
    "星星发亮是为了让每一个人有一天都能找到属于自己的星星。",
    "与其向往，不如出发。",
    "每个人都是月亮，总有一个阴暗面，从来不让人看见。",
    "万物皆有裂痕，那是光照进来的地方。",
    "我们听过无数的道理，却仍旧过不好这一生。",
    "人的一生，本就是一场孤独的修行。",
    "所有的晦暗都留给过往，从遇见你开始，凛冬散尽，星河炽热。",
    "在这个世界，总有人在默默地爱着你。",
    "你要安静的优秀，悄无声息的坚强。",
    "所谓成长，就是即使在深夜痛哭，第二天依然能准时起床上班。",
    "生活不是为了赶路，而是为了感路。",
    "如果你简单，这个世界就对你简单。",
    "时间是治愈一切的良药。",
    "保持热爱，奔赴山海。",
    "山有峰顶，海有彼岸。漫漫长途，终有回转。",
    "你未必光芒万丈，但始终温暖有光。",
    "人生如逆旅，我亦是行人。",
    "既然选择了远方，便只顾风雨兼程。",
    "不要因为走得太远，而忘记了为什么出发。",
    "世间所有的惊喜，都源于你的努力。",
    "温柔是黑暗世界里唯一的亮光。",
    "哪怕生活在阴沟里，也要抬头仰望星空。",
    "一切都是最好的安排。",
    "心若向阳，无谓忧伤。",
    "生活虽然平凡，但也要过得浪漫。"
  ];

  console.log("正在填充 30 条模拟数据...");

  for (let i = 0; i < 30; i++) {
    const randomDate = new Date();
    randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30));

    await prisma.post.create({
      data: {
        content: quotes[i % quotes.length],
        moodTag: moodTags[Math.floor(Math.random() * moodTags.length)],
        isAnonymous: Math.random() > 0.5,
        createdAt: randomDate,
        updatedAt: randomDate,
      },
    });
  }

  console.log("30 条数据填充完成！");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
