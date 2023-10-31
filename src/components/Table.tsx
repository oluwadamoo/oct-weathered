import { FaSearch } from "react-icons/fa";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { kelvinToCelsius, sortData } from "../utils/filters";

interface ITemp {
    city: string;
    country: string;
    temperature: number;
}


interface TableProps {
    data: ITemp[];
    onRemove: (city: string) => void;
    onSearch: (city: string) => void;
    searching: boolean;
}
function Table({ data, onRemove, onSearch, searching }: TableProps) {
    const navigate = useNavigate()
    const [tableData, setTableData] = useState<ITemp[]>([])

    useEffect(() => {
        setTableData(sortData(data, 'city'))
    }, [data])


    const openDetails = (city: string) => {
        navigate(`/details/${city}`)
    }
    return (
        <div className="table-wrapper">
            <div className="table-input-wrapper">

                <div className='table-input'>

                    <input placeholder='search for cities'
                        onChange={(e) => onSearch(e.target.value)}
                    />
                    {searching ? <div
                        className="loader" /> : <FaSearch className="" />

                    }
                </div>
            </div>


            <div className="table-container">

                {tableData.length ? <table>
                    <thead>
                        <tr>
                            <th>
                                S\N
                            </th>
                            <th>
                                City
                            </th>
                            <th>
                                Country
                            </th>
                            <th>
                                Temperature
                            </th>
                            <th>
                                <span className='sr-only'>Edit</span>
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {tableData.map((temp, index) => (
                            <tr


                                key={index} className={index === tableData.length - 1 ? 'border-none' : ''}>
                                <td onClick={() => openDetails(temp.city)}>
                                    {index + 1}
                                </td>
                                <td onClick={() => openDetails(temp.city)}>
                                    {temp.city}
                                </td>
                                <td onClick={() => openDetails(temp.city)}>
                                    {temp.country}
                                </td>
                                <td onClick={() => openDetails(temp.city)}>
                                    {kelvinToCelsius(temp.temperature)} °C
                                </td>
                                <td className="rm">
                                    <Button onClick={() => onRemove(temp.city)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table> :

                    <div className="no-table-data">
                        No Data Available
                    </div>}
            </div>
        </div>
    )
}

export default Table