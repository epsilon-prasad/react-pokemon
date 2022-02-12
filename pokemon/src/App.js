import { useState, useEffect } from "react";
import "./App.css";

const App = () => {
    const [dataList, setDataList] = useState([]);
    const [pagination, setPagination] = useState({
        limit: 30,
        offset: 0,
        next: null,
        prev: null,
    });
    useEffect(() => {
        setDataList([]);
        fetchDataList(pagination.limit, pagination.offset);
    }, [pagination.limit]);

    const fetchDataList = async (urlData) => {
        let findResults;
        try {
            let URL;
            if (urlData.length) {
                URL = urlData;
            } else {
                URL = `https://pokeapi.co/api/v2/pokemon?limit=${pagination.limit}&offset=${pagination.offset}`;
            }

            let response = await fetch(URL);
            if (!response.ok) {
                throw new Error("Something went wrong!");
            }
            const data = await response.json();
            setPagination((prevState) => ({
                ...prevState,
                next: data.next,
                prev: data.previous,
            }));

            const responses = await Promise.all(
                data.results.map((item) => {
                    return fetch(item.url);
                })
            );

            const filteredResponses = responses.filter(
                (res) => res.status === 200
            );

            findResults = Promise.all(
                filteredResponses.map(async (item) => {
                    const details = await item.json();
                    return details;
                })
            );
        } catch (err) {
            console.log(err, "err");
        }

        findResults.then((res) => {
            setDataList(res);
        });
    };

    const Item = (itemData) => {
        const { data } = itemData;
        return (
            <div className="cards">
                <div className="cardItem">
                    <img
                        src={
                            data["sprites"]["other"]["official-artwork"][
                                "front_default"
                            ]
                        }
                    />
                    <div className="cardContent">
                        <h3>{data?.name}</h3>
                    </div>
                    <ul className="list-group">
                        <li className="list-group-item">
                            Height:{data.height}
                        </li>
                        <li className="list-group-item">
                            Weight:{data.weight}
                        </li>
                        <li className="list-group-item">
                            List of abilities:
                            {data.abilities.map((res, i) => {
                                let commas = i === 0 ? "" : ", ";
                                return commas + res.ability.name;
                            })}
                        </li>
                    </ul>
                    <div className="cardContent">
                        <a href="#" className="btn">
                            Button
                        </a>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="container">
                <div className="cardLayout">
                    {dataList?.map((item, i) => {
                        return <Item data={item} key={i} />;
                    })}
                </div>
            </div>
        </>
    );
};

export default App;
