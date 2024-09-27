'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardContent } from '../../components/ui/card.jsx';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert.jsx';
import Button from '@/app/components/ui/button';
import Input from '@/app/components/ui/input';
import styled from 'styled-components';
import Loader from '../../components/ui/Loader.jsx';
import ToggleSection from '../../components/ui/toggle.jsx';
import { useRouter } from 'next/router.js';
import { useParams } from 'next/navigation.js';

const CompanyContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px;
  background: url('https://images.unsplash.com/photo-1516116216620-e18592f1c2f7') no-repeat center center fixed;
  background-size: cover;
  position: relative;
  color: white;
`;

const SearchForm = styled.form`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  width: 100%;
  z-index: 2;
`;

const StyledInput = styled(Input)`
  flex: 1;
  margin-right: 10px;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  color: #333;
  border: 1px solid #ccc;
  border-radius: 4px;

  &::placeholder {
    color: #888;
  }
`;

const SearchButton = styled(Button)`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const CompanyList = styled.ul`
  list-style-type: none;
  padding: 0;
  width: 100%;
`;

const CompanyItem = styled.li`
  padding: 15px;
  margin-bottom: 10px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.5);
  }

  position: relative;
  z-index: 2;
`;

const ComputationAlert = styled(Alert)`
  margin-bottom: 20px;
  z-index: 2;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 15px;
`;

const SubTitle = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

const LoaderWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.7);
  z-index: 10;
`;
const DataContainer = styled.div`
  margin-top: 20px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  color: #333; /* Dark text color */
`;

const SectionTitle = styled.h1`
  font-size: 1.4rem;
  margin-bottom: 10px;
  color: #007bff; /* Primary color for titles */
`;

const SectionText = styled.p`
  font-size: 1.2rem;
  margin: 5px 0;
`;

const FinancialChangeList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const FinancialChangeItem = styled.li`
  padding: 10px;
  background-color: rgba(0, 123, 255, 0.1); /* Light blue background */
  border-radius: 5px;
  margin-bottom: 5px;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(0, 123, 255, 0.2); /* Darker blue on hover */
  }
