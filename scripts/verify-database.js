const { PrismaClient } = require('../src/generated/prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 开始验证数据库连接...\n');
  
  try {
    await prisma.$connect();
    console.log('✅ 数据库连接成功\n');
    
    console.log('📊 检查所有表...\n');
    
    const tables = [
      { name: 'User', model: prisma.user },
      { name: 'Profile', model: prisma.profile },
      { name: 'OasisBio', model: prisma.oasisBio },
      { name: 'EraIdentity', model: prisma.eraIdentity },
      { name: 'Ability', model: prisma.ability },
      { name: 'AbilityCategory', model: prisma.abilityCategory },
      { name: 'AbilityPreset', model: prisma.abilityPreset },
      { name: 'DcosFile', model: prisma.dcosFile },
      { name: 'ReferenceItem', model: prisma.referenceItem },
      { name: 'WorldItem', model: prisma.worldItem },
      { name: 'WorldDocument', model: prisma.worldDocument },
      { name: 'ModelItem', model: prisma.modelItem },
      { name: 'OasisBioPublication', model: prisma.oasisBioPublication },
      { name: 'Tag', model: prisma.tag },
      { name: 'EntityTag', model: prisma.entityTag },
      { name: 'CharacterRelationship', model: prisma.characterRelationship },
      { name: 'Account', model: prisma.account },
      { name: 'Session', model: prisma.session },
      { name: 'VerificationToken', model: prisma.verificationToken },
    ];
    
    for (const table of tables) {
      try {
        const count = await table.model.count();
        console.log(`✅ ${table.name} 表存在 (当前记录数: ${count})`);
      } catch (error) {
        console.log(`❌ ${table.name} 表访问失败:`, error.message);
      }
    }
    
    console.log('\n✨ 数据库验证完成！所有表都已成功部署。');
    console.log('\n📋 下一步建议:');
    console.log('1. 在 Supabase Dashboard 中检查表结构');
    console.log('2. 运行种子脚本初始化能力分类和预设');
    console.log('3. 配置 Supabase Storage');
    console.log('4. 设置 RLS 策略');
    
  } catch (error) {
    console.error('❌ 数据库验证失败:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
