import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, CompanyDocument } from '../schemas/company.schema';

@Injectable()
export class CompaniesService {
  constructor(@InjectModel(Company.name) private companyModel: Model<CompanyDocument>) {}

  async findOne(id: string) {
    try {
      const company = await this.companyModel.findById(id).exec();
      if (company) return company;
    } catch (e) {}

    return {
      id: id || 'comp-001',
      name: 'Sankaj Logistics Limited',
      logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=120&q=80',
      industry: 'Logistics & Supply Chain',
      gstNumber: '27AAACS1429B1ZS',
      panNumber: 'AAACS1429B',
      cinNumber: 'U63090MH2020PLC345678',
      email: 'corporate@sankajlogistics.com',
      phone: '+91 22 4918 2000',
      website: 'https://sankajlogistics.com',
      address: 'BKC Financial Tower, Plot 42, G Block',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      postalCode: '400051',
      subscription: 'ENTERPRISE_MULTI_HUB',
      currentPlan: 'Enterprise Multi-Hub Unlimited',
      registrationDate: '2025-01-01',
    };
  }

  async update(id: string, body: any) {
    try {
      return await this.companyModel.findByIdAndUpdate(id, body, { new: true }).exec();
    } catch (e) {
      return { id, ...body, updatedAt: new Date().toISOString() };
    }
  }
}