`;
const metrics = [
  { key: 'StockPrice', label: 'Stock Price', color: '#8884d8' },
  { key: 'Revenue', label: 'Revenue', color: '#82ca9d' },
  { key: 'Expense', label: 'Expense', color: '#ffc658' },
  { key: 'MarketShare', label: 'Market Share', color: '#ff7300' },
];

const dummySearchHistory = {
  ID: 1,
  UserID: 1,
  CompanyID: 1,
  Company: {
    ID: 1,
    Name: "Zoozo",
    Country: "USA",
    CountryCode: "US",
    MarketCap: 5000000.0,
    Diversity: 0.75,
    Financials: [
      {
        Year: 2022,
        StockPrice: 150.0,
        Expense: 50000.0,
        Revenue: 200000.0,
        MarketShare: 25.5,
      },
      {
        Year: 2023,
        StockPrice: 170.0,
        Expense: 55000.0,
        Revenue: 220000.0,
        MarketShare: 30.0,
      },
    ],
  },
  StoredResult: {
    same_country_count: 15,
    greater_diversity_count: 10,
    financial_changes: [
      {
        year: 2023,
        stock_price_change: 13.3,
        expense_change: 10.0,
        revenue_change: 10.0,
        market_share_change: 4.5,
      },
    ],
    greater_metrics_domestic: 14,
    greater_metrics_global: 24,
    analysis: {
      cagr: 2,
      volatility: 4
    },
  },
  Timestamp: "2023-09-27T10:00:00Z",
};


interface FinancialChange {
  year: number;
  stock_price_change: number;
  expense_change: number;
  revenue_change: number;
  market_share_change: number;
}

interface StoredResult {
  same_country_count: number;
  greater_diversity_count: number;
  financial_changes: FinancialChange[];
  greater_metrics_domestic: Record<string, number>;
  greater_metrics_global: Record<string, number>;
  analysis: Record<string, string>;
}

interface Company {
  ID: number;
  Name: string;
  Country: string;
  CountryCode: string;
  MarketCap: number;
  Diversity: number;
}

interface SearchHistory {
  ID: number;
  UserID: number;
  CompanyID: number;
  Company: Company;
  StoredResult: StoredResult;
  Timestamp: string;
}

const Company = () => {

  const params = useParams<{ company: string }>()
  const companyID = params.company
  console.log(companyID)

  const [companyData, setCompanyData] = useState(dummySearchHistory);
  const [result, setResult] = useState()
  const [isLoading, setIsLoading] = useState(false);
  const [financialData, setFinancialData] = useState([1, 2]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`http://localhost:6969/api/user/search-histories/${companyID}`)
      setCompanyData(res.data)

      setIsLoading(false);
    } catch (err) {
      console.log(err)
    }
  }


  // useEffect(()=>{
  //   fetchData()
  // },[])

  return (
    
    <CompanyContainer>
      <div className='text-2xl mb-3 font-bold'>
        Company details
      </div>
      {
        isLoading && (
          <LoaderWrapper>
            <Loader />
          </LoaderWrapper>
        )
      }
      <Card>
        <CardHeader>
          <div className='text-cyan-700 text-4xl'>{companyData.Company.Name}</div>
        </CardHeader>
        <CardContent>

          {/* {financialData.length > 0 && metrics.map((metric) => (
            <div key={metric.key} style={{ marginBottom: '40px', width: '100%' }}>
              <SubTitle>{metric.label}</SubTitle>
              <ResponsiveContainer width="100%" height={300} >
                <LineChart data={financialData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }} style={{ backgroundColor: 'white' }} >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="Year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey={metric.key} stroke={metric.color} name={metric.label} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ))} */}

          {companyData && (
            <DataContainer>
              <SectionTitle>Companies in Same Country</SectionTitle>
              <SectionText><strong>Count:</strong> {companyData.StoredResult.same_country_count}</SectionText>
              <SectionTitle>Companies with Greater Diversity</SectionTitle>
              <SectionText><strong>Count:</strong> {companyData.StoredResult.greater_diversity_count}</SectionText>
              <SectionTitle>Financial Changes</SectionTitle>
              <FinancialChangeList>
                {companyData.StoredResult.financial_changes.map((change, index) => (
                  <FinancialChangeItem key={index} className='flex flex-col'>
                    <div>
                    <span className='font-bold'>Year</span>: {change.year}, 
                    <span className='font-bold'>  Stock Price Change</span>: {change.stock_price_change.toFixed(2)}%,
                    <span className='font-bold'>  Expense Change</span>: {change.expense_change.toFixed(2)}%,
                    </div>
                    <div>
                    <span className='font-bold'>  Revenue Change</span>: {change.revenue_change.toFixed(2)}%,
                    <span className='font-bold'>  Market Share Change</span>: {change.market_share_change.toFixed(2)}%
                    </div>
                  </FinancialChangeItem>
                ))}
              </FinancialChangeList>
              <SectionTitle>Domestic Metrics</SectionTitle>
              <FinancialChangeList>
                <FinancialChangeItem>
                  <span className='font-bold'>Count: </span> {companyData.StoredResult.greater_metrics_domestic}
                </FinancialChangeItem>
              </FinancialChangeList>
              <SectionTitle>Global Metrics</SectionTitle>
              <FinancialChangeList>
                <FinancialChangeItem>
                  <span className='font-bold'>Count: </span> {companyData.StoredResult.greater_metrics_global}
                </FinancialChangeItem>
              </FinancialChangeList>
              <SectionTitle>Analytics</SectionTitle>
              <FinancialChangeList>
                <FinancialChangeItem className=''>
                  <span className='font-bold'>CAGR: </span> {companyData.StoredResult.analysis.cagr}
                  <span className='font-bold'>, Volatility: </span> {companyData.StoredResult.analysis.volatility}

                </FinancialChangeItem>
              </FinancialChangeList>
              
            </DataContainer>
          )}
        </CardContent>
      </Card>
    </CompanyContainer>
  );
};

export default Company;
