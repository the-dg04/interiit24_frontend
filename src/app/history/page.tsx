"use client"
import React, { useState, useEffect, useSyncExternalStore } from 'react';
import axios from 'axios';
import HistoryCard from "../components/ui/HistoryCard.jsx"
import data from "./data.jsx"
import { IoMdHome } from "react-icons/io";
import Link from 'next/link.js';

const page = () => {
    const [companies, setCompanies] = useState([])
    const [isLoading, setIsLoading] = useState(false)


    return (
        <>
            <div className='mb-[50px] mx-6 mt-4 flex justify-between'>
                <span className='font-bold text-2xl md:text-4xl text-cyan-500'>
                    Search History Data
                </span>
                <Link href="/">
                    <span className='text-2xl text-cyan-100'><IoMdHome/></span>
                </Link>

            </div>

            <div style={styles.container} className='mx-12'>

                <div style={styles.cardContainer}>
                    {data.map((company, index) => (
                        <HistoryCard key={index} company={company} />
                    ))}
                </div>
            </div>


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