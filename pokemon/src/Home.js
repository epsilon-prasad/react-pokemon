import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

const Home = () => {
    const [dataList, setDataList] = useState([]);
    const [pagination, setPagination] = useState({
        limit: 30,
        offset: 0,
        next: null,
        prev: null,
    });
    const [searchInput, setSearchInput] = useState("");
    const [sortList, setSortList] = useState("");
    const [filteredResults, setFilteredResults] = useState([]);
    const route = useNavigate();

    useEffect(() => {
        setDataList([]);
        fetchDataList();
    }, [pagination.limit]);

    const fetchDataList = async (urlData) => {
        let findResults;
        // console.log(urlData, "this is urlData");
        try {
            let URL;
            if (urlData?.length) {
                URL = urlData;
                console.log("its coming");
            } else {
                URL = `https://pokeapi.co/api/v2/pokemon?limit=${pagination.limit}&offset=${pagination.offset}`;
                console.log("second");
            }

            // console.log(URL, "this is the url creation");

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

    const limitChange = (event) => {
        setPagination((prevState) => ({
            ...prevState,
            limit: event.target.value,
        }));
    };

    const next = () => {
        fetchDataList(pagination.next);
    };

    const prev = () => {
        fetchDataList(pagination.prev);
    };

    const Search = (event) => {
        if (event) {
            setSearchInput(event.target.value);
            localStorage.setItem("filter", event.target.value);
        }
        if (searchInput !== "") {
            const filterData = dataList.filter((data) => {
                return data.name.includes(searchInput);
            });
            setFilteredResults(filterData);
        } else {
            setFilteredResults(dataList);
        }
    };

    const SortHandler = (e) => {
        let dataSort;
        if (e) {
            dataSort = e.target.value;
            setSortList(dataSort);
            localStorage.setItem("sort", dataSort);
        } else {
            dataSort = sortList;
        }
        const updateArray = [...dataList];
        let sortData2;

        if (dataSort === "name") {
            sortData2 = updateArray.sort((a, b) =>
                a[dataSort].localeCompare(b[dataSort])
            );
        } else {
            console.log(sortList, updateArray, "react hooks");
            sortData2 = updateArray.sort((a, b) => a[dataSort] - b[dataSort]);
        }

        setDataList(sortData2);
    };

    useEffect(() => {
        if (localStorage.getItem("filter")) {
            setSearchInput(localStorage.getItem("filter"));
            Search();
        }
    }, [searchInput, setFilteredResults, dataList]);

    useEffect(() => {
        setSortList("height");
        SortHandler();
    }, []);

    const PaginationHTML = (data) => {
        const { page } = data;
        return (
            <>
                <button onClick={prev} className="btn" disabled={!page.prev}>
                    Prev
                </button>
                <select onChange={limitChange} value={pagination.limit}>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                </select>
                <button onClick={next} className="btn" disabled={!page.next}>
                    Next
                </button>
            </>
        );
    };

    const Details = (args) => {
        route("/details", { state: { id: 1, data: args } });
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
                        <button
                            type="button"
                            className="btn"
                            onClick={() => Details(data)}
                        >
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="container">
            <div className="paginatonLayout">
                <PaginationHTML page={pagination} />
                <input
                    type="text"
                    placeholder="Search"
                    onChange={Search}
                    value={searchInput}
                />
                <select onChange={SortHandler} value={sortList}>
                    <option value="" disabled>
                        Select the sort
                    </option>
                    <option value="name">Name</option>
                    <option value="height">Height</option>
                    <option value="weight">Weight</option>
                </select>
            </div>
            <div className="cardLayout">
                {dataList.length >= 1 && searchInput.length > 1
                    ? filteredResults?.map((item, i) => {
                          return <Item data={item} key={i} />;
                      })
                    : dataList?.map((item, i) => {
                          return <Item data={item} key={i} />;
                      })}
            </div>
            <div className="paginatonLayout">
                <PaginationHTML page={pagination} />
            </div>
        </div>
    );
};

export default Home;
