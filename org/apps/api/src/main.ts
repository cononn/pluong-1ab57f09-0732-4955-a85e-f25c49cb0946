/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, Role, RoleType, Organization } from '@org/data';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const userRepo = app.get<Repository<User>>(getRepositoryToken(User));
  const roleRepo = app.get<Repository<Role>>(getRepositoryToken(Role));
  const orgRepo = app.get<Repository<Organization>>(getRepositoryToken(Organization));

  await seedRoles(roleRepo);
  await seedOrganizations(orgRepo);
  await seedStaticUsers(userRepo, roleRepo, orgRepo);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();

async function seedRoles(roleRepo: Repository<Role>) {
  for (const roleType of [RoleType.OWNER, RoleType.ADMIN, RoleType.VIEWER]) {
    const exists = await roleRepo.findOne({ where: { name: roleType } });
    if (!exists) {
      const role = roleRepo.create({ name: roleType, hierarchyLevel: roleType === RoleType.OWNER ? 3 : roleType === RoleType.ADMIN ? 2 : 1 });
      await roleRepo.save(role);
    }
  }
}

async function seedOrganizations(orgRepo: Repository<Organization>) {
  // Company (parent)
  let company = await orgRepo.findOne({ where: { name: 'Company' } });
  if (!company) {
    company = orgRepo.create({ name: 'Company' });
    await orgRepo.save(company);
  }

  // Management Team (child)
  let managementTeam = await orgRepo.findOne({ where: { name: 'Management Team' } });
  if (!managementTeam) {
    managementTeam = orgRepo.create({ name: 'Management Team', parent: company });
    await orgRepo.save(managementTeam);
  }

  // Developer Team (child)
  let developerTeam = await orgRepo.findOne({ where: { name: 'Developer Team' } });
  if (!developerTeam) {
    developerTeam = orgRepo.create({ name: 'Developer Team', parent: company });
    await orgRepo.save(developerTeam);
  }
}

async function seedStaticUsers(
  userRepo: Repository<User>,
  roleRepo: Repository<Role>,
  orgRepo: Repository<Organization>,
) {
  const usersToSeed = [
    {
      name: 'Alice Owner',
      email: 'alice@company.com',
      password: 'owner123',
      role: RoleType.OWNER,
      organization: 'Company',
    },
    {
      name: 'Bob Admin',
      email: 'bob@company.com',
      password: 'admin123',
      role: RoleType.ADMIN,
      organization: 'Management Team',
    },
    {
      name: 'Charlie Dev',
      email: 'charlie@company.com',
      password: 'dev123',
      role: RoleType.ADMIN,
      organization: 'Developer Team',
    },
    {
      name: 'Static User',
      email: 'staticuser@test.com',
      password: 'password123',
      role: RoleType.VIEWER,
      organization: 'Developer Team',
    },
  ];

  for (const u of usersToSeed) {
    // skip if user already exists
    const existing = await userRepo.findOne({ where: { email: u.email } });
    if (existing) continue;

    const role = await roleRepo.findOne({ where: { name: u.role } });
    const org = await orgRepo.findOne({ where: { name: u.organization } });

    if (!role || !org) {
      console.error(`Cannot create user ${u.name}: role or organization missing`);
      continue;
    }

    const user = userRepo.create({
      name: u.name,
      email: u.email,
      passwordHash: await bcrypt.hash(u.password, 10),
      role,
      organization: org,
    });

    await userRepo.save(user);
  }
}