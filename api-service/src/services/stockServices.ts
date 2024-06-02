import {
  addFirebaseDocument,
  fetchAllFirebaseData
} from '../config/fetchFirebaseData';
import { v4 as uuidv4 } from 'uuid';
import {
  DiagramSchema,
  GroupedStock,
  StockDataResponse,
  TransformedData,
  UserInfo
} from '../types';
import axios, { AxiosResponse } from 'axios';
import { DocumentData } from 'firebase/firestore';

export const getStockByIdService = async (
  fieldValue: string,
  userInfo: object
) => {
  try {
    console.log(
      'api service .... ',
      `${process.env.STOCK_BASE_URL}:${process.env.STOCK_PORT_SERVICE}${process.env.STOCK_PATH}?q=${fieldValue}`
    );
    const response: AxiosResponse<TransformedData> = await axios.get(
      `${process.env.STOCK_BASE_URL}:${process.env.STOCK_PORT_SERVICE}${process.env.STOCK_PATH}?q=${fieldValue}`
    );
    const data = response.data;
    const { error } = response.data || {};
    if (!error) {
      const transformedData: TransformedData = {
        name: data.name,
        symbol: data.symbol,
        open: data.open,
        high: data.high,
        low: data.low,
        close: data.close,
        stockDate: data.stockDate
      };
      await createStockService(transformedData, userInfo);
      return { hasData: true, status: transformedData };
    } else {
      return { hasData: false, status: 'No data found for given stock symbol' };
    }
  } catch (e) {
    console.error('Error persisting stock :  ', e);
  }
};

export const createStockService = async (
  transformedData: TransformedData,
  userInfo: object
) => {
  try {
    const id = uuidv4();
    const diagramData: DiagramSchema = {};
    const collectionName = process.env.COLLECTION_NAME;
    if (!collectionName) {
      throw new Error('COLLECTION_NAME environment variable is not defined');
    }
    diagramData.id = id;
    diagramData.creation = new Date().toISOString();
    diagramData.data = transformedData;
    diagramData.userInfo = userInfo;
    const persistResult = await addFirebaseDocument(
      diagramData,
      collectionName
    );
    if (!persistResult) {
      throw new Error('Failed to persist stock data in the database');
    }
    return diagramData;
  } catch (e) {
    console.error('Error when creating stock in DB :  ', e);
  }
};

export const getStockService = async (orderByField: string) => {
  try {
    const collectionName = process.env.COLLECTION_NAME;
    if (!collectionName) {
      throw new Error('COLLECTION_NAME environment variable is not defined');
    }
    const respAlldiagrams = await fetchAllFirebaseData(
      collectionName,
      orderByField,
      false
    );
    return respAlldiagrams;
  } catch (e) {
    console.error('Error when listing all stocks :  ', e);
  }
};

export const getStockServiceStats = async (
  orderByField: string,
  userInfo: UserInfo
) => {
  try {
    const collectionName = process.env.COLLECTION_NAME;
    const { role: isAdmin } = userInfo || {};
    if (!collectionName) {
      throw new Error('COLLECTION_NAME environment variable is not defined');
    }
    if (isAdmin !== 'admin') {
      return { error: 'Only super users can query the stocks stats' };
    }
    const returnStockStats = await fetchAllFirebaseData(
      collectionName,
      orderByField,
      false
    );
    if (returnStockStats) {
      const stockStats: StockDataResponse[] = returnStockStats.map(
        (doc: DocumentData) => {
          const stockData = {
            Name: doc.data.name,
            Symbol: doc.data.symbol,
            Open: doc.data.open,
            High: doc.data.high,
            Low: doc.data.low,
            Close: doc.data.close,
            Date: doc.data.date
          };
          return { data: stockData };
        }
      );
      return groupStocksBySymbol(stockStats);
    }
  } catch (e) {
    console.error('Error when listing stocks stats :  ', e);
  }
};

const groupStocksBySymbol = (data: StockDataResponse[]): GroupedStock[] => {
  const stockCount: { [key: string]: number } = {};

  data.forEach((item) => {
    const { Symbol: symbol } = item.data;
    if (stockCount[symbol]) {
      stockCount[symbol]++;
    } else {
      stockCount[symbol] = 1;
    }
  });
  const mappedStocks = Object.keys(stockCount).map((symbol) => ({
    stock: symbol.toLowerCase(),
    times_requested: stockCount[symbol]
  }));

  const sortedMappedStocks = mappedStocks.sort(
    (a, b) => b.times_requested - a.times_requested
  );
  return sortedMappedStocks.slice(0, 5);
};
