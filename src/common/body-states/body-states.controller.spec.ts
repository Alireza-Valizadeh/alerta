import { Test, TestingModule } from '@nestjs/testing';
import { BodyStatesController } from './body-states.controller';

describe('BodyStatesController', () => {
  let controller: BodyStatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BodyStatesController],
    }).compile();

    controller = module.get<BodyStatesController>(BodyStatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
