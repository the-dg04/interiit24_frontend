import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle, AlertDialog, AlertDialogAction } from '@/components/ui/alert';

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

}