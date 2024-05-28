import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoIosSearch } from "react-icons/io";
import { RxCrossCircled } from "react-icons/rx";
import Card from './Card';
import CardDetail from './CardDetail';

function Section() {
    const [activeDetail, setActiveDetail] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('http://159.89.7.6:8022/opportunities', {
            headers: {
                'Accept': 'application/json'
            }
        })
            .then(function (response) {
                setData(response.data.data); 
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    function detailClickHandler(card) {
        setActiveDetail(true);
        setSelectedCard(card);
    }

    function closeDetailHandler() {
        setActiveDetail(false);
        setSelectedCard(null);
    }

    return (
        <div className='w-[calc(100%-5rem)] ml-20 z-0'>
            <div className="flex flex-col border-b-2 border-gray-300 px-10 py-3" style={{ height: '4.1rem' }}>
                <h2 className="font-bold">College of Engineering Internship</h2>
                <p className='text-sm text-gray-400'>Opportunities</p>
            </div>
            <div className='flex flex-row my-4 mx-3'>
                <div className='flex flex-row rounded border mx-1' style={{ width: '34rem' }}>
                    <input
                        type="text"
                        placeholder='Search by Opportunity title or Company name'
                        className='w-full text-sm p-2 outline-none'
                    />
                    <button className='flex items-center justify-center w-12'>
                        <IoIosSearch className='text-lg' />
                    </button>
                </div>
                <div className='flex flex-row rounded border mx-1' style={{ width: '34rem' }}>
                    <select className='w-full text-sm p-2 outline-none'>
                        <option>ABC</option>
                        <option>XYZ</option>
                        <option>IJK</option>
                        <option>LMN</option>
                    </select>
                </div>
                <div className='flex flex-row rounded bg-blue-950 text-white px-2 py-1 text-sm items-center justify-center mx-1'>
                    <RxCrossCircled />
                    <button className='mx-1 text-xs' style={{ minWidth: '100px', padding: '5px 10px' }}>
                        CLEAR FILTERS
                    </button>
                </div>
            </div>
            <div className='flex flex-row '>
                <div className={`flex mt-6 mb-4 ${activeDetail ? 'flex-col max-h-[calc(100vh-1rem)]' : 'flex-row flex-wrap'} overflow-y-auto overflow-x-hidden`}
                    style={{ width: activeDetail ? '430px' : 'auto' }}>
                    {data.map((card) => (
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
                    <CardDetail card={selectedCard} onClose={closeDetailHandler} />
                )}
            </div>
        </div>
    );
}

export default Section;
