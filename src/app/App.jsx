import { useState } from 'react';
import { useImageProcessor } from './hooks/useImageProcessor.js';
import Header from './components/Header.jsx';
import UploadZone from './components/UploadZone.jsx';
import ImagePreview from './components/ImagePreview.jsx';
import ProcessingStatus from './components/ProcessingStatus.jsx';
import ActionBar from './components/ActionBar.jsx';
import Footer from './components/Footer.jsx';
import Toast from './components/Toast.jsx';
import AdSlot from './components/AdSlot.jsx';
import ProBanner from './components/ProBanner.jsx';
import SharePrompt from './components/SharePrompt.jsx';
import './styles/global.css';

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  
  const { status, result, error, processImage, reset } = useImageProcessor();

  const handleFileSelected = (file) => {
    setSelectedFile(file);
    processImage(file);
  };

  const handleReset = () => {
    setSelectedFile(null);
    reset();
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const showUploadZone = status === 'idle' || status === 'error';

  return (
    <main>
      <Header />
      
      <AdSlot position="top" hidden={status === 'processing'} />

      {showUploadZone && (
        <UploadZone 
          onFileSelected={handleFileSelected} 
          disabled={status === 'processing'} 
        />
      )}

      {selectedFile && (
        <ImagePreview 
          originalFile={selectedFile}
          resultUrl={result?.objectUrl ?? null}
          isProcessing={status === 'processing'}
          meta={result?.meta ?? null}
        />
      )}

      <ProcessingStatus 
        status={status}
        error={error}
        meta={result?.meta ?? null}
      />

      <ActionBar 
        status={status}
        resultUrl={result?.objectUrl ?? null}
        resultBlob={result?.blob ?? null}
        onReset={handleReset}
        onToast={showToast}
      />

      <AdSlot position="bottom" hidden={status !== 'done'} />
      
      <ProBanner visible={status === 'done'} />
      
      <SharePrompt visible={status === 'done'} appUrl="https://your-domain.com" />

      <Footer />

      <Toast 
        message={toastMessage} 
        onDismiss={() => setToastMessage(null)} 
      />
    </main>
  );
}
