export enum AuthURLs {
  SIGN_IN = '/auth/sign-in',
  SIGN_OUT = '/auth/sign-out',
  GET_USER = '/auth/get-this-user',
  GET_TOKEN = '/auth/get-token',
  UPDATE_USER = '/auth/update-this-user',
}

export enum ApptrayURLs {
  GET_SETTINGS = '/apptray/get-settings',
  SET_SETTINGS = '/apptray/set-settings',
  GET_FILES_TREE = '/apptray/get-files-tree',
  CREATE_FOLDER = '/apptray/upload-folder',
  DOWNLOAD_FILES = '/apptray/get-files',
  RENAME_FOLDER = '/apptray/rename-folder',
  RENAME_FILE = '/apptray/rename-file',
  DELETE_FOLDER = '/apptray/delete-folder',
  DELETE_FILE = '/apptray/delete-file',
}

export enum ApptrayWS {
  START_UPLOAD = 'start-upload',
  CONTINUE_UPLOAD = 'continue',
  END = 'end',
}
