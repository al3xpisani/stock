
import axios from "axios"
import express from "express"
import { Request, Response } from "express"
import httpStatus from "http-status"
import Papa from "papaparse"

export interface StockData {
    Name: string;
    Symbol: string;
    Open: string;
    High: string;
    Low: string;
    Close: string;
    Date: string;
  }

const stockDiagram = express.Router()
stockDiagram.get(
    "/",
    async (req: Request, res: Response) => {
        try {
           const stockQuery = req.query.q
           const result = await axios.get(`${process.env.STOCK_BASE_URL}${stockQuery}&f=sd2t2ohlcvn&h&e=csv"`)
           const parsedData = Papa.parse(result.data, {
            header: true,
            skipEmptyLines: true
          });
          if (parsedData.data && parsedData.data.length > 0) {
            const stockData = parsedData.data[0] as StockData;
            if (Object.values(stockData).some(value => value === 'N/D')) {
                return res.status(httpStatus.OK).json({ error: 'No valid data found for the given stock symbol' });
              }
            const transformedData = {
              name: stockData.Name,
              symbol: stockData.Symbol,
              open: parseFloat(stockData.Open),
              high: parseFloat(stockData.High),
              low: parseFloat(stockData.Low),
              close: parseFloat(stockData.Close),
              stockDate: new Date(stockData.Date).toISOString()
            };
            console.log("transformed dta ", transformedData)
            return res.status(httpStatus.OK).json(transformedData)
          } else {
            return res.status(httpStatus.OK).json('No data found for stock code provided.');
          }
        } catch (e) {
            return res
                .status(httpStatus.BAD_REQUEST)
                .json({ status: "Error in Stock Service - get data " + e })
        }
    }
)

export default stockDiagram