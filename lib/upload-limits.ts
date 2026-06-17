export const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB — matches next.config serverActions.bodySizeLimit

export const MAX_UPLOAD_SIZE_LABEL = "10 MB";

export const isUploadTooLarge = (size: number) => size > MAX_UPLOAD_SIZE_BYTES;
