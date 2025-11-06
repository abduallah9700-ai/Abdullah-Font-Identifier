import React, { useState, useCallback, ChangeEvent } from 'react';
import { identifyFont } from './services/geminiService';
import type { FontAnalysisResponse } from './types';
import ImageUploader from './components/ImageUploader';
import ResultsDisplay from './components/ResultsDisplay';
import Spinner from './components/Spinner';

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });

function App() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fontData, setFontData] = useState<FontAnalysisResponse | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (validTypes.includes(file.type)) {
        setImageFile(file);
        setFontData(null);
        setError(null);
        if (imagePreviewUrl) {
            URL.revokeObjectURL(imagePreviewUrl);
        }
        const previewUrl = URL.createObjectURL(file);
        setImagePreviewUrl(previewUrl);
      } else {
        setError("Invalid file type. Please upload a PNG, JPG, or JPEG file.");
        setImageFile(null);
        setImagePreviewUrl(null);
      }
    }
  };
  
  const handleIdentifyClick = useCallback(async () => {
    if (!imageFile) {
      setError("Please select an image first.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setFontData(null);
    
    try {
      const base64Image = await fileToBase64(imageFile);
      const result = await identifyFont(base64Image, imageFile.type);
      setFontData(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-2xl mx-auto text-center">
        <header className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Gemini Font Identifier
          </h1>
        </header>

        <main>
          <ImageUploader 
            onFileChange={handleFileChange}
            imagePreviewUrl={imagePreviewUrl}
            isLoading={isLoading}
          />
          
          <div className="mt-6">
            <button
              onClick={handleIdentifyClick}
              disabled={!imageFile || isLoading}
              className="w-full max-w-lg mx-auto bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:shadow-none focus:outline-none focus:ring-4 focus:ring-blue-500/50"
            >
              {isLoading ? 'Analyzing...' : 'Identify Font'}
            </button>
          </div>

          <div className="mt-8 min-h-[50px]">
            {isLoading && <Spinner />}
            {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-md">{error}</p>}
            {fontData && <ResultsDisplay data={fontData} />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
