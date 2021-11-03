import React from 'react';

const Nav = () => {
    return (
        <nav>
            <div className="container">
                <div id="brand">
                <div><a href="/"><img src="../boryoku-dragons-logo.png" className="logo" alt="Boryoku Dragon" /></a></div>
                <ul id="social">
                    <li><a href="https://discord.gg/hxz74qWSRp" target="_blank" rel="noreferrer"><img src="../discord.svg" alt="Discord" /></a></li>
                    <li><a href="https://twitter.com/boryokudragonz" target="_blank" rel="noreferrer"><img src="../twitter.svg" alt="Twitter" /></a></li>
                </ul>
                </div>
            </div>
        </nav>
    );
}

export default Nav;