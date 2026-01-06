import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, RoleType } from '@org/data';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private repo: Repository<Role>,
  ) {}

  async seed() {
    const roles = [
      { name: RoleType.OWNER, hierarchyLevel: 3 },
      { name: RoleType.ADMIN, hierarchyLevel: 2 },
      { name: RoleType.VIEWER, hierarchyLevel: 1 },
    ];

    for (const role of roles) {
      const exists = await this.repo.findOne({ where: { name: role.name } });
      if (!exists) {
        await this.repo.save(role);
      }
    }
  }
}
