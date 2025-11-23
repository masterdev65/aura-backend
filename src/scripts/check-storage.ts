import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

const serviceAccount = require('../../aura-braids-and-beauty-firebase-adminsdk-fbsvc-0ae0b39266.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

async function checkStorage() {
  try {
    console.log('🔍 Checking Firebase Storage configuration...\n');

    console.log('Environment variables:');
    console.log('- PROJECT_ID:', process.env.FIREBASE_PROJECT_ID);
    console.log('- STORAGE_BUCKET:', process.env.FIREBASE_STORAGE_BUCKET);

    const storage = admin.storage();
    const bucket = storage.bucket();

    console.log('\n📦 Bucket info:');
    console.log('- Bucket name:', bucket.name);

    // Try to get bucket metadata
    try {
      const [metadata] = await bucket.getMetadata();
      console.log('✅ Bucket exists and is accessible!');
      console.log('- Location:', metadata.location);
      console.log('- Storage class:', metadata.storageClass);
      console.log('- Created:', metadata.timeCreated);

      // Try a test upload
      console.log('\n🧪 Testing file upload...');
      const testFile = bucket.file('test/test.txt');
      await testFile.save('Test content');
      console.log('✅ Test upload successful!');

      // Delete test file
      await testFile.delete();
      console.log('✅ Test file deleted');

    } catch (error: any) {
      console.log('❌ Cannot access bucket');
      console.log('Error code:', error.code);
      console.log('Error message:', error.message);

      console.log('\n💡 Possible solutions:');
      console.log('1. Go to Firebase Console → Storage → Get Started');
      console.log('2. Make sure Storage is enabled for this project');
      console.log('3. Check if the bucket name in .env matches the actual bucket');
      console.log('4. Verify the service account has Storage permissions');
    }

    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkStorage();
