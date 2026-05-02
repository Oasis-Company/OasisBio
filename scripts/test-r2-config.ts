import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const r2Config = {
  accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  bucketName: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  accountId: process.env.CLOUDFLARE_R2_ACCOUNT_ID,
};

async function testR2Connection() {
  console.log('=== R2 Configuration Test ===\n');
  
  console.log('Checking environment variables:');
  const missingVars: string[] = [];
  
  if (!r2Config.accessKeyId) missingVars.push('CLOUDFLARE_R2_ACCESS_KEY_ID');
  if (!r2Config.secretAccessKey) missingVars.push('CLOUDFLARE_R2_SECRET_ACCESS_KEY');
  if (!r2Config.endpoint) missingVars.push('CLOUDFLARE_R2_ENDPOINT');
  if (!r2Config.bucketName) missingVars.push('CLOUDFLARE_R2_BUCKET_NAME');
  if (!r2Config.accountId) missingVars.push('CLOUDFLARE_R2_ACCOUNT_ID');
  
  if (missingVars.length > 0) {
    console.log('❌ Missing required environment variables:');
    missingVars.forEach(v => console.log(`  - ${v}`));
    console.log('\nPlease set these variables in your .env.local file');
    process.exit(1);
  }
  
  console.log('✅ All R2 environment variables are set');
  
  console.log('\nTesting R2 connection...');
  
  try {
    const client = new S3Client({
      region: 'auto',
      endpoint: r2Config.endpoint,
      credentials: {
        accessKeyId: r2Config.accessKeyId!,
        secretAccessKey: r2Config.secretAccessKey!,
      },
    });
    
    const command = new ListBucketsCommand({});
    const response = await client.send(command);
    
    console.log('✅ R2 connection successful!');
    console.log(`\nAvailable buckets:`);
    response.Buckets?.forEach(bucket => {
      console.log(`  - ${bucket.Name}`);
    });
    
    if (response.Buckets?.some(b => b.Name === r2Config.bucketName)) {
      console.log(`\n✅ Target bucket "${r2Config.bucketName}" exists`);
    } else {
      console.log(`\n⚠️  Target bucket "${r2Config.bucketName}" not found in available buckets`);
    }
    
  } catch (error) {
    console.log('❌ R2 connection failed:', (error as Error).message);
    process.exit(1);
  }
  
  console.log('\n=== R2 Configuration Test Complete ===');
}

testR2Connection();