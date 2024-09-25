"use client"
import React, { useState, useEffect, useSyncExternalStore } from 'react';
import axios from 'axios';
import HistoryCard from "../components/ui/HistoryCard.jsx"
import data from "./data.jsx"

const page = () => {
    const [companies, setCompanies] = useState([])
    const [isLoading, setIsLoading] = useState(false)


    return (
        <>
            <h1 className='mb-[50px] text-center'>Search History Data</h1>
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
        textAlign: "center",
        padding: "20px",
    },
    cardContainer: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
    },
};

export default page