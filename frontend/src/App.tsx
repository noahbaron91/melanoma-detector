import { useRef, useState } from 'react';
import { config } from './config';
import * as Dialog from '@radix-ui/react-dialog';

type Prediction =
  | 'Benign'
  | 'Malignant'
  | 'Indeterminate / Benign (Follow up recommended)'
  | 'Indeterminate / Malignant (Further testing recommended)';

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
      width='28'
      height='28'
      viewBox='0 0 28 28'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M6.17374 6.17765C6.62935 5.72203 7.36804 5.72203 7.82366 6.17765L13.9987 12.3527L20.1737 6.17765C20.6294 5.72203 21.368 5.72203 21.8237 6.17765C22.2793 6.63326 22.2793 7.37195 21.8237 7.82756L15.6486 14.0026L21.8237 20.1776C22.2793 20.6333 22.2793 21.372 21.8237 21.8276C21.368 22.2832 20.6294 22.2832 20.1737 21.8276L13.9987 15.6525L7.82366 21.8276C7.36804 22.2832 6.62935 22.2832 6.17374 21.8276C5.71813 21.372 5.71813 20.6333 6.17374 20.1776L12.3488 14.0026L6.17374 7.82756C5.71813 7.37195 5.71813 6.63326 6.17374 6.17765Z'
        fill='white'
      />
    </svg>
  );
}

function MelanomaSampleTest({ src }: { src: string }) {
  const handleTestModel = () => {
    console.log('test model');
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger className='h-72 bg-white'></Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className='fixed top-0 left-0 right-0 bottom-0 bg-black opacity-30' />
        <Dialog.Content
          aria-describedby={undefined}
          className='px-6 py-10 fixed bg-[#003DC4] flex flex-col gap-7 top-1/2 left-3 right-3 rounded-2xl text-white -translate-y-1/2'
        >
          <div className='flex justify-between items-center'>
            <Dialog.Title className='text-2xl font-semibold'>
              Actual: Benign
            </Dialog.Title>
            <Dialog.Close>
              <CloseIcon />
            </Dialog.Close>
          </div>
          <img
            className='rounded w-full aspect-square'
            src='https://content.isic-archive.com/3a943f28-4c9a-47ba-8dac-3178c844de05/027b1919-6520-4f49-ab0a-99bf6bed4737.jpg?Expires=1730160000&Signature=vb8dyvK~KvOVlr7ymxyqMaLB4evrdo8jyzJC-KWsM-FL3UCC33QPWQ3yi8dQnrrO3L0xY45EWuT6~mECx-rJwd9YKJZQfm2nQcb7uBjqFn0A~5aGGhu1jTNfjKhcxbWmU6vGLTDRDboBOqvElihM~YlnKsnwi-ekvk9pTD0SC24dS-Nd0eyj7cz0pgEHCHizq~PGvmrnzRDpGGpqhiyQz~tuRsk5syuJecr1097JL28qbIJuDGmxX9Vj4BRmMtYYh7FDii-TDZN4gtE2MM2Atm4CIYgtvjujNpOIvm4UkiUmKi059x8f1lBLkzblxB-gvjHIJeZoX5uX9yn356IxRg__&Key-Pair-Id=K1C8I6SNK7JVJ8'
          />
          <div className='flex flex-col'>
            <p className=''>Prediction:</p>
            <p className='font-bold'>Start test to get results</p>
          </div>
          <div className='flex flex-col'>
            <p>Confidence:</p>
            <p className='font-bold'>Start test to get results</p>
          </div>
          <button
            onClick={handleTestModel}
            className='py-4 bg-[#00277C] rounded-lg'
          >
            Test model
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// const useImages = () => {
//   const [images, setImages] = useState<string[]>([]);

//   const randomizeImages = () => {
//     console.log('randomize images');
//   };

//   const getImages = async () => {
//     try {
//       const numOfImages = await fetch(
//         'https://api.isic-archive.com/api/v2/stats/'
//       );

//       const imagesData = await numOfImages.json();
//       const numberOfPublicImages = imagesData.image.public_images_count;

//       console.log(numberOfPublicImages);
//       return numberOfPublicImages;
//     } catch (error) {
//       console.error('Error fetching images', error);
//     }
//   };

//   useEffect(() => {
//     getImages().then((images) => {
//       setImages(images);
//     });
//   }, []);

//   return { images, randomizeImages };
// };

function App() {
  const [image, setImage] = useState<File | null>(null);
  // const { images, randomizeImages } = useImages();

  const uploadImagesRef = useRef<HTMLInputElement>(null);

  const [classification, setClassification] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);

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
      } catch (error) {
        console.error('Error:', error);
      }
    };

  // const handleSubmit: React.DOMAttributes<HTMLFormElement>['onSubmit'] = async (
  //   event
  // ) => {
  //   event.preventDefault();

  //   if (!image) {
  //     console.error('No image selected');
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append('image', image);

  //   console.log('send file to backend', image);
  //   try {
  //     const response = await fetch(`${config.backendURL}/predict`, {
  //       method: 'POST',
  //       body: formData,
  //     });

  //     const data = await response.json();

  //     setClassification(data.classification);
  //     setConfidence(data.confidence);
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // };

  const handleClickUploadImage = () => {
    uploadImagesRef.current?.click();
  };

  return (
    <div className='mx-7 my-7'>
      <p className='text-white text-xl'>nbaron</p>
      <div className='flex flex-col gap-4 mt-16'>
        <h1 className='text-4xl text-white font-semibold'>
          Using AI to detect skin cancer
        </h1>
        <div className='flex flex-col gap-4'>
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
            >
              ²
            </a>
          </p>
        </div>
      </div>
      <div className='my-3'>
        <input
          type='file'
          accept='image/*'
          className='text-white invisible'
          ref={uploadImagesRef}
          onChange={handleUploadImage}
        />
        <div className='flex flex-col gap-3'>
          {classification !== null && confidence !== null ? (
            <div className='flex flex-col gap-2'>
              <p className='text-white'>Prediction:</p>
              <p className='text-white font-bold'>
                {getLabelFromClassification(classification)}
              </p>
              <p className='text-white'>
                Confidence: {(confidence * 100).toFixed(2)}%
              </p>
              <button className='text-white bg-[#00277C] w-full py-4 rounded-lg'>
                Try another
              </button>
            </div>
          ) : (
            <button
              className='text-white bg-[#00277C] w-full py-4 rounded-lg'
              onClick={handleClickUploadImage}
            >
              Upload test image
            </button>
          )}

          <p className='text-gray-200 text-left text-sm'>
            This is only for educational purposes, and should not be used as a
            replacement for medical care
          </p>
        </div>
      </div>
      <div className='text-white flex flex-col mt-12 gap-3'>
        <div className='flex flex-col gap-2 my-3'>
          <p className='font-medium text-2xl'>Test an image on our AI model</p>
          <p>These images were never seen during training</p>
        </div>
        <div className='flex flex-col gap-1'>
          <MelanomaSampleTest src='' />
          <MelanomaSampleTest src='' />
          <MelanomaSampleTest src='' />
          <MelanomaSampleTest src='' />
        </div>
      </div>

      <a
        target='_blank'
        href='https://github.com/noahbaron91/melanoma-detector'
        className='rounded-full w-12 h-12 mt-6 block'
      >
        <GitHubIcon />
      </a>
    </div>
  );
}

export default App;
