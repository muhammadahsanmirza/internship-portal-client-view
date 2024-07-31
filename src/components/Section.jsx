// Section.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../interceptors/axiosInstance';
import { IoIosSearch } from 'react-icons/io';
import { RiCloseCircleLine } from 'react-icons/ri';
import { debounce } from 'lodash';

import Card from './Card';
import CardDetail from './CardDetail';
import Header from './Header';
import Loader from './Loader';

function Section() {
    const [activeDetail, setActiveDetail] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [data, setData] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [programId, setProgramId] = useState(0);
    const [querySearch, setQuerySearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [applied, setApplied] = useState(false); // moved to the bottom for readability

    useEffect(() => {
        axiosInstance
            .get(`/program/names`)
            .then((response) => {
                setPrograms(response.data.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const fetchOpportunities = useCallback(
        debounce(() => {
            setData([]);
            setActiveDetail(false);
            setSelectedCard(null);
            setLoading(true);
            axiosInstance
                .get(`/opportunities?query_search=${querySearch}&program_id=${programId}`)
                .then((response) => {
                    const opportunities = response.data.data || [];
                    console.log(opportunities);
                    setError(null);
                    setData(opportunities);

                    if (opportunities.length === 0) {
                        setSelectedCard(null);
                        setError(response.data.message || 'No Opportunity Found');
                    }
                })
                .catch((error) => {
                    setError(error.message);
                    console.error(error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }, 500),
        [querySearch, programId]
    );

    useEffect(() => {
        fetchOpportunities();
        return () => {
            fetchOpportunities.cancel();
        };
    }, [fetchOpportunities, applied]);

    function handleProgramChange(e) {
        setProgramId(e.target.value);
    }

    function detailClickHandler(card) {
        setActiveDetail(true);
        setSelectedCard(card);
    }

    function closeDetailHandler() {
        setActiveDetail(false);
        setSelectedCard(null);
    }

    function handleSearch(e) {
        setQuerySearch(e.target.value);
    }

    function clearFilters() {
        setLoading(true);
        setError(null);

        setQuerySearch('');
        setProgramId(0);

        setLoading(false);
    }

    const breadcrumbs = [
        { title: 'Opportunities', href: '#', isDisabled: true },
    ];

    return (

        <div className="sm:w-[calc(100%-5rem)] sm:ml-20">
            <Header breadcrumbs={breadcrumbs} />
            <div className="my-3 mx-4 sm:mx-3 sm:mt-10">
                <div className="flex flex-col gap-4 my-3 sm:flex-row sm:flex-wrap sm:my-4 sm:mx-3 sm:mt-10">
                    <div
                        className="flex flex-row rounded border w-full px-1 sm:mx-1"
                    // style={{ width: '34rem' }}
                    >
                        <input
                            type="text"
                            value={querySearch}
                            onChange={handleSearch}
                            placeholder="Search by Opportunity title or Company name"
                            className="w-full text-sm p-2 outline-none"
                        />
                        <button className="flex items-center justify-center w-12">
                            <IoIosSearch className="text-lg" />
                        </button>
                    </div>
                    <div
                        className="flex flex-row rounded border w-full px-1"
                    // style={{ width: '34rem' }}
                    >
                        <select
                            className="w-full text-sm p-2 outline-none"
                            value={programId}
                            onChange={handleProgramChange}
                        >
                            <option value="">Select Program</option>
                            {programs?.map((program) => (
                                <option key={program.id} value={program.id}>
                                    {program.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-row rounded bg-blue-950 text-white px-2 py-1 text-sm items-center justify-center w-full sm:mx-1">
                        <RiCloseCircleLine />
                        <button
                            onClick={clearFilters}
                            className="mx-1 text-xs"
                            style={{ minWidth: '100px', padding: '5px 10px' }}
                        >
                            CLEAR FILTERS
                        </button>
                    </div>
                </div>
                {loading && <Loader />}
                {error && (
                    <p className="text-center mt-4 text-red-500 font-bold text-xl">
                        Error: {error}
                    </p>
                )}
                <div className="flex flex-row flex-wrap">
                    <div
                        className={`flex mb-4 ${activeDetail ? 'flex-col max-h-[calc(100vh-1rem)]' : 'flex-row flex-wrap'
                            } overflow-y-auto overflow-x-hidden`}
                        style={{ width: activeDetail ? '430px' : 'auto' }}
                    >
                        {data &&
                            data.map((card) => (
                                <Card
                                    key={card.id}
                                    company_name={card.company_name}
                                    name={card.name}
                                    program_name={card.program_name}
                                    start_date={card.start_date}
                                    end_date={card.end_date}
                                    detail={() => detailClickHandler(card)}
                                />
                            ))}
                    </div>
                    {activeDetail && selectedCard && (
                        <CardDetail
                            card={selectedCard}
                            setApplied={setApplied}
                            onClose={closeDetailHandler}
                        />
                    )}
                </div>
            </div>
        </div>

    );
}

export default Section;
