import { useRef, useState } from 'react';
import { config } from './config';
import * as Dialog from '@radix-ui/react-dialog';

type Prediction =
  | 'Benign'
  | 'Malignant'
  | 'Indeterminate / Benign (Follow up recommended)'
  | 'Indeterminate / Malignant (Further testing recommended)';

enum Classification {
  Benign,
  Malignant,
  IndeterminateBenign,
  IndeterminateMalignant,
}

const getLabelFromClassification = (type: number): Prediction | null => {
  switch (type) {
    case 0: {
      return 'Benign';
    }
    case 1: {
      return 'Malignant';
    }
    case 2: {
      return 'Indeterminate / Benign (Follow up recommended)';
    }
    case 3: {
      return 'Indeterminate / Malignant (Further testing recommended)';
    }
    default: {
      return null;
    }
  }
};

const getShortLabelFromClassification = (type: number): string | null => {
  switch (type) {
    case 0: {
      return 'Benign';
    }
    case 1: {
      return 'Malignant';
    }
    case 2: {
      return 'Indeterminate/Benign';
    }
    case 3: {
      return 'Indeterminate/Malignant';
    }
    default: {
      return null;
    }
  }
};

function GitHubIcon() {
  return (
    <svg
      width='38'
      height='38'
      viewBox='0 0 38 38'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M19 2.375C9.81469 2.375 2.375 9.81469 2.375 19C2.375 26.3566 7.13391 32.5702 13.7423 34.773C14.5736 34.9184 14.8853 34.4197 14.8853 33.9833C14.8853 33.5884 14.8645 32.2792 14.8645 30.8869C10.6875 31.6558 9.60687 29.8686 9.27437 28.9334C9.08734 28.4555 8.27688 26.98 7.57031 26.5852C6.98844 26.2734 6.15719 25.5045 7.54953 25.4837C8.85875 25.463 9.79391 26.6891 10.1056 27.1878C11.6019 29.7023 13.9917 28.9958 14.9477 28.5594C15.0931 27.4787 15.5295 26.7514 16.0075 26.3358C12.3084 25.9202 8.44313 24.4862 8.44313 18.1272C8.44313 16.3192 9.08734 14.823 10.1472 13.6592C9.98094 13.2436 9.39906 11.5395 10.3134 9.25359C10.3134 9.25359 11.7058 8.81719 14.8853 10.9577C16.2153 10.5836 17.6284 10.3966 19.0416 10.3966C20.4547 10.3966 21.8678 10.5836 23.1978 10.9577C26.3773 8.79641 27.7697 9.25359 27.7697 9.25359C28.6841 11.5395 28.1022 13.2436 27.9359 13.6592C28.9958 14.823 29.64 16.2984 29.64 18.1272C29.64 24.507 25.7539 25.9202 22.0548 26.3358C22.6575 26.8553 23.177 27.8528 23.177 29.4114C23.177 31.635 23.1562 33.4222 23.1562 33.9833C23.1562 34.4197 23.468 34.9392 24.2992 34.773C27.5996 33.6588 30.4675 31.5377 32.4992 28.7082C34.5309 25.8787 35.6241 22.4834 35.625 19C35.625 9.81469 28.1853 2.375 19 2.375Z'
        fill='white'
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fill-rule='evenodd'
        clip-rule='evenodd'
        d='M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z'
        fill='white'
      />
    </svg>
  );
}

type Case = {
  key: string;
  trueLabel: number;
};

