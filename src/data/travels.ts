export type TripStatus = 'visited' | 'planned';

export interface Trip {
  id: string;
  country: string;
  city?: string;
  emoji: string;
  image: string;
  date: string;
  note: string;
  impressions: string[];
  status: TripStatus;
  lat?: number;
  lng?: number;
}

export interface Checklist {
  packing: string[];
  weather: string;
  places: string[];
  visa: string;
  currency: string;
  phrases: { phrase: string; translation: string }[];
  transport: string;
}

export const initialTrips: Trip[] = [
  {
    id: 'lk',
    country: 'Шри-Ланка',
    city: 'Галле',
    emoji: '🌴',
    image: 'https://cdn.poehali.dev/projects/08b06f39-7f28-4cd0-a5fe-21db1c5a9aea/files/42264ec1-f82f-42ce-a73d-ceda200729c3.jpg',
    date: 'Февраль 2024',
    note: 'Остров чая, слонов и бесконечных пляжей. Каждое утро начиналось с манго и звука океана.',
    impressions: ['Сафари в национальном парке Яла', 'Поезд сквозь чайные плантации', 'Закат на форте Галле'],
    status: 'visited',
    lat: 6.0329,
    lng: 80.217,
  },
  {
    id: 'tr',
    country: 'Турция',
    city: 'Каппадокия',
    emoji: '🎈',
    image: 'https://cdn.poehali.dev/projects/08b06f39-7f28-4cd0-a5fe-21db1c5a9aea/files/1b62e661-7750-4488-9f28-e0f0192fe28f.jpg',
    date: 'Сентябрь 2023',
    note: 'Волшебная страна воздушных шаров и лунных пейзажей. Проснулась до рассвета — и не пожалела.',
    impressions: ['Полёт на воздушном шаре', 'Пещерный отель', 'Турецкий завтрак с видом на долину'],
    status: 'visited',
    lat: 38.6431,
    lng: 34.8289,
  },
  {
    id: 'mx',
    country: 'Мексика',
    city: 'Тулум',
    emoji: '🌵',
    image: 'https://cdn.poehali.dev/projects/08b06f39-7f28-4cd0-a5fe-21db1c5a9aea/files/2724a3c4-b21f-4a6a-a7b2-0b6d418f3ab2.jpg',
    date: 'Мечта на 2025',
    note: 'Пирамиды майя, сеноты с бирюзовой водой и тако на каждом углу. Хочу встретить там Новый год.',
    impressions: ['Сеноты Юкатана', 'Руины Чичен-Ицы', 'Пляжи Тулума'],
    status: 'planned',
    lat: 20.2114,
    lng: -87.4654,
  },
  {
    id: 'no',
    country: 'Норвегия',
    city: 'Тромсё',
    emoji: '❄️',
    image: 'https://cdn.poehali.dev/projects/08b06f39-7f28-4cd0-a5fe-21db1c5a9aea/files/c7c282a4-bd6c-47c3-bfa5-c887f6c8620c.jpg',
    date: 'Мечта на зиму',
    note: 'Северное сияние, фьорды и уютные домики в снегу. Главная мечта — увидеть аврору своими глазами.',
    impressions: ['Северное сияние', 'Круиз по фьордам', 'Катание на собачьих упряжках'],
    status: 'planned',
    lat: 69.6492,
    lng: 18.9553,
  },
];

export function generateChecklist(trip: Trip): Checklist {
  const presets: Record<string, Checklist> = {
    'Мексика': {
      packing: ['Лёгкая одежда и купальник', 'Солнцезащитный крем SPF 50', 'Репеллент от комаров', 'Удобная обувь для руин'],
      weather: 'Тепло круглый год, +28°C. Сезон дождей с июня по октябрь — берите лёгкий дождевик.',
      places: ['Чичен-Ица — пирамида майя', 'Сеноты Юкатана — купание в подземных озёрах', 'Пляжи Тулума с руинами'],
      visa: 'Виза не нужна: россиянам доступна электронная форма SAE онлайн перед вылетом.',
      currency: 'Мексиканское песо (MXN). 1 USD ≈ 17 песо. Карты принимают в городах, наличные — на рынках.',
      phrases: [
        { phrase: 'Hola', translation: 'Привет' },
        { phrase: 'Gracias', translation: 'Спасибо' },
        { phrase: '¿Cuánto cuesta?', translation: 'Сколько стоит?' },
      ],
      transport: 'Между городами — комфортные автобусы ADO. Внутри города — такси и приложение Uber.',
    },
    'Норвегия': {
      packing: ['Тёплая многослойная одежда', 'Термобельё и шапка', 'Непромокаемая обувь', 'Штатив для фото сияния'],
      weather: 'Зимой холодно, до −10°C, но сухо. Лучшее время для северного сияния — с ноября по март.',
      places: ['Тромсё — столица Арктики', 'Фьорды — круиз среди скал', 'Смотровые точки для авроры'],
      visa: 'Нужна шенгенская виза. Оформляется заранее, срок рассмотрения 10–15 дней.',
      currency: 'Норвежская крона (NOK). 1 USD ≈ 10 крон. Оплата почти везде картой, наличные почти не нужны.',
      phrases: [
        { phrase: 'Hei', translation: 'Привет' },
        { phrase: 'Takk', translation: 'Спасибо' },
        { phrase: 'Hvor er...?', translation: 'Где находится...?' },
      ],
      transport: 'Поезда Vy и автобусы между городами, паромы по фьордам. В городах — трамваи и такси.',
    },
  };

  return presets[trip.country] ?? {
    packing: ['Документы и копии паспорта', 'Универсальный переходник для розеток', 'Аптечка первой помощи', 'Удобная обувь для прогулок'],
    weather: 'Уточните прогноз перед поездкой и возьмите одежду по слоям на разную погоду.',
    places: trip.impressions.length ? trip.impressions : ['Главная площадь', 'Местный рынок', 'Смотровая площадка'],
    visa: 'Проверьте визовые требования для вашего гражданства на официальном сайте посольства.',
    currency: 'Заранее узнайте курс местной валюты и возьмите немного наличных на первое время.',
    phrases: [
      { phrase: 'Hello', translation: 'Привет' },
      { phrase: 'Thank you', translation: 'Спасибо' },
      { phrase: 'How much?', translation: 'Сколько стоит?' },
    ],
    transport: 'Изучите местное такси-приложение и общественный транспорт заранее.',
  };
}