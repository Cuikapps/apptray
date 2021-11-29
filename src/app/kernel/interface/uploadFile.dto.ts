import { Shared } from './shared';

export interface UploadFileDTO {
  path: string;
  formData: {
    file_buffer: Uint8Array;
    type: string;
  };
  metaData: {
    shared: Shared[];
  };
}