const cases: Case[] = [
  {
    key: 'ISIC_0851414',
    trueLabel: Classification.IndeterminateMalignant,
  },
  {
    key: 'ISIC_1136887',
    trueLabel: Classification.Benign,
  },
  {
    key: 'ISIC_2222766',
    trueLabel: Classification.Malignant,
  },
  {
    key: 'ISIC_2691236',
    trueLabel: Classification.Benign,
  },
  {
    key: 'ISIC_2792717',
    trueLabel: Classification.Malignant,
  },
  {
    key: 'ISIC_3640885',
    trueLabel: Classification.Benign,
  },
  {
    key: 'ISIC_5574004',
    trueLabel: Classification.Benign,
  },
  {
    key: 'ISIC_6202682',
    trueLabel: Classification.Benign,
  },
  {
    key: 'ISIC_6364782',
    trueLabel: Classification.Malignant,
  },
  {
    key: 'ISIC_6720909',
    trueLabel: Classification.Malignant,
  },
  {
    key: 'ISIC_6929321',
    trueLabel: Classification.Benign,
  },
  {
    key: 'ISIC_7239167',
    trueLabel: Classification.Benign,
  },
  {
    key: 'ISIC_7288606',
    trueLabel: Classification.Benign,
  },
  {
    key: 'ISIC_7365059',
    trueLabel: Classification.IndeterminateMalignant,
  },
  {
    key: 'ISIC_7428145',
    trueLabel: Classification.Benign,
  },
  {
    key: 'ISIC_8476601',
    trueLabel: Classification.Benign,
  },
  {
    key: 'ISIC_8738186',
    trueLabel: Classification.IndeterminateMalignant,
  },
  {
    key: 'ISIC_8801733',
    trueLabel: Classification.Benign,
  },
  {
    key: 'ISIC_8999351',
    trueLabel: Classification.IndeterminateMalignant,
  },
  {
    key: 'ISIC_9182038',
    trueLabel: Classification.Benign,
  },
  {
    key: 'ISIC_9498324',
    trueLabel: Classification.Benign,
  },
  {
    key: 'ISIC_9600126',
    trueLabel: Classification.Benign,
  },
  {
    key: 'ISIC_9973437',
    trueLabel: Classification.Benign,
  },
];

const HOST = 'https://melanoma-static.nbaron.com';

