import { PrismaClient } from '@prisma/client'
import { THEMES } from '../src/types/theme'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Seed built-in themes
  for (const theme of Object.values(THEMES)) {
    await prisma.theme.upsert({
      where: { name: theme.name },
      update: {
        displayName: theme.displayName,
        config: theme as any,
      },
      create: {
        name: theme.name,
        displayName: theme.displayName,
        type: 'builtin',
        config: theme as any,
      },
    })
    console.log(`  ✓ Theme: ${theme.displayName}`)
  }

  console.log('✅ Seed complete.')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
