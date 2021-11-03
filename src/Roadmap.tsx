import React from 'react';
import './Roadmap.css';

import Nav from "./partials/Nav";
import Footer from "./partials/Footer";


const Roadmap = () => {
    return (
        <div className="container roadmap-container">
            <h2 className="u-text-align_center">ROADMAP</h2>
            <ul id="roadmap">
                <li>
                    <span>Phase 1</span>
                    <span>Mint of 1,111 Boryoku Dragonz</span>
                </li>
                <li>
                    <span>Phase 2</span>
                    <span>Daily Airdrop of Utility Token for Breeding Game</span>
                </li>
                <li>
                    <span>Phase 3</span>
                    <span>Funds committed to LP</span>
                </li>
                <li>
                    <span>Phase 4</span>
                    <span>Auction of Legendary Dragons</span>
                </li>
                <li>
                    <span>Phase 5</span>
                    <span>Dragon Eggs &amp; Hatching Mechanics</span>
                </li>
                <li>
                    <span>Phase 6</span>
                    <span>Baby Dragons come to life</span>
                </li>
            </ul>
        </div>
    );
}

export default Roadmap;