import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export const PlaceHolderImages: ImagePlaceholder[] = data.placeholderImages;

export const initialGalleryImages: ImagePlaceholder[] = [...Array(8)].map((_, i) => ({
    id: `placeholder-${i}`,
    description: 'Clique para adicionar uma foto',
    imageUrl: '',
    imageHint: ''
}));
