import { Global, Module } from '@nestjs/common';
import { ResponseHelper } from 'src/cores/helpers/response.helper';

@Global()
@Module({
  providers: [ResponseHelper],
  exports: [ResponseHelper],
})
export class ResponseModule {}