function MelanomaSampleTest({ sampleCase }: { sampleCase: Case }) {
  const src = `${HOST}/${sampleCase.key}.jpg`;

  const [classification, setClassification] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);

  const handleTestModel = async () => {
    const response = await fetch(`${config.backendURL}/predict-url`, {
      method: 'POST',
      body: JSON.stringify({ url: src }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log(data.classification);

    setClassification(data.classification);
    setConfidence(data.confidence);
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <img
          src={src}
          className='cursor-pointer aspect-square bg-gray-700 rounded-sm'
          loading='eager'
        />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className='fixed top-0 left-0 right-0 bottom-0 bg-black opacity-30' />
        <Dialog.Content
          aria-describedby={undefined}
          className='px-10 py-10 fixed bg-[#003DC4] min-[400px]:max-w-sm min-[400px]:left-1/2 min-[400px]:-translate-x-1/2 flex flex-col gap-7 top-1/2 left-3 right-3 rounded-2xl text-white -translate-y-1/2'
        >
          <div className='flex items-center justify-between'>
            <Dialog.Title className='text-xl'>
              Actual: {getShortLabelFromClassification(sampleCase.trueLabel)}{' '}
            </Dialog.Title>
            <Dialog.Close className='pointer-events-none'>
              <CloseIcon />
            </Dialog.Close>
          </div>
          <img className='rounded w-full aspect-square' src={src} />
          <div className='flex flex-col'>
            <p className=''>Prediction:</p>
            {typeof classification === 'number' ? (
              <p>{getLabelFromClassification(classification)}</p>
            ) : (
              <p className='font-semibold'>Start test to get results</p>
            )}
          </div>
          <div className='flex flex-col'>
            <p>Confidence:</p>
            {typeof confidence === 'number' ? (
              <p>{(confidence * 100).toFixed(2)}%</p>
            ) : (
              <p className='font-semibold'>Start test to get results</p>
            )}
          </div>
          <button
            onClick={handleTestModel}
            className='py-3 bg-[#00277C] rounded-2xl'
          >
            Test model
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function App() {
  const uploadImagesRef = useRef<HTMLInputElement>(null);

  const [classification, setClassification] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleUploadImage: React.InputHTMLAttributes<HTMLInputElement>['onChange'] =
    async (event) => {
      if (!event.target.files) return;

      const file = event.target.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('image', file);

      try {
        const endpoint = `${config.backendURL}/predict`;

        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        setClassification(data.classification);
        setConfidence(data.confidence);
        setPreviewUrl(URL.createObjectURL(file));
      } catch (error) {
        console.error('Error:', error);
      } finally {
        uploadImagesRef.current!.value = '';
      }
    };

  const handleClickUploadImage = () => {
    uploadImagesRef.current?.click();
  };

  return (
    <div className='mx-7 my-7'>
      <a
        href='https://nbaron.com'
        target='_blank'
        className='text-white text-xl'
      >
        nbaron
      </a>
      <div className='flex flex-col gap-4 mt-16 md:gap-7'>
        <h1 className='text-3xl text-white sm:text-5xl font-semibold sm:text-center md:text-5xl max-w-[800px] !leading-[120%] sm:mx-auto'>
          Detecting Melanoma Skin Cancer With 99.73% Accuracy* Using Machine
          Learning
        </h1>
        <div className='flex flex-col gap-4 sm:text-center md:text-xl'>
          <p className='text-white'>
            Each year 8,290 people die from Melanoma Skin Cancer
            <a
              className='underline'
              target='_blank'
              href='https://www.aad.org/media/stats-skin-cancer#:~:text=The%20vast%20majority%20of%20skin%20cancer%20deaths%20are%20from%20melanoma.&text=Nearly%2020%20Americans%20die%20from,5%2C430%20men%20and%202%2C860%20women.&text=Research%20indicates%20that%20men%20with,rates%20than%20women%20with%20melanoma.'
            >
              ¹
            </a>
          </p>
          <p className='text-white'>
            When detected early, the 5-year survival rate for Melanoma is 99
            percent
            <a
              className='underline'
              href='https://www.skincancer.org/skin-cancer-information/skin-cancer-facts/'
              target='_blank'
            >
              ²
            </a>
          </p>
        </div>
      </div>
      <input
        type='file'
        accept='image/*'
        className='text-white invisible absolute -z-10 -top-full -left-full'
        ref={uploadImagesRef}
        onChange={handleUploadImage}
      />
      <div className='flex flex-col gap-3 mt-7 items-center'>
        {classification !== null && confidence !== null ? (
          <>
            <div className='flex flex-col gap-2 w-[440px] text-center'>
              {previewUrl && (
                <img
                  src={previewUrl}
                  className='rounded-lg w-full aspect-square'
                />
              )}
              <p className='text-white font-bold'>
                Prediction: {getLabelFromClassification(classification)}
              </p>
              <p className='text-white'>
                Confidence: {(confidence * 100).toFixed(2)}%
              </p>
            </div>
            <button
              className='text-white bg-[#00277C] sm:max-w-72 sm:text-md mx-auto w-full py-3 rounded-3xl'
              onClick={handleClickUploadImage}
            >
              Try another
            </button>
          </>
        ) : (
          <button
            className='text-white bg-[#00277C] sm:max-w-72 sm:text-md mx-auto w-full py-3 rounded-3xl'
            onClick={handleClickUploadImage}
          >
            Upload test image
          </button>
        )}

        <p className='text-gray-200 text-left sm:text-center max-w-[400px]'>
          This is only for educational purposes, and should not be used as a
          replacement for medical care
        </p>
      </div>
      <div className='text-white flex flex-col mt-12 gap-3 lg:mx-36'>
        <div className='flex flex-col gap-3 my-3'>
          <p className='font-medium text-3xl text-center'>
            Test a sample image
          </p>
          <p className='text-center'>
            Test our image using randomly selected images from{' '}
            <a
              className='underline'
              href='https://isic-archive.com/'
              target='_blank'
            >
              ISIC
            </a>{' '}
            that were not included in the training set
          </p>
        </div>
        <div className='grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          {cases.map((_, index) => {
            const currentCase = cases[index];
            if (!currentCase) return null;

            return <MelanomaSampleTest key={index} sampleCase={currentCase} />;
          })}
        </div>
      </div>

      <div className='flex flex-col sm:flex-row gap-5 sm:items-end justify-between mt-12'>
        <p className='text-gray-200 text-left sm:text-center'>
          *Accuracy based test on a test dataset of 10,000 test images from{' '}
          <a
            href='https://www.isic-archive.com/'
            className='underline'
            target='_blank'
          >
            ISIC
          </a>
        </p>
        <a
          target='_blank'
          href='https://github.com/noahbaron91/melanoma-detector'
        >
          <GitHubIcon />
        </a>
      </div>
    </div>
  );
}

export default App;
