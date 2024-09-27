"use client"
import React, { useState, useEffect, useSyncExternalStore } from 'react';
import axios from 'axios';
import HistoryCard from "../components/ui/HistoryCard.jsx"
import Loader from '../components/ui/Loader.jsx';
import AuthBackgroundWrapper from '../components/ui/AuthBackgroundWrapper.jsx';
import data from "./data.jsx"
import { IoMdHome } from "react-icons/io";
import Link from 'next/link.js';
import styled from 'styled-components';

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

const page = () => {
    const [companies, setCompanies] = useState([])
    const [isLoading, setIsLoading] = useState(false)


    const fetchHistory = async () => {
        try {
            setIsLoading(true)
            const response = await axios.get(`http://localhost:6969/api/user/search-history`)
            setCompanies(response.data)
            setIsLoading(false)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchHistory();
      }, []);

    return (
        <>
            <AuthBackgroundWrapper>
                {isLoading && (
                    <LoaderWrapper>
                        <Loader />
                    </LoaderWrapper>
                )}
                <div className="relative bg-white/10 backdrop-blur-md border border-white/10 shadow-[0_0_40px_rgba(8,7,16,0.6)] rounded-lg p-10 w-full">
                    <div className='mb-[50px] mx-6 mt-4 flex justify-between'>
                        <span className='font-bold text-2xl md:text-4xl text-cyan-500'>
                            Search history data
                        </span>
                        <Link href="/">
                            <span className='text-2xl text-cyan-100'><IoMdHome /></span>
                        </Link>

                    </div>

                    <div style={styles.container} className='mx-12'>

                        <div className='flex flex-wrap justify-center'>
                            {data.map((company, index) => (
                                <HistoryCard key={index} company={company} />
                            ))}
                        </div>
                    </div>
                </div>
            </AuthBackgroundWrapper>
        </>
    )
}

const styles = {
    container: {
        // textAlign: "center",
        padding: "20px",
    },
    cardContainer: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
    },
};

export default page