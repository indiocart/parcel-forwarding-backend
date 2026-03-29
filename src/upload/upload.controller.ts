import { Controller, Post, Get, Delete, Param, UseGuards, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadService } from './upload.service';
import { JwtGuard } from '../auth/jwt/jwt.guard';

@Controller('upload')
@UseGuards(JwtGuard)
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('screenshot')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
        return callback(new Error('Only image files are allowed!'), false);
      }
      callback(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 },
  }))
  async uploadScreenshot(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    
    return this.uploadService.saveFileInfo(
      file,
      req.user.userId,
      'screenshot',
    );
  }

  @Get('my-uploads')
  async getUserUploads(@Request() req) {
    return this.uploadService.getUserUploads(req.user.userId);
  }

  @Delete(':id')
  async deleteUpload(@Request() req, @Param('id') id: string) {
    return this.uploadService.deleteUpload(parseInt(id), req.user.userId);
  }
}