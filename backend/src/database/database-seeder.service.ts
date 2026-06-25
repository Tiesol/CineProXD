import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../user/entities/user.entity';

@Injectable()
export class DatabaseSeederService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onApplicationBootstrap() {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminEmail || !adminPassword) return;

    const existing = await this.userRepository.findOne({ where: { email: adminEmail } });
    if (existing) return;

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await this.userRepository.save(
      this.userRepository.create({
        name: 'Admin',
        lastname: 'CineProXD',
        email: adminEmail,
        password: hashedPassword,
        role: UserRole.ADMIN,
      }),
    );

    console.log(`Admin user created: ${adminEmail}`);
  }
}
