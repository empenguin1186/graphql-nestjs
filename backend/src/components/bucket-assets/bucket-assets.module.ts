import { Module } from "@nestjs/common";
import { GoogleStorageRepository } from "./repositories/google-storage.repository";

@Module({
  providers: [GoogleStorageRepository],
  exports: [GoogleStorageRepository],
})
export class BucketAssetsModule { }