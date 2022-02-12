import logo from "./logo.svg";
import "./App.css";

const App = () => {
    return (
        <>
            <div className="container">
                <div className="cardLayout">
                    <div className="cards">
                        <div className="cardItem">
                            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/24.png" />
                            <div className="cardContent">
                                <h3>arbok</h3>
                            </div>
                            <ul className="list-group">
                                <li className="list-group-item">Height:35</li>
                                <li className="list-group-item">Weight:650</li>
                                <li className="list-group-item">
                                    List of abilities:intimidate, shed-skin,
                                    unnerve
                                </li>
                            </ul>
                            <div className="cardContent">
                                <button type="button" className="btn">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default App;
