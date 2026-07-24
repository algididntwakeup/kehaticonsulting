import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Seed Users
  const userPersonel = await prisma.user.upsert({
    where: { nrp: '82110001' },
    update: {},
    create: {
      id: 'usr_01HXYZ',
      nrp: '82110001',
      password_hash: '$2a$12$eImiTXuWVxfM37uY4JANjO5E/M./1.placeholder', // hashed password
      nama_lengkap: 'Bripda Agus Santoso',
      pangkat: 'Bripda',
      satker: 'Polrestabes Bandung',
      unit: 'Reskrim',
      email: 'agus.santoso@polri.go.id',
      role: 'personel',
      is_active: true,
    },
  });

  const userAdmin = await prisma.user.upsert({
    where: { nrp: '70000001' },
    update: {},
    create: {
      id: 'usr_admin01',
      nrp: '70000001',
      password_hash: '$2a$12$eImiTXuWVxfM37uY4JANjO5E/M./1.placeholder',
      nama_lengkap: 'Kompol Sari Dewi, S.Psi',
      pangkat: 'Kompol',
      satker: 'Biro SDM Polda Jabar',
      unit: 'Bag Psikologi',
      email: 'sari.dewi@polri.go.id',
      role: 'admin',
      is_active: true,
    },
  });

  const userPsikolog = await prisma.user.upsert({
    where: { nrp: '70000002' },
    update: {},
    create: {
      id: 'usr_psikolog01',
      nrp: '70000002',
      password_hash: '$2a$12$eImiTXuWVxfM37uY4JANjO5E/M./1.placeholder',
      nama_lengkap: 'Pembina dr. Ratna Juwita, M.Psi',
      pangkat: 'Pembina',
      satker: 'Biro SDM Polda Jabar',
      unit: 'Bag Psikologi',
      email: 'ratna.juwita@polri.go.id',
      role: 'psikolog',
      is_active: true,
    },
  });

  // 2. Seed Psikolog Master
  const psikolog1 = await prisma.psikolog.upsert({
    where: { id: 'psi_01HXYZ' },
    update: {},
    create: {
      id: 'psi_01HXYZ',
      nama: 'Pembina dr. Ratna Juwita, M.Psi',
      spesialis: 'Psikologi Klinis & Trauma Kerja',
    },
  });

  const psikolog2 = await prisma.psikolog.upsert({
    where: { id: 'psi_02HABC' },
    update: {},
    create: {
      id: 'psi_02HABC',
      nama: 'AKBP dr. Hendra Wijaya, Sp.KJ',
      spesialis: 'Psikiatri & Manajemen Stres Operational',
    },
  });

  // 3. Seed Articles
  await prisma.article.upsert({
    where: { id: 'art_01HXYZ' },
    update: {},
    create: {
      id: 'art_01HXYZ',
      judul: 'Menjaga Kesehatan Mental di Tengah Tekanan Tugas Kepolisian',
      konten: 'Tugas kepolisian yang sarat risiko dan tekanan membutuhkan strategi pengelolaan stres yang terstruktur...',
      kategori: 'Edukasi Stres',
      status: 'published',
      author_id: userAdmin.id,
      read_time: 5,
      published_at: new Date('2026-05-10T10:00:00Z'),
    },
  });

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
