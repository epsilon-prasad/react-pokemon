import React from "react";
import { useLocation } from "react-router-dom";

const Details = () => {
    const location = useLocation();

    console.log(location);
    return (
        <>
            <div className="container">
                <div className="cardLayout">
                    <div className="cardItem details">
                        <p>Name: {location.state.data.name}</p>
                        <p>Species: {location.state.data.species.name}</p>
                        <p>Weight: {location.state.data.weight}</p>
                        <p>
                            Base Experience:{" "}
                            {location.state.data.base_experience}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Details;
