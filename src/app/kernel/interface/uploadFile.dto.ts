import { Shared } from './shared';

export interface UploadFileDTO {
  path: string;
  formData: {
    file_buffer: string;
    type: string;
  };
  metaData: {
    shared: Shared[];
  };
  token: string;
  last: boolean;
}
