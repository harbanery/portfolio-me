import { PrismaClient } from '@prisma/client';

// Create Prisma clients for both schemas
const prismaProd = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL?.replace('schema=portfolio', 'schema=portfolio') ||
           process.env.DATABASE_URL?.replace('schema=portfolio', 'schema=portfolio')
    }
  }
});

const prismaDev = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL?.replace('schema=portfolio', 'schema=portfolio-dev') ||
           process.env.DATABASE_URL?.replace('schema=portfolio', 'schema=portfolio-dev')
    }
  }
});

async function copyProductionToDev() {
  console.log('🚀 Starting data copy from production (portfolio) to development (portfolio-dev)...');

  try {
    // Clear development data first
    console.log('🧹 Clearing development database...');
    await prismaDev.experience.deleteMany();
    await prismaDev.portfolio.deleteMany();
    await prismaDev.personalImage.deleteMany();
    await prismaDev.personal.deleteMany();
    await prismaDev.loginAttempt.deleteMany();
    await prismaDev.session.deleteMany();
    await prismaDev.admin.deleteMany();
    console.log('✅ Development database cleared');

    // Copy Personal data
    console.log('📋 Copying Personal data...');
    const personals = await prismaProd.personal.findMany();
    if (personals.length > 0) {
      for (const personal of personals) {
        const newPersonal = await prismaDev.personal.create({
          data: {
            name: personal.name,
            about: personal.about,
            skills: personal.skills,
            contacts: personal.contacts,
            createdAt: personal.createdAt,
            updatedAt: personal.updatedAt
          }
        });

        // Copy PersonalImage
        const images = await prismaProd.personalImage.findMany({
          where: { personalId: personal.id }
        });
        for (const image of images) {
          await prismaDev.personalImage.create({
            data: {
              personalId: newPersonal.id,
              url: image.url,
              storagePath: image.storagePath,
              mimeType: image.mimeType,
              size: image.size,
              width: image.width,
              height: image.height,
              caption: image.caption,
              order: image.order,
              createdAt: image.createdAt,
              updatedAt: image.updatedAt
            }
          });
        }
      }
      console.log(`✅ Copied ${personals.length} Personal records`);
    }

    // Copy Portfolio data
    console.log('📚 Copying Portfolio data...');
    const portfolios = await prismaProd.portfolio.findMany();
    if (portfolios.length > 0) {
      await prismaDev.portfolio.createMany({
        data: portfolios.map(p => ({
          title: p.title,
          subtitle: p.subtitle,
          projectType: p.projectType,
          clientName: p.clientName,
          companyName: p.companyName,
          role: p.role,
          image: p.image,
          images: p.images,
          description: p.description,
          apiDocumentation: p.apiDocumentation,
          features: p.features,
          highlights: p.highlights,
          challenges: p.challenges,
          solutions: p.solutions,
          story: p.story,
          outcomes: p.outcomes,
          skills: p.skills,
          repoLinks: p.repoLinks,
          webLink: p.webLink,
          status: p.status,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt
        }))
      });
      console.log(`✅ Copied ${portfolios.length} Portfolio records`);
    }

    // Copy Experience data
    console.log('💼 Copying Experience data...');
    const experiences = await prismaProd.experience.findMany();
    if (experiences.length > 0) {
      await prismaDev.experience.createMany({
        data: experiences.map(e => ({
          jobTitle: e.jobTitle,
          companyName: e.companyName,
          description: e.description,
          skills: e.skills,
          images: e.images,
          startDate: e.startDate,
          endDate: e.endDate,
          isPresent: e.isPresent,
          status: e.status,
          createdAt: e.createdAt,
          updatedAt: e.updatedAt
        }))
      });
      console.log(`✅ Copied ${experiences.length} Experience records`);
    }

    // Copy Admin data (optional - only if you want same credentials)
    console.log('👤 Copying Admin data...');
    const admins = await prismaProd.admin.findMany();
    if (admins.length > 0) {
      await prismaDev.admin.createMany({
        data: admins.map(a => ({
          password: a.password,
          createdAt: a.createdAt,
          updatedAt: a.updatedAt
        }))
      });
      console.log(`✅ Copied ${admins.length} Admin records`);
    }

    console.log('✨ Data copy completed successfully!');
    console.log('📊 Summary:');
    console.log(`   - Personal: ${personals.length} records`);
    console.log(`   - Portfolio: ${portfolios.length} records`);
    console.log(`   - Experience: ${experiences.length} records`);
    console.log(`   - Admin: ${admins.length} records`);

  } catch (error) {
    console.error('❌ Error copying data:', error);
    throw error;
  } finally {
    await prismaProd.$disconnect();
    await prismaDev.$disconnect();
  }
}

// Run the seed function
copyProductionToDev()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
