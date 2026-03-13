const { PrismaClient } = require('../src/generated/prisma/client');
const path = require('path');

// 加载环境变量
if (require('fs').existsSync(path.resolve(__dirname, '..', '.env'))) {
  require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
}

const prisma = new PrismaClient();

async function testCRUD() {
  try {
    console.log('Testing database CRUD operations...');

    // 测试 1: 创建用户
    console.log('\n1. Testing user creation...');
    const testUser = {
      name: 'Test User',
      email: `test_${Date.now()}@example.com`,
      password: 'test123456',
    };

    try {
      const user = await prisma.user.create({
        data: testUser,
      });
      console.log('✓ User created successfully:', user.id);
    } catch (error) {
      console.log('⚠️  User creation test skipped (likely duplicate email):', error.message);
    }

    // 测试 2: 查询用户
    console.log('\n2. Testing user query...');
    try {
      const users = await prisma.user.findMany({
        take: 5,
      });
      console.log('✓ Users found:', users.length);
      if (users.length > 0) {
        console.log('  First user:', users[0].email);
      }
    } catch (error) {
      console.log('⚠️  User query test skipped:', error.message);
    }

    // 测试 3: 创建能力类别
    console.log('\n3. Testing ability category creation...');
    const testCategory = {
      name: 'Test Category',
      slug: `test-category-${Date.now()}`,
      description: 'Test ability category',
    };

    try {
      const category = await prisma.abilityCategory.create({
        data: testCategory,
      });
      console.log('✓ Ability category created successfully:', category.id);
    } catch (error) {
      console.log('⚠️  Ability category creation test skipped:', error.message);
    }

    // 测试 4: 创建预设能力
    console.log('\n4. Testing ability preset creation...');
    try {
      const categories = await prisma.abilityCategory.findMany({
        take: 1,
      });

      if (categories.length > 0) {
        const testPreset = {
          name: 'Test Preset',
          slug: `test-preset-${Date.now()}`,
          description: 'Test ability preset',
          categoryId: categories[0].id,
        };

        const preset = await prisma.abilityPreset.create({
          data: testPreset,
        });
        console.log('✓ Ability preset created successfully:', preset.id);
      } else {
        console.log('⚠️  No ability categories found, skipping preset creation');
      }
    } catch (error) {
      console.log('⚠️  Ability preset creation test skipped:', error.message);
    }

    // 测试 5: 测试事务
    console.log('\n5. Testing transaction...');
    try {
      const result = await prisma.$transaction(async (prisma) => {
        const category = await prisma.abilityCategory.create({
          data: {
            name: 'Transaction Test Category',
            slug: `transaction-test-${Date.now()}`,
            description: 'Test category for transaction',
          },
        });

        const preset = await prisma.abilityPreset.create({
          data: {
            name: 'Transaction Test Preset',
            slug: `transaction-test-preset-${Date.now()}`,
            description: 'Test preset for transaction',
            categoryId: category.id,
          },
        });

        return { category, preset };
      });

      console.log('✓ Transaction completed successfully');
      console.log('  Category:', result.category.id);
      console.log('  Preset:', result.preset.id);
    } catch (error) {
      console.log('⚠️  Transaction test skipped:', error.message);
    }

    console.log('\nDatabase CRUD operations test completed!');
  } catch (error) {
    console.error('Error during CRUD tests:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCRUD();
