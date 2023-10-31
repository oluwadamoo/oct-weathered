/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, { useEffect, useState } from 'react'

import { FaCaretDown, FaCaretUp, FaCloud, FaDirections, FaHeart, FaPen, FaSave, FaTachometerAlt, FaTemperatureLow, FaThermometerEmpty, FaTrash, FaWind } from 'react-icons/fa'
import { useParams } from 'react-router-dom'
import { formatDate, generateUUID, getCoordinateDirection, kelvinToCelsius } from '../../utils/filters';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import { Icons } from '../../utils/icons';


interface INotes {
    id: string;
    title: string;
    details: string;
    date: string;

}

// interface IWeather {
//     // current: {
//     //     cloudcover: number;
//     //     humidity: number;
//     //     observation_time: string;
//     //     feelslike: number;
//     //     pressure: number;
//     //     temperature: number;
//     //     uv_index: number;
//     //     weather_descriptions: string[];
//     //     weather_icons: string[];
//     //     wind_degree: number;
//     //     wind_dir: string;
//     //     wind_speed: 7;
//     // },
//     // location: {
//     //     name: string;
//     //     country: string
//     // }
//     app_temp: number;
//     aqi: number;
//     city_name: string;
//     clouds: number;
//     country_code: string;
//     dewpt: number;
//     dhi: number;
//     dni: number;
//     ghi: number;
//     gust: number;
//     h_angle: number;
//     precip: number;
//     rh: number;
//     slp: number;
//     temp: number;
//     ts: number;
//     uv: number;
//     vis: number;
//     weather: {
//         description: string;
//         code: number;
//         icon: string;

//     },
//     wind_cdir_full: string;
//     wind_dir: 200;
//     wind_spd: number
// }

