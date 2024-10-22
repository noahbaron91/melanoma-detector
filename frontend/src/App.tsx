import { useState } from 'react';
import './App.css';
import { config } from './config';

type Prediction =
  | 'Benign'
  | 'Malignant'
  | 'Indeterminate / Benign'
  | 'Indeterminate / Malignant';

const getLabelFromClassification = (type: number): Prediction | null => {
  switch (type) {
    case 0: {
      return 'Benign';
    }
    case 1: {
      return 'Malignant';
    }
    case 2: {
      return 'Indeterminate / Benign';
    }
    case 3: {
      return 'Indeterminate / Malignant';
    }
    default: {
      return null;
    }
  }
};

function App() {
  const [image, setImage] = useState<File | null>(null);

  const [classification, setClassification] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);

  const handleSubmit: React.DOMAttributes<HTMLFormElement>['onSubmit'] = async (
    event
  ) => {
    event.preventDefault();

    if (!image) {
      console.error('No image selected');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    console.log('send file to backend', image);
    try {
      const response = await fetch(`${config.backendURL}/predict`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      setClassification(data.classification);
      setConfidence(data.confidence);
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
      <h1 style={{ fontSize: 24 }}>
        THIS IS JUST FOR EXPERIMENTAL PURPOSES MADE BY A STUDENT.
        <br />
        <u>DO NOT TAKE THESE RESULTS SERIOUSLY.</u>
        <br />
        PLEASE GO VISIT A DOCTOR.
      </h1>
      <input type='file' onChange={handleFileChange} />
      <button type='submit'>Submit</button>
      {typeof classification === 'number' && (
        <p>Type: {getLabelFromClassification(classification)}</p>
      )}
      {typeof confidence === 'number' && (
        <p>Confidence: {Math.round(confidence * 100)}%</p>
      )}
    </form>
  );
}

export default App;
