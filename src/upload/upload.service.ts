import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Upload } from './upload.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(Upload)
    private uploadRepository: Repository<Upload>,
  ) {}

  async saveFileInfo(
    file: Express.Multer.File,
    userId: number,
    fileType: string,
    orderId?: number,
    orderItemId?: number,
  ) {
    const fileUrl = `/uploads/${file.filename}`;
    
    const upload = this.uploadRepository.create({
      filename: file.filename,
      originalName: file.originalname,
      fileUrl,
      fileType,
      userId,
      orderId,
      orderItemId,
    });
    
    return this.uploadRepository.save(upload);
  }

  async getUserUploads(userId: number) {
    return this.uploadRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getOrderUploads(orderId: number) {
    return this.uploadRepository.find({
      where: { orderId },
      order: { createdAt: 'DESC' },
    });
  }

  async deleteUpload(id: number, userId: number) {
    const upload = await this.uploadRepository.findOne({ where: { id, userId } });
    if (!upload) throw new Error('Upload not found');
    
    const filePath = path.join(process.cwd(), 'uploads', upload.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    await this.uploadRepository.delete({ id, userId });
    return { deleted: true };
  }
}