import chalk from 'chalk'
import { db } from './client'
import { companies, users } from './schema'

async function seed() {
  await db.delete(users)
  await db.delete(companies)

  console.log(chalk.yellow('✅ Database reset!'))

  await db.insert(companies).values({
    id: 'e5yu6dtaw4sgaw3bj0r2cyb7',
    cnpj: '3649461900014',
    companyName: 'Kodiak Sales Manager',
    tradeName: 'KSM',
    cep: '00000000',
    street: 'Rua Kodiak',
    number: 107,
    complement: '',
    district: 'Kodiak',
    city: 'Kodiak City',
    state: 'SP',
  })

  console.log(chalk.yellow('✅ Created company!'))

  await db.insert(users).values({
    id: 'yskuwgkyxhfmewcny28os75s',
    name: 'Admin',
    email: 'admin@kodiak.com',
    password: '$2b$10$iTzkXyMrTOLFAbVY7gTeleQpQxjVXE4oObTvai9qrcEh95LETMmaa',
    position: 'Administrador',
    idCompany: 'e5yu6dtaw4sgaw3bj0r2cyb7',
    tradeName: 'KSM',
  })

  console.log(chalk.yellow('✅ Created user!'))

  console.log(chalk.greenBright('Database seeded successfully!'))

  process.exit()
}

seed()
