'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardContent } from '../components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';


const Company = () => {
  const [companyName, setCompanyName] = useState('');
  const [matchingCompanies, setMatchingCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchMatchingCompanies = async () => {
    try{
      setIsLoading(true);
      const response=await axios.get(`/api/company/?name=${companyName}`);
      setMatchingCompanies(response.data);
      setIsLoading(false);
    }
    catch (error) {
      console.error('Error fetching matching companies:', error);
      setIsLoading(false);
    }
  }
  const selectCompany=(company)=>{
    setSelectedCompany(company);
    computeCompanyData(company.id);
  }
  const computeCompanyData = async (companyId) => {
    try {
      setIsLoading(true);
      const startTime = Date.now();
      const response = await axios.get(`/company/compute/${companyId}`);
      const computationTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 120000 - computationTime);
      await new Promise(resolve => setTimeout(resolve, remainingTime));
      setCompanyData(response.data);
      setComputationMetrics({
        totalTime: (computationTime<120000?120000:computationTime), 
        actualComputationTime: computationTime
      });
      setIsLoading(false);
    }
    catch (error) {
      console.error('Error computing company data:', error);
      setIsLoading(false);
    }
  }
}