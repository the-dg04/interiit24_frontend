'use client';
import React, { useState } from 'react';
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
import { Card, CardHeader, CardContent } from '../components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import Button from '../components/ui/button.tsx';
import Input from '../components/ui/input.tsx';
import styled from 'styled-components';
import Loader from '../components/ui/Loader.jsx';
import ToggleSection from '../components/ui/toggle.jsx';

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

const SubTitle = styled.h3`
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

const SectionTitle = styled.h3`
  font-size: 1.8rem;
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

const Company = () => {
  const [companyName, setCompanyName] = useState('');
  const [matchingCompanies, setMatchingCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [computationMetrics, setComputationMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [financialData, setFinancialData] = useState([]);

  const fetchMatchingCompanies = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_COMPUTE_BACKEND_URL}/api/company/search/?name=${companyName}`);
      setMatchingCompanies(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching matching companies:', error);
      setIsLoading(false);
    }
  };

  const selectCompany = (company) => {
    setSelectedCompany(company);
    computeCompanyData(company.ID);
  };

  const computeCompanyData = async (companyId) => {
    try {
      setIsLoading(true);
      const startTime = Date.now();
      const response = await axios.get(`${process.env.NEXT_PUBLIC_COMPUTE_BACKEND_URL}/api/company/compute/${companyId}`);
      const computationTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 2000 - computationTime);
      await new Promise((resolve) => setTimeout(resolve, remainingTime));
      setCompanyData(response.data);
      console.log(companyData)
      setComputationMetrics({
        totalTime: computationTime < 2000 ? 2000 : computationTime,
        actualComputationTime: computationTime,
      });
      setIsLoading(false);
      const financialResponse = await axios.get(`${process.env.NEXT_PUBLIC_COMPUTE_BACKEND_URL}/api/company/${companyId}/financials`);
      setFinancialData(financialResponse.data);
    } catch (error) {
      console.error('Error computing company data:', error);
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMatchingCompanies();
  };

  return (
    <CompanyContainer>
      {isLoading && (
        <LoaderWrapper>
          <Loader />
        </LoaderWrapper>
      )}
      <SearchForm onSubmit={handleSearch}>
        <StyledInput
          label="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Enter company name"
        />
        <SearchButton type="submit">Search</SearchButton>
      </SearchForm>
      {matchingCompanies?.length > 0 && (
        <div>
            <Title>Select a Company</Title>
            <CompanyList>
              {matchingCompanies.map((company) => (
                <CompanyItem key={company.ID} onClick={() => selectCompany(company)}>
                  {company.Name}
                </CompanyItem>
              ))}
            </CompanyList>
          </div>
        )}
        {selectedCompany && (
          <Card>
            <CardHeader>
              <h2>{selectedCompany.Name}</h2>
            </CardHeader>
            <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
    {computationMetrics && (
      <ComputationAlert>
        <AlertTitle>Computation Time</AlertTitle>
        <AlertDescription>
          Total Time: {computationMetrics.totalTime} ms, Actual Computation Time: {computationMetrics.actualComputationTime} ms
        </AlertDescription>
      </ComputationAlert>
    )}
    {financialData.length > 0 && metrics.map((metric) => (
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
    ))}
    
    {companyData && (
        <DataContainer>
          <SectionTitle>Companies in Same Country</SectionTitle>
          <SectionText><strong>Count:</strong> {companyData.same_country_count}</SectionText>
          <SectionTitle>Companies with Greater Diversity</SectionTitle>
          <SectionText><strong>Count:</strong> {companyData.greater_diversity_count}</SectionText>
          <SectionTitle>Financial Changes</SectionTitle>
          <FinancialChangeList>
            {companyData.financial_changes.map((change, index) => (
              <FinancialChangeItem key={index}>
                Year: {change.year}, 
                Stock Price Change: {change.stock_price_change.toFixed(2)}%, 
                Expense Change: {change.expense_change.toFixed(2)}%
              </FinancialChangeItem>
            ))}
          </FinancialChangeList>
        </DataContainer>
      )}
        </CardContent>
        </Card>
      )}
    </CompanyContainer>
  );
};

export default Company;
