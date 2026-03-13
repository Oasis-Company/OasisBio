const { PrismaClient } = require('@prisma/client');
const path = require('path');

// 加载环境变量
if (require('fs').existsSync(path.resolve(__dirname, '..', '.env'))) {
  require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
}

const prisma = new PrismaClient();

// 初始能力类别数据
const abilityCategories = [
  {
    name: 'Physical',
    slug: 'physical',
    description: 'Physical abilities and skills',
    sortOrder: 1
  },
  {
    name: 'Mental',
    slug: 'mental',
    description: 'Mental abilities and skills',
    sortOrder: 2
  },
  {
    name: 'Social',
    slug: 'social',
    description: 'Social abilities and skills',
    sortOrder: 3
  },
  {
    name: 'Technical',
    slug: 'technical',
    description: 'Technical abilities and skills',
    sortOrder: 4
  },
  {
    name: 'Creative',
    slug: 'creative',
    description: 'Creative abilities and skills',
    sortOrder: 5
  },
  {
    name: 'Supernatural',
    slug: 'supernatural',
    description: 'Supernatural abilities and skills',
    sortOrder: 6
  }
];

// 初始预设能力数据
const abilityPresets = [
  // Physical category
  {
    name: 'Strength',
    slug: 'strength',
    description: 'Physical strength and power',
    categoryId: null, // Will be set programmatically
    isActive: true
  },
  {
    name: 'Speed',
    slug: 'speed',
    description: 'Physical speed and agility',
    categoryId: null,
    isActive: true
  },
  {
    name: 'Endurance',
    slug: 'endurance',
    description: 'Physical endurance and stamina',
    categoryId: null,
    isActive: true
  },
  // Mental category
  {
    name: 'Intelligence',
    slug: 'intelligence',
    description: 'Mental capacity and reasoning',
    categoryId: null,
    isActive: true
  },
  {
    name: 'Memory',
    slug: 'memory',
    description: 'Memory recall and retention',
    categoryId: null,
    isActive: true
  },
  {
    name: 'Perception',
    slug: 'perception',
    description: 'Sensory perception and awareness',
    categoryId: null,
    isActive: true
  },
  // Social category
  {
    name: 'Charisma',
    slug: 'charisma',
    description: 'Social charm and influence',
    categoryId: null,
    isActive: true
  },
  {
    name: 'Communication',
    slug: 'communication',
    description: 'Verbal and non-verbal communication',
    categoryId: null,
    isActive: true
  },
  {
    name: 'Leadership',
    slug: 'leadership',
    description: 'Leading and organizing others',
    categoryId: null,
    isActive: true
  },
  // Technical category
  {
    name: 'Technology',
    slug: 'technology',
    description: 'Technical skills and knowledge',
    categoryId: null,
    isActive: true
  },
  {
    name: 'Engineering',
    slug: 'engineering',
    description: 'Engineering and problem-solving',
    categoryId: null,
    isActive: true
  },
  {
    name: 'Science',
    slug: 'science',
    description: 'Scientific knowledge and application',
    categoryId: null,
    isActive: true
  },
  // Creative category
  {
    name: 'Art',
    slug: 'art',
    description: 'Artistic expression and creativity',
    categoryId: null,
    isActive: true
  },
  {
    name: 'Music',
    slug: 'music',
    description: 'Musical talent and appreciation',
    categoryId: null,
    isActive: true
  },
  {
    name: 'Writing',
    slug: 'writing',
    description: 'Writing and storytelling',
    categoryId: null,
    isActive: true
  },
  // Supernatural category
  {
    name: 'Magic',
    slug: 'magic',
    description: 'Magical abilities and powers',
    categoryId: null,
    isActive: true
  },
  {
    name: 'Psychic',
    slug: 'psychic',
    description: 'Psychic abilities and powers',
    categoryId: null,
    isActive: true
  },
  {
    name: 'Superhuman',
    slug: 'superhuman',
    description: 'Superhuman abilities and powers',
    categoryId: null,
    isActive: true
  }
];

// 初始标签数据
const tags = [
  { name: 'Hero', slug: 'hero' },
  { name: 'Villain', slug: 'villain' },
  { name: 'Anti-Hero', slug: 'anti-hero' },
  { name: 'Human', slug: 'human' },
  { name: 'Non-Human', slug: 'non-human' },
  { name: 'Sci-Fi', slug: 'sci-fi' },
  { name: 'Fantasy', slug: 'fantasy' },
  { name: 'Historical', slug: 'historical' },
  { name: 'Modern', slug: 'modern' },
  { name: 'Future', slug: 'future' }
];

async function seedData() {
  try {
    console.log('Seeding initial data...');

    // 导入能力类别
    console.log('Importing ability categories...');
    const categoriesMap = {};
    for (const category of abilityCategories) {
      const existingCategory = await prisma.abilityCategory.findUnique({
        where: { slug: category.slug }
      });

      if (existingCategory) {
        console.log(`Category ${category.name} already exists`);
        categoriesMap[category.slug] = existingCategory.id;
      } else {
        const newCategory = await prisma.abilityCategory.create({
          data: category
        });
        console.log(`Created category ${category.name}`);
        categoriesMap[category.slug] = newCategory.id;
      }
    }

    // 导入预设能力
    console.log('Importing ability presets...');
    const categorySlugs = Object.keys(categoriesMap);
    for (let i = 0; i < abilityPresets.length; i++) {
      const preset = abilityPresets[i];
      const categoryIndex = Math.floor(i / 3); // Each category has 3 presets
      const categorySlug = categorySlugs[categoryIndex];
      preset.categoryId = categoriesMap[categorySlug];

      const existingPreset = await prisma.abilityPreset.findUnique({
        where: { slug: preset.slug }
      });

      if (existingPreset) {
        console.log(`Preset ${preset.name} already exists`);
      } else {
        await prisma.abilityPreset.create({
          data: preset
        });
        console.log(`Created preset ${preset.name}`);
      }
    }

    // 导入标签
    console.log('Importing tags...');
    for (const tag of tags) {
      const existingTag = await prisma.tag.findUnique({
        where: { slug: tag.slug }
      });

      if (existingTag) {
        console.log(`Tag ${tag.name} already exists`);
      } else {
        await prisma.tag.create({
          data: tag
        });
        console.log(`Created tag ${tag.name}`);
      }
    }

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedData();
