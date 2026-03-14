import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('🌱 开始初始化种子数据...\n');
  
  try {
    console.log('📦 初始化能力分类...');
    
    const categories = await Promise.all([
      prisma.abilityCategory.upsert({
        where: { slug: 'languages' },
        update: {},
        create: {
          name: 'Languages',
          slug: 'languages',
          description: 'Language skills and proficiency',
          sortOrder: 1,
        },
      }),
      prisma.abilityCategory.upsert({
        where: { slug: 'sports' },
        update: {},
        create: {
          name: 'Sports',
          slug: 'sports',
          description: 'Physical activities and sports',
          sortOrder: 2,
        },
      }),
      prisma.abilityCategory.upsert({
        where: { slug: 'arts' },
        update: {},
        create: {
          name: 'Arts',
          slug: 'arts',
          description: 'Creative and artistic abilities',
          sortOrder: 3,
        },
      }),
      prisma.abilityCategory.upsert({
        where: { slug: 'technology' },
        update: {},
        create: {
          name: 'Technology',
          slug: 'technology',
          description: 'Technical and digital skills',
          sortOrder: 4,
        },
      }),
      prisma.abilityCategory.upsert({
        where: { slug: 'social' },
        update: {},
        create: {
          name: 'Social',
          slug: 'social',
          description: 'Social and interpersonal skills',
          sortOrder: 5,
        },
      }),
    ]);

    console.log(`✅ 已初始化 ${categories.length} 个能力分类\n`);

    console.log('📦 初始化能力预设...');

    const presets = await Promise.all([
      prisma.abilityPreset.upsert({
        where: { slug: 'english' },
        update: {},
        create: {
          name: 'English',
          slug: 'english',
          description: 'English language proficiency',
          categoryId: categories[0].id,
        },
      }),
      prisma.abilityPreset.upsert({
        where: { slug: 'spanish' },
        update: {},
        create: {
          name: 'Spanish',
          slug: 'spanish',
          description: 'Spanish language proficiency',
          categoryId: categories[0].id,
        },
      }),
      prisma.abilityPreset.upsert({
        where: { slug: 'mandarin' },
        update: {},
        create: {
          name: 'Mandarin Chinese',
          slug: 'mandarin',
          description: 'Mandarin Chinese language proficiency',
          categoryId: categories[0].id,
        },
      }),
      prisma.abilityPreset.upsert({
        where: { slug: 'basketball' },
        update: {},
        create: {
          name: 'Basketball',
          slug: 'basketball',
          description: 'Basketball skills',
          categoryId: categories[1].id,
        },
      }),
      prisma.abilityPreset.upsert({
        where: { slug: 'swimming' },
        update: {},
        create: {
          name: 'Swimming',
          slug: 'swimming',
          description: 'Swimming abilities',
          categoryId: categories[1].id,
        },
      }),
      prisma.abilityPreset.upsert({
        where: { slug: 'drawing' },
        update: {},
        create: {
          name: 'Drawing',
          slug: 'drawing',
          description: 'Drawing and sketching',
          categoryId: categories[2].id,
        },
      }),
      prisma.abilityPreset.upsert({
        where: { slug: 'music' },
        update: {},
        create: {
          name: 'Music',
          slug: 'music',
          description: 'Musical abilities',
          categoryId: categories[2].id,
        },
      }),
      prisma.abilityPreset.upsert({
        where: { slug: 'programming' },
        update: {},
        create: {
          name: 'Programming',
          slug: 'programming',
          description: 'Software development skills',
          categoryId: categories[3].id,
        },
      }),
      prisma.abilityPreset.upsert({
        where: { slug: 'leadership' },
        update: {},
        create: {
          name: 'Leadership',
          slug: 'leadership',
          description: 'Leadership and management',
          categoryId: categories[4].id,
        },
      }),
    ]);

    console.log(`✅ 已初始化 ${presets.length} 个能力预设\n`);

    console.log('✨ 种子数据初始化完成！');
    console.log('\n📊 统计:');
    console.log(`   - 能力分类: ${categories.length} 个`);
    console.log(`   - 能力预设: ${presets.length} 个`);
    
  } catch (error) {
    console.error('❌ 种子数据初始化失败:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
