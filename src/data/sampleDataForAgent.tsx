/** @format */
import { City, State } from 'country-state-city';
import sampleImg from '@/assets/assets.png';

// Define valid states and cities for Nigeria (country code: NG)
const nigeriaStates = State.getStatesOfCountry('NG');

// const lagosCities = City.getCitiesOfState('NG', 'LA'); // Lagos state code: LA
// const abujaCities = City.getCitiesOfState('NG', 'FC'); // Abuja (Federal Capital Territory) code: FC
const badagryCity = City.getCitiesOfState('NG', 'LA').find(
  (city) => city.name === 'Badagry'
);

//Helper function to get a random state
const getRandomState = () => {
  const states = nigeriaStates;
  return states[Math.floor(Math.random() * states.length)].name;
};

// Helper function to get a random city from a state
const getRandomCity = (stateCode: string) => {
  const cities = City.getCitiesOfState('NG', stateCode);
  return cities[Math.floor(Math.random() * cities.length)].name;
};

/**
 * export interface DataProps {
  date: string;
  propertyType: string;
  location: string;
  propertyPrice: string | number;
  document?: string;
  amountSold?: string | number;
  propertyFeatures?: {
    additionalFeatures: string[];
    noOfBedrooms: number;
  };
  docOnProperty?: { _id: string; isProvided: boolean; docName: string }[];
  actualLocation?: {
    state: string;
    localGovernment: string;
    area: string;
  };
  pictures?: string[];
}
 */

// Updated briefData with actual locations
export const briefData = [
  {
    date: '12/12/2024',
    propertyType: 'Residential',
    location: `Lagos, ${getRandomCity('LA')}`, // Random city in Lagos
    propertyPrice: 200000000,
    document: 'C of o, receipt,...',
    amountSold: 2000000,
    propertyFeatures: {
      additionalFeatures: ['CCTV'],
      noOfBedrooms: 26,
    },
    docOnProperty: [
      {
        _id: 'xxxaaaddd2345lkfg',
        isProvided: true,
        docName: 'C of O',
      },
    ],
    actualLocation: {
      state: getRandomState(),
      localGovernment: getRandomCity('LA'),
      area: '',
    },
    pictures: [sampleImg.src],
  },
  {
    date: '12/12/2024',
    propertyType: 'Residential',
    location: `Lagos, ${getRandomCity('LA')}`, // Random city in Lagos
    propertyPrice: 200000000,
    document: 'C of o, receipt,...',
    amountSold: 2000000,
    propertyFeatures: {
      additionalFeatures: ['CCTV'],
      noOfBedrooms: 26,
    },
    docOnProperty: [
      {
        _id: 'xxxaaaddd2345lkfg',
        isProvided: true,
        docName: 'C of O',
      },
    ],
    actualLocation: {
      state: getRandomState(),
      localGovernment: getRandomCity('LA'),
      area: '',
    },
    pictures: [sampleImg.src],
  },
  {
    date: '12/12/2024',
    propertyType: 'Residential',
    location: `Lagos, ${getRandomCity('LA')}`, // Random city in Lagos
    propertyPrice: 200000000,
    document: 'C of o, receipt,...',
    amountSold: 2000000,
    propertyFeatures: {
      additionalFeatures: ['CCTV'],
      noOfBedrooms: 26,
    },
    docOnProperty: [
      {
        _id: 'xxxaaaddd2345lkfg',
        isProvided: true,
        docName: 'C of O',
      },
    ],
    actualLocation: {
      state: getRandomState(),
      localGovernment: getRandomCity('LA'),
      area: '',
    },
    pictures: [sampleImg.src],
  },
  {
    date: '12/12/2024',
    propertyType: 'Residential',
    location: `Lagos, ${getRandomCity('LA')}`, // Random city in Lagos
    propertyPrice: 200000000,
    document: 'C of o, receipt,...',
    amountSold: 2000000,
    propertyFeatures: {
      additionalFeatures: ['CCTV'],
      noOfBedrooms: 26,
    },
    docOnProperty: [
      {
        _id: 'xxxaaaddd2345lkfg',
        isProvided: true,
        docName: 'C of O',
      },
    ],
    actualLocation: {
      state: getRandomState(),
      localGovernment: getRandomCity('LA'),
      area: '',
    },
    pictures: [sampleImg.src],
  },
  // Add more entries as needed
];

// export const fetchTotalBrief = async () => {
//   try {
//     // const response = await fetch('API_ENDPOINT');
//     const response = await fetch(URLS.BASE + URLS.agentfetchTotalBriefs, {
//       signal,
//     });
//     const result = await response.json();

//     if (result.success) {
//       const combinedData = [...result.data.sellProperties, ...result.data.rentProperties];
//       const formattedData = combinedData.map((property) => ({
//         date: new Date(property.createdAt).toLocaleDateString(),
//         propertyType: property.propertyType,
//         location: `${property.location.state}, ${property.location.localGovernment}`,
//         propertyPrice: property.price || property.rentalPrice,
//         document: property.docOnProperty ? property.docOnProperty.map(doc => doc.docName).join(', ') : 'N/A',
//       }));
//       return { success: true, data: formattedData };
//     } else {
//       return { success: false, message: 'Failed to fetch data' };
//     }
//   } catch (error) {
//     console.error('An error occurred while fetching data:', error);
//     return { success: false, message: 'An error occurred while fetching data' };
//   }
// };

// Updated completeTransactionData with actual locations
export const completeTransactionData = [
  {
    date: '12/12/2024',
    propertyType: 'Residential',
    location: `Lagos, ${getRandomCity('LA')}`, // Random city in Lagos
    propertyPrice: 200000000,
    amountSold: 200000000,
  },
  {
    date: '09/12/2024',
    propertyType: 'Residential',
    location: `Lagos, ${badagryCity?.name || 'Badagry'}`, // Badagry city in Lagos
    propertyPrice: 200000000,
    amountSold: 200000000,
  },
  {
    date: '12/12/2024',
    propertyType: 'Residential',
    location: `Abuja, ${getRandomCity('FC')}`, // Random city in Abuja
    propertyPrice: 200000000,
    amountSold: 200000000,
  },
  // Add more entries as needed
];
