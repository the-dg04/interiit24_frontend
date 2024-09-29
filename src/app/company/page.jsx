'use client';
import React, { useState } from 'react';
import AuthBackgroundWrapper from "../components/ui/AuthBackgroundWrapper.jsx";
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
import { useCookies } from 'next-client-cookies';

const CompanyContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-size: cover;
  position: relative;
  color: white;
  height: 100vh;
  overflow-y: auto;
`;

const SearchForm = styled.form`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
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
  margin-bottom: 20px;
`;

const CompanyItem = styled.li`
  padding: 10px;
  margin-bottom: 5px;
  background-color: ${(props) => (props.selected ? 'rgba(255, 255, 0, 0.5)' : 'rgba(255, 255, 255, 0.2)')}; // Change background color when selected
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-weight: ${(props) => (props.selected ? 'bold' : 'normal')}; // Apply bold style if selected

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
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

const SubTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 5px;
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
  background-color: rgba(255, 255, 255, 0.8);
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  color: #333;
  height: 100%;
  overflow-y: auto;
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 5px;
  color: #007bff;
`;

const SectionText = styled.p`
  font-size: 1rem;
  margin: 3px 0;
`;

const FinancialChangeList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const FinancialChangeItem = styled.li`
  padding: 5px;
  background-color: rgba(0, 123, 255, 0.1);
  border-radius: 5px;
  margin-bottom: 3px;
  transition: background-color 0.3s;
  font-size: 0.9rem;

  &:hover {
    background-color: rgba(0, 123, 255, 0.2);
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: calc(100vh - 200px);
  overflow: hidden;
`;

const GraphsSection = styled.div`
  flex: 1;
  margin-right: 10px;
  overflow-y: auto;
  padding-right: 10px;
`;

const InfoSection = styled.div`
  flex: 1;
  margin-left: 10px;
  overflow-y: auto;
  padding-left: 10px;
  border-left: 1px solid rgba(255, 255, 255, 0.3);
`;

const ChartContainer = styled.div`
  margin-bottom: 20px;
  background-color: white;
  padding: 10px;
  border-radius: 5px;
`;

const AnalysisContainer = styled.div`
  margin-top: 20px;
  padding: 15px;
  background-color: #e8f5e9;
  border-left: 5px solid #4caf50;
`;

const AnalysisTitle = styled.h5`
  font-size: 1.1rem;
  font-weight: bold;
  color: #2e7d32;
`;

const GrowthComment = styled.p`
  font-size: 0.95rem;
  color: #444;
  margin-top: 10px;
`;


const classifyCompany = (cagr, volatility) => {
  if (cagr < 0) return "Declining";
  if (volatility >= 20) return "High Volatility";
  if (cagr > 10) return "High Growth";
  if (cagr > 5) return "Moderate Growth";
  return "Stable";
};


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
  const [classification, setClassification] = useState('');
  const cookies = useCookies();

  const fetchMatchingCompanies = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:6969/api/company/search/?name=${companyName}`);
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
      const response = await axios.get(`http://localhost:6969/api/company/compute/${companyId}`, {
        headers: {
          "Authorization": `Bearer ${cookies.get("token")}`
        }
      });
      const computationTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 2000 - computationTime);
      await new Promise((resolve) => setTimeout(resolve, remainingTime));
      setCompanyData(response.data);
      setClassification(classifyCompany(response.data.analysis.cagr, response.data.analysis.volatility));
      setComputationMetrics({
        totalTime: computationTime < 2000 ? 2000 : computationTime,
        actualComputationTime: computationTime,
      });
      setIsLoading(false);
      const financialResponse = await axios.get(`http://localhost:6969/api/company/${companyId}/financials`);
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
    <AuthBackgroundWrapper>
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
              <CompanyItem
                key={company.ID}
                onClick={() => selectCompany(company)}
                selected={selectedCompany?.ID === company.ID} // Pass selected prop
              >
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
            <CardContent>
              {computationMetrics && (
                <ComputationAlert>
                  <AlertTitle>Computation Time</AlertTitle>
                  <AlertDescription>
                    Total Time: {computationMetrics.totalTime} ms, Actual Computation Time: {computationMetrics.actualComputationTime} ms
                  </AlertDescription>
                </ComputationAlert>
              )}
              <ContentWrapper>
                <GraphsSection>
                  {financialData.length > 0 && metrics.map((metric) => (
                    <ChartContainer key={metric.key}>
                      <SubTitle>{metric.label}</SubTitle>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={financialData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="Year" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey={metric.key} stroke={metric.color} name={metric.label} />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  ))}
                </GraphsSection>
                <InfoSection>
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
                      <SectionTitle><strong>Greater Metric Domestic:</strong><SectionText>{companyData.greater_metrics_domestic}</SectionText></SectionTitle>
                      <SectionTitle><strong>Greater Metric Global:</strong><SectionText>{companyData.greater_metrics_global}</SectionText> </SectionTitle>
                      <AnalysisContainer>
                        <AnalysisTitle>Analysis</AnalysisTitle>
                        <SectionText><strong>CAGR:</strong> {companyData.analysis.cagr}</SectionText>
                        <SectionText><strong>Volatility:</strong> {companyData.analysis.volatility}</SectionText>
                        <GrowthComment>
                          Company Classification: <strong>{classification}</strong>
                        </GrowthComment>
                      </AnalysisContainer>
                    </DataContainer>
                  )}
                </InfoSection>
              </ContentWrapper>
            </CardContent>
          </Card>
        )}
      </CompanyContainer>
    </AuthBackgroundWrapper>
  );
};

export default Company;