interface IWeather {
    name: string;
    main: {
        temp: number;
        feels_like: number;
        humidity: number;
        pressure: number;
    },
    sys: {
        country: string;
    },
    weather: {
        main: string;
        description: string;
        icon: string;
    }[];
    wind: {
        speed: number;
        deg: number;
        gust: number
    }
}
function WeatherDetails() {
    const param: string = useParams().city!
    const [selectedNote, setSelectedNote] = useState<number | null>(null)
    const [editedNote, setEditedNote] = useState<number | null>(null);
    const [notes, setNotes] = useState<INotes[]>([])
    const [title, setTitle] = useState('')
    const [details, setDetails] = useState('')
    const [weatherDetails, setWeatherDetails] = useState<IWeather | undefined>()
    const [isFav, setIsFav] = useState(false)
    const [showForm, setShowForm] = useState(true)
    const [pageLoading, setPageLoading] = useState(true)


    const getNotes = () => {
        const localNotes = localStorage.getItem('@weather-notes')

        if (localNotes) {
            const myNotes = JSON.parse(localNotes)

            const notes = myNotes[param]
            if (notes) {
                setNotes(myNotes[param])

            }
        }
    }
    const addNote = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const allNotes = localStorage.getItem('@weather-notes')


        const note = {
            id: generateUUID(),
            title,
            details,
            date: formatDate(new Date())
        }
        let parsedNotes: any = {}
        if (allNotes) {
            parsedNotes = JSON.parse(allNotes)

            if (parsedNotes[param]) {
                if (editedNote) {
                    const updatedNotes = [...parsedNotes[param]];
                    updatedNotes[editedNote] = {
                        id: updatedNotes[editedNote].id,
                        title,
                        details,
                        date: formatDate(new Date())
                    };

                    parsedNotes[param] = updatedNotes
                }
                else {
                    parsedNotes[param] = [...parsedNotes[param], note]

                }
            } else {
                parsedNotes[param] = [note]
            }

        } else {
            parsedNotes[param] = [note]

        }


        if (editedNote !== null) {
            const updatedNotes = [...notes];
            updatedNotes[editedNote] = {
                id: updatedNotes[editedNote].id,
                title,
                details,
                date: formatDate(new Date())
            };


            setNotes(updatedNotes)
        } else {
            setNotes((prev) => [...prev, note])

        }
        localStorage.setItem('@weather-notes', JSON.stringify(parsedNotes))
        if (editedNote !== null) {
            toast.success("Note updated")

        } else {
            toast.success("Note added")

        }
        setEditedNote(null)
        setTitle('')
        setDetails('')


    }

    const removeNote = () => {
        const allNotes = localStorage.getItem('@weather-notes')

        if (allNotes) {
            const parsedNotes = JSON.parse(allNotes);

            if (parsedNotes[param]) {
                const remainingNotes = parsedNotes[param].filter((note: INotes) => note.id !== notes[selectedNote!].id)
                setNotes(remainingNotes)
                parsedNotes[param] = remainingNotes;
                localStorage.setItem('@weather-notes', JSON.stringify(parsedNotes))
                toast.success("Note removed")


            }

        }
    }


    const getTemp = async (abortController?: AbortController) => {
        setPageLoading(true)
        try {
            setPageLoading(true)
            const response = await axios.get(`weather?q=${param}`, {
                signal: abortController ? abortController.signal : undefined
            })

            const temp = response.data

            setWeatherDetails(temp)
            setIsFav(isFavorite())

            setPageLoading(false)

        } catch (error) {
            setPageLoading(false)
            console.log(error)
        }

    }


    const addToFavorite = () => {
        const favorites = localStorage.getItem('@w-fav-locations')
        const data = {
            city: weatherDetails?.name,
            country: weatherDetails?.sys.country,
            temperature: weatherDetails?.main.temp
        }


        if (favorites) {
            let locations = JSON.parse(favorites)

            if (isFav) {

                locations = locations.filter((location: any) => location.city !== data.city)
                setIsFav(false)
                toast.success("Removed from favorites")

            } else {
                locations.push(data)
                toast.success("Added to favorites")
                setIsFav(true)
            }

            localStorage.setItem('@w-fav-locations', JSON.stringify(locations))
        } else {
            setIsFav(true)
            toast.success("Added to favorites")

            localStorage.setItem('@w-fav-locations', JSON.stringify([data]))
        }


    }

    const isFavorite = () => {
        const favorites = localStorage.getItem('@w-fav-locations')
        if (favorites) {
            const locations = JSON.parse(favorites)

            if (locations.find((location: any) => location.city === weatherDetails?.name)) {
                return true
            } else {
                return false
            }

        }

        return false

    }


    useEffect(() => {
        const abortController = new AbortController()
        getNotes()
        getTemp(abortController)

        return () => {
            abortController.abort()
        }
    }, [])

    // @ts-ignore
    const icon = Icons[weatherDetails?.weather[0].icon]
    console.log(icon)
    return (
        <div className="container">
            {
                pageLoading ? <Loader /> :
                    <div className='wrapper'>
                        <section className='weather-details'>
                            <div className='weather-details-header'>
                                <div>
                                    <h3>{weatherDetails?.name} {"  "} (<FaCloud /> {' '}{weatherDetails?.weather[0].description})</h3>

                                    <h2>{kelvinToCelsius(weatherDetails?.main.temp)}°C</h2>
                                </div>


                                <img alt='weather-icon' src={icon} />
                            </div>

                            <div className={`fav ${isFav ? 'is-fav' : 'not-fav'}`} onClick={addToFavorite}>

                                <FaHeart />
                            </div>
                            <div className="air-conditions-wrapper">
                                <h4>AIR CONDITIONS</h4>
                                <div className="air-conditions">

                                    <div className='air-condition'>
                                        <div>
                                            <FaThermometerEmpty />
                                            Real Feel
                                        </div>

                                        <h5>{kelvinToCelsius(weatherDetails?.main.feels_like)} °C</h5>
                                    </div>
                                    <div className='air-condition'>

                                        <div>
                                            <FaWind />
                                            Wind
                                        </div>

                                        <h5>{weatherDetails?.wind.speed} km/hr</h5>
                                    </div>
                                    <div className='air-condition'>

                                        <div>
                                            <FaDirections />
                                            Wind Direction
                                        </div>

                                        <h5>{getCoordinateDirection(weatherDetails?.wind.deg)}</h5>
                                    </div>
                                    <div className='air-condition'>

                                        <div>
                                            <FaDirections />
                                            Wind Degree
                                        </div>

                                        <h5>{weatherDetails?.wind.deg}°</h5>
                                    </div>
                                    <div className='air-condition'>
                                        <div>
                                            <FaTemperatureLow />
                                            Humidity
                                        </div>

                                        <h5>{weatherDetails?.main.humidity}%</h5>
                                    </div>
                                    <div className='air-condition'>
                                        <div>
                                            <FaTachometerAlt />
                                            Pressure
                                        </div>

                                        <h5>{weatherDetails?.main.pressure}MB</h5>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className='note-list'>
                            <h4>Notes</h4>

                            <ul >
                                {
                                    notes.length ?
                                        notes?.map((note, index) =>
                                            <li
                                                key={index}
                                                onMouseOver={() => {
                                                    setSelectedNote(index)
                                                }}
                                                onMouseLeave={() => {
                                                    setSelectedNote(null)


                                                }}
                                                className={editedNote === index ? 'highlight' : ''}
                                            >
                                                <div className={`${selectedNote === index ? 'move' : ''} note `}>
                                                    <h6>{note.title}</h6>
                                                    <div
                                                        dangerouslySetInnerHTML={{ __html: note.details.replaceAll('\n', '<br/>') }}

                                                    /><time dateTime={note.date}>{note.date}</time>
                                                </div>
                                                <div className={`${selectedNote === index ? 'move' : ''} delete-cont`}>
                                                    <button className='btn edit'
                                                        onClick={() => {
                                                            if (editedNote && editedNote === index) {
                                                                setEditedNote(null)
                                                                setTitle('')
                                                                setDetails('')

                                                            } else {
                                                                setEditedNote(index)
                                                                setTitle(note.title)
                                                                setDetails(note.details)

                                                            }
                                                        }}

                                                    >
                                                        <FaPen />
                                                    </button>
                                                    <button className='btn delete'

                                                        onClick={removeNote}
                                                    >

                                                        <FaTrash />
                                                    </button>

                                                </div>
                                            </li>

                                        ) : <li className="no-table-data py-2">
                                            No Notes Added yet
                                        </li>

                                }

                            </ul>


                            <form onSubmit={addNote} className={showForm || editedNote ? 'show-form' : 'hide-form'}>
                                <div className='form-header'
                                    onClick={() => setShowForm(!showForm)}
                                >
                                    <h5>Add New Note</h5>

                                    {showForm ? <FaCaretUp /> : <FaCaretDown />}
                                </div>
                                <div className={`form-wrapper ${showForm || editedNote ? 'show-form' : 'hide-form'}`}>
                                    <div className="form-group">
                                        <input id="title" name="title" type="text" required
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}

                                        />
                                        <label htmlFor="title">Title</label>
                                    </div>
                                    <div className="form-group">
                                        <textarea name="details" id="details" required
                                            value={details}

                                            onChange={(e) => setDetails(e.target.value)}

                                        />
                                        <label htmlFor="details" className="text-area-label">Note</label>
                                    </div>

                                    <button className='btn'>
                                        {editedNote !== null ? 'Update' : 'Save'} <FaSave />
                                    </button>
                                </div>
                            </form>
                        </section>
                    </div>

            }
        </div>
    )
}

export default WeatherDetails