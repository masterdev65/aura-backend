import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Firebase Admin
const serviceAccount = require('../../aura-braids-and-beauty-firebase-adminsdk-fbsvc-0ae0b39266.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

// Categories data
const categories = [
  {
    id: 'knotless-braids',
    name: 'Knotless Braids',
    description: 'Tresses sans nœuds, technique douce qui protège vos cheveux naturels',
    icon: 'braids',
    isActive: true,
    order: 1,
  },
  {
    id: 'box-braids',
    name: 'Box Braids',
    description: 'Tresses classiques en carrés, style iconique et versatile',
    icon: 'grid',
    isActive: true,
    order: 2,
  },
  {
    id: 'twists',
    name: 'Twists',
    description: 'Torsades élégantes pour un look naturel et sophistiqué',
    icon: 'twist',
    isActive: true,
    order: 3,
  },
  {
    id: 'cornrows',
    name: 'Cornrows',
    description: 'Tresses plaquées, design artistique et créatif',
    icon: 'rows',
    isActive: true,
    order: 4,
  },
  {
    id: 'tribal-braids',
    name: 'Tribal Braids',
    description: 'Tresses tribales avec accessoires, style culturel authentique',
    icon: 'star',
    isActive: true,
    order: 5,
  },
  {
    id: 'wigs-extensions',
    name: 'Wigs & Extensions',
    description: 'Perruques et extensions pour un changement instantané',
    icon: 'sparkles',
    isActive: true,
    order: 6,
  },
];

// Services data (will be updated with Firebase Storage URLs)
const services = [
  {
    id: 'small-knotless',
    categoryId: 'knotless-braids',
    name: 'Small Knotless Braids',
    description: 'Tresses knotless fines et délicates, look raffiné et élégant',
    duration: 480,
    price: 250,
    imageFile: 'Small knotless.JPG',
    featured: true,
    popular: true,
    isActive: true,
    order: 1,
  },
  {
    id: 'jumbo-knotless',
    categoryId: 'knotless-braids',
    name: 'Jumbo Knotless Braids',
    description: 'Tresses knotless volumineuses, installation rapide et style statement',
    duration: 300,
    price: 180,
    imageFile: 'Jumbo knotless.JPG',
    featured: true,
    isActive: true,
    order: 2,
  },
  {
    id: 'bob-knotless-boho',
    categoryId: 'knotless-braids',
    name: 'Bob Knotless Boho',
    description: 'Style bob knotless avec touches bohème, tendance et chic',
    duration: 360,
    price: 220,
    imageFile: 'Bob knotless boho.JPG',
    featured: true,
    isActive: true,
    order: 3,
  },
  {
    id: 'knotless-brown-long',
    categoryId: 'knotless-braids',
    name: 'Knotless Brown Long',
    description: 'Tresses knotless longues en tons bruns, look naturel',
    duration: 420,
    price: 240,
    imageFile: 'knotless-brown-long-1.jpg',
    isActive: true,
    order: 4,
  },
  {
    id: 'knotless-side',
    categoryId: 'knotless-braids',
    name: 'Knotless Side Style',
    description: 'Tresses knotless avec design latéral asymétrique',
    duration: 390,
    price: 230,
    imageFile: 'knotless-side-1.jpg',
    isActive: true,
    order: 5,
  },
  {
    id: 'box-braids-black',
    categoryId: 'box-braids',
    name: 'Box Braids Black',
    description: 'Box braids classiques noires, intemporelles et polyvalentes',
    duration: 360,
    price: 200,
    imageFile: 'box-braids-black-1.jpg',
    popular: true,
    isActive: true,
    order: 6,
  },
  {
    id: 'box-braids-burgundy',
    categoryId: 'box-braids',
    name: 'Box Braids Burgundy',
    description: 'Box braids en tons burgundy, look audacieux et élégant',
    duration: 360,
    price: 220,
    imageFile: 'box-braids-burgundy-1.jpg',
    featured: true,
    isActive: true,
    order: 7,
  },
  {
    id: 'kinky-twist',
    categoryId: 'twists',
    name: 'Kinky Twist',
    description: 'Torsades kinky texturées, aspect naturel et volumineux',
    duration: 300,
    price: 180,
    imageFile: 'Kinky twist.JPG',
    popular: true,
    isActive: true,
    order: 8,
  },
  {
    id: 'senegalese-twist',
    categoryId: 'twists',
    name: 'Senegalese Twist',
    description: 'Twists sénégalais lisses et élégants, finition impeccable',
    duration: 330,
    price: 200,
    imageFile: 'Senegalese twist.JPG',
    featured: true,
    isActive: true,
    order: 9,
  },
  {
    id: 'cornrows-ponytail',
    categoryId: 'cornrows',
    name: 'Cornrows Ponytail',
    description: 'Cornrows stylisés en queue de cheval, pratique et chic',
    duration: 180,
    price: 120,
    imageFile: 'cornrows-ponytail-1.jpg',
    isActive: true,
    order: 10,
  },
  {
    id: 'cornrows-updo-kids',
    categoryId: 'cornrows',
    name: 'Cornrows Updo Kids',
    description: 'Cornrows pour enfants avec design updo créatif',
    duration: 150,
    price: 80,
    imageFile: 'cornrows-updo-kids-1.jpg',
    isActive: true,
    order: 11,
  },
  {
    id: 'tribal-accessories',
    categoryId: 'tribal-braids',
    name: 'Tribal Braids with Accessories',
    description: 'Tresses tribales ornées d\'accessoires dorés et perles',
    duration: 360,
    price: 250,
    imageFile: 'tribal-accessories-1.jpg',
    featured: true,
    isActive: true,
    order: 12,
  },
  {
    id: 'tribal-kids-beads',
    categoryId: 'tribal-braids',
    name: 'Tribal Kids with Beads',
    description: 'Tresses tribales pour enfants avec perles colorées',
    duration: 180,
    price: 100,
    imageFile: 'tribal-kids-beads-1.jpg',
    isActive: true,
    order: 13,
  },
  {
    id: 'tribal-spiral-multiple',
    categoryId: 'tribal-braids',
    name: 'Tribal Spiral Multiple',
    description: 'Design tribal complexe avec spirales et motifs multiples',
    duration: 420,
    price: 280,
    imageFile: 'tribal-spiral-multiple-1.jpg',
    featured: true,
    isActive: true,
    order: 14,
  },
  {
    id: 'wigs-install',
    categoryId: 'wigs-extensions',
    name: 'Wig Installation',
    description: 'Pose professionnelle de perruques, look naturel garanti',
    duration: 120,
    price: 150,
    imageFile: 'Wigs.JPG',
    popular: true,
    isActive: true,
    order: 15,
  },
  {
    id: 'straight-hair',
    categoryId: 'wigs-extensions',
    name: 'Straight Hair Extensions',
    description: 'Extensions lisses pour longueur et volume instantanés',
    duration: 180,
    price: 200,
    imageFile: 'straight-hair-1.jpg',
    isActive: true,
    order: 16,
  },
];

async function uploadImageToStorage(
  imagePath: string,
  fileName: string,
): Promise<string> {
  try {
    const destination = `services/${fileName}`;
    await bucket.upload(imagePath, {
      destination,
      metadata: {
        contentType: 'image/jpeg',
      },
    });

    // Make file publicly readable
    await bucket.file(destination).makePublic();

    // Return public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destination}`;
    console.log(`✅ Uploaded: ${fileName} -> ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error(`❌ Error uploading ${fileName}:`, error.message);
    throw error;
  }
}

async function seedCategories() {
  console.log('\n📁 Seeding categories...');
  const batch = db.batch();

  for (const category of categories) {
    const { id, ...data } = category;
    const docRef = db.collection('categories').doc(id);
    batch.set(docRef, data);
    console.log(`✅ Category: ${category.name}`);
  }

  await batch.commit();
  console.log('✅ Categories seeded successfully!');
}

async function seedServices() {
  console.log('\n🖼️  Uploading images and seeding services...');
  const portfolioPath = '/Users/masterdev/Downloads/portfolio';

  for (const service of services) {
    try {
      const { id, imageFile, ...data } = service;

      // Upload image to Firebase Storage
      const imagePath = path.join(portfolioPath, imageFile);

      if (!fs.existsSync(imagePath)) {
        console.log(`⚠️  Image not found: ${imageFile}, skipping...`);
        continue;
      }

      const imageUrl = await uploadImageToStorage(imagePath, imageFile);

      // Create service document in Firestore
      await db.collection('services').doc(id).set({
        ...data,
        imageUrl,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`✅ Service: ${service.name}`);
    } catch (error) {
      console.error(`❌ Error processing service ${service.name}:`, error.message);
    }
  }

  console.log('✅ Services seeded successfully!');
}

async function main() {
  try {
    console.log('🚀 Starting seed process...\n');

    // Seed categories first
    await seedCategories();

    // Then seed services with image uploads
    await seedServices();

    console.log('\n✨ Seed process completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seed process failed:', error);
    process.exit(1);
  }
}

main();
