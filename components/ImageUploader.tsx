import React, { ChangeEvent } from 'react';

interface ImageUploaderProps {
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  imagePreviewUrl: string | null;
  isLoading: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onFileChange, imagePreviewUrl, isLoading }) => (
  <div className="w-full max-w-lg mx-auto bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
    <input
      type="file"
      id="file-upload"
      className="hidden"
      accept=".png, .jpg, .jpeg"
      onChange={onFileChange}
      disabled={isLoading}
    />
    <label htmlFor="file-upload" className={`cursor-pointer ${isLoading ? 'cursor-not-allowed' : ''}`}>
      {imagePreviewUrl ? (
        <img src={imagePreviewUrl} alt="Preview" className="max-h-60 mx-auto rounded-md object-contain" />
      ) : (
        <div className="flex flex-col items-center">
          <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
          <p className="mt-2 text-sm text-gray-400">
            <span className="font-semibold text-blue-400">Click to upload image</span>
          </p>
          <p className="text-xs text-gray-500">PNG, JPG, JPEG</p>
        </div>
      )}
    </label>
  </div>
);

export default ImageUploader;
