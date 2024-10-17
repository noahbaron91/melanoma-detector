import { useState } from 'react';
import './App.css';

function App() {
  const [image, setImage] = useState<File | null>(null);

  const [result, setResult] = useState<string | null>(null);

  const handleSubmit: React.DOMAttributes<HTMLFormElement>['onSubmit'] = async (
    event
  ) => {
    event.preventDefault();

    if (!image) {
      console.error('No image selected');
      return;
    }

    const formData = new FormData();
    formData.append('upload_file', image);

    console.log('send file to backend', image);
    try {
      const response = await fetch('http://127.0.0.1:5001/predict', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      setResult(data.data.prediction);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleFileChange: React.DOMAttributes<HTMLInputElement>['onChange'] = (
    event
  ) => {
    const newFile = (event.target as EventTarget & { files: File[] }).files[0];

    setImage(newFile);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type='file' onChange={handleFileChange} />
      <button type='submit'>Submit</button>
      {typeof result === 'string' && <p>Type: {result}</p>}
    </form>
  );
}

export default App;
