import { Test, TestingModule } from '@nestjs/testing';
import { TempUploadService } from './temp-upload.service';

describe('TempUploadService', () => {
  let service: TempUploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TempUploadService],
    }).compile();

    service = module.get<TempUploadService>(TempUploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
