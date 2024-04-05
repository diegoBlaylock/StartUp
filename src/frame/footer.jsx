import React from 'react'
import './footer.css'


export function Footer(){
    return (
        <footer>
            <div id="author">Author: Diego Blaylock</div>
            <div id="github_div">
                <a href="https://github.com/diegoBlaylock/startup/" target="_blank" rel="noopener">
                    <img src="resources/logos/github-mark.png" alt="github" />
                    GitHub
                </a>
            </div>
            <div id="linkedin_div">
                <a href="https://www.linkedin.com/in/diego-blaylock/" target="_blank" rel="noopener">
                    <img src="resources/logos/LI-In-Bug.png" alt="linkedin" />
                    LinkedIn
                </a>
            </div>
        </footer>
    );
}