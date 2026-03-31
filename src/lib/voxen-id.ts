const ALLOWED_VOXEN_ID_CHARS = /[^a-z0-9._-]/g;

export const normalizeVoxenId = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(ALLOWED_VOXEN_ID_CHARS, '');

export const formatVoxenIdForDisplay = (value: string): string => normalizeVoxenId(value).toUpperCase();

export const buildVoxenAuthEmail = (voxenId: string): string => `${normalizeVoxenId(voxenId)}@voxen.id`;
