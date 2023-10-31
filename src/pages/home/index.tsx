/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Table from '../../components/Table'
import { FaCaretDown, FaCaretUp } from 'react-icons/fa'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { debounce } from '../../utils/utilities'
import { Modal } from '../../components/Modal'
import Loader from '../../components/Loader'

const INITCITIES = [
    'Tokyo',
    'Jakarta',
    'Delhi',
    'Guangzhou',
    'Mumbai',
    'Manila',
    'Shanghai',
    'Sao Paulo',
    'Seoul',
    'Mexico City',
    'New York',
    'Cairo',
    'Dhaka',
    'Beijing',
    'Kolkata'

]



interface IData {
    city: string;
    country: string;
    temperature: number;

}

function Home() {
    const navigate = useNavigate()

    const [showPopular, setShowPopular] = useState(true)
    const [showFav, setShowFav] = useState(false)
    const [temperatures, setTemperatures] = useState<IData[]>([])
    const [filteredTemps, setFilteredTemps] = useState<IData[]>([])
    const [favorites, setFavorites] = useState<IData[]>([])
    const [filteredFav, setFilteredFav] = useState<IData[]>([])
    const [userLoc, setUserLoc] = useState<any>()
    const [showModal, setShowModal] = useState(false)
    const [isSearchingFav, setIsSearchingFav] = useState(false)
    const [isSearchingCity, setIsSearchingCity] = useState(false)
    const [pageLoading, setPageLoading] = useState(true)

    const getTemp = async (query: string, abortController?: AbortController, loader?: boolean) => {
        if (abortController && loader) {
            setPageLoading(true)
        }
        try {

            const response = await axios.get(`weather?q=${query}`, {
                signal: abortController ? abortController.signal : undefined
            })

            setPageLoading(false)

            return response.data

        } catch (error) {
            console.log(error)
            // setPageLoading(false)
        }

    }

    const getInitTemperatures = async (abortController: AbortController) => {
        setPageLoading(true)


        for (const [index, city] of INITCITIES.entries()) {
            const temp = await getTemp(city, abortController, true)
            if (!temperatures.find((temperature) => temperature.city === temp.name)) {

                if (temp) {
                    setTemperatures((prev) => [...prev, {
                        city: temp.name,
                        country: temp.sys.country,
                        temperature: temp.main.temp
                    }])

                    setFilteredTemps((prev) => [...prev, {
                        city: temp.name,
                        country: temp.sys.country,
                        temperature: temp.main.temp
                    }])


                }

            }

            if (index === INITCITIES.length - 1) {
                await getLocation(abortController)

            }
        }

        setPageLoading(false)

    }

    const getFavorites = () => {
        const favorites = localStorage.getItem('@w-fav-locations')

        if (favorites) {
            setFavorites(JSON.parse(favorites))
            setFilteredFav(JSON.parse(favorites))
        }

    }



    const removeFavorite = (city: string) => {

        setFavorites((prev) => prev.filter(fav => fav.city !== city))

        localStorage.setItem('@w-fav-locations', JSON.stringify(favorites))
    }

    const removeCity = (city: string) => {
        setTemperatures((prev) => prev.filter(temp => temp.city !== city))
    }

    const getLocation = async (abortController: AbortController) => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const userLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };

                    try {

                        const temp = await axios.get(`weather?lat=${userLocation.latitude}&lon=${userLocation.longitude}`, {
                            signal: abortController ? abortController.signal : undefined
                        })

                        setUserLoc({
                            city: temp.data.name,
                            country: temp.data.sys.country,
                            temperature: temp.data.main.temp
                        })
                        setShowModal(true)

                    } catch (error) {
                        console.log(error)
                    }

                },
                (error) => {
                    console.error("Error getting user's location:", error);
                }
            );
        } else {
        }
    }


    const openUserLoc = () => {
        setShowModal(false)
        navigate(`/details/${userLoc.city}`)
    }

    useEffect(() => {
        const abortController = new AbortController()
        getFavorites()
        getInitTemperatures(abortController)

        return () => {
            abortController.abort()
        }
    }, [])

    const search = debounce(async (city: string) => {
        setIsSearchingCity(true)

        if (city) {
            const temp = await getTemp(city)

            if (temp) {
                setFilteredTemps([{
                    city: temp.name,
                    country: temp.sys.country,
                    temperature: temp.main.temp
                }])
            }
        } else {
            setFilteredTemps(temperatures)
        }
        setTimeout(() => {
            setIsSearchingCity(false)
        }, 500)
    }, 400)

    const searchFav = debounce(async (city: string) => {
        setIsSearchingFav(true)

        if (city) {
            setFilteredFav((prev) => prev.filter(fav => fav.city.toLowerCase().includes(city.toLowerCase())))
        } else {
            setFilteredFav(favorites)
        }
        setTimeout(() => {
            setIsSearchingFav(false)
        }, 500)
    }, 400)


    return (
        <div className="container">
            {
                pageLoading ? <Loader /> :

                    <>
                        {/* Favorites */}
                        <div className='temp-list temp-list-fav'>
                            <div onClick={() => setShowFav(!showFav)} className='show-temp'>
                                <h4>Favorite Cities</h4>
                                {showFav ? <FaCaretUp /> : <FaCaretDown />}
                            </div>
                            {showFav && <Table data={filteredFav} onRemove={removeFavorite} onSearch={searchFav} searching={isSearchingFav} />}
                        </div>

                        <hr />
                        {/* Popular Cities */}
                        <div className='temp-list'>
                            <div onClick={() => setShowPopular(!showPopular)} className='show-temp'>
                                <h4>Popular Cities</h4>
                                {showPopular ? <FaCaretUp /> : <FaCaretDown />}

                            </div>
                            {showPopular && <Table data={filteredTemps} onRemove={removeCity} onSearch={search} searching={isSearchingCity} />}

                        </div>

                    </>}
            {showModal &&
                <Modal text='' onAccept={openUserLoc} onReject={() => setShowModal(false)} />
            }
        </div>
    )
}

export default Home