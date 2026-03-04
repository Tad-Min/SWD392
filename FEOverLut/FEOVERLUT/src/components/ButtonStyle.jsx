import React from 'react';
import styled from 'styled-components';

const Button = () => {
    return (
        <StyledWrapper>
            <div>
                <button className="c-button c-button--gooey">
                    Hover me
                    <div className="c-button__blobs">
                        <div />
                        <div />
                        <div />
                    </div>
                </button>
                <svg style={{ display: 'block', height: 0, width: 0 }} version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <filter id="goo">
                            <feGaussianBlur result="blur" stdDeviation={10} in="SourceGraphic" />
                            <feColorMatrix result="goo" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" mode="matrix" in="blur" />
                            <feBlend in2="goo" in="SourceGraphic" />
                        </filter>
                    </defs>
                </svg>
            </div>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
  .c-button {
    font-weight: 700;
    font-size: 16px;
    text-decoration: none;
    padding: 0.9em 1.6em;
    cursor: pointer;
    display: inline-block;
    vertical-align: middle;
    position: relative;
    z-index: 1;
  }

  .c-button--gooey {
    color: #06c8d9;
    background-color: transparent;
    text-transform: uppercase;
    letter-spacing: 2px;
    border: 4px solid #06c8d9;
    position: relative;
    transition: all 700ms ease;
    border-radius: 999px;
  }

  .c-button--gooey .c-button__blobs {
    height: 100%;
    filter: url(#goo);
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    bottom: -3px;
    right: -1px;
    z-index: -1;
    border-radius: 20px;
  }

  .c-button--gooey .c-button__blobs div {
    background-color: #06c8d9;
    width: 34%;
    height: 100%;
    border-radius: 100%;
    position: absolute;
    transform: scale(1.4) translateY(125%) translateZ(0);
    transition: all 700ms ease;
  }

  .c-button--gooey .c-button__blobs div:nth-child(1) {
    left: -5%;
  }

  .c-button--gooey .c-button__blobs div:nth-child(2) {
    left: 30%;
    transition-delay: 60ms;
  }

  .c-button--gooey .c-button__blobs div:nth-child(3) {
    left: 66%;
    transition-delay: 25ms;
  }

  .c-button--gooey:hover {
    color: #fff;
  }

  .c-button--gooey:hover .c-button__blobs div {
    transform: scale(1.4) translateY(0) translateZ(0);
  }`;

export default Button;
