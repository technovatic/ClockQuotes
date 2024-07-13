// src/components/AnalogClock.js
import React, { useEffect, useRef, useState } from 'react';
import { subMinutes, subSeconds } from 'date-fns';
import { FaHorse, FaShareAlt, FaSignOutAlt } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AnalogClock = ({ onLogout, userName }) => {
  const navigate = useNavigate();
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");

  const handleLogout = () => {
    if (typeof onLogout === 'function') {
      onLogout();
      navigate('/login');
    }
  };

  const getCurrentISTTime = () => {
    const istOffset = 2 * 60 * 60 * 1000;
    return new Date(new Date().getTime() + istOffset);
  };

  const endTime = subMinutes(getCurrentISTTime(), 120);
  const [currentTime, setCurrentTime] = useState(endTime);
  const [speed, setSpeed] = useState(1);
  const clockRef = useRef(null);

  const getSpeedFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('speed') ? parseInt(params.get('speed'), 10) : 1;
  };

  useEffect(() => {
    setSpeed(getSpeedFromURL());
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime((prevTime) => subSeconds(prevTime, 1));
    }, 1000 / speed);

    return () => clearInterval(intervalId);
  }, [speed]);

  useEffect(() => {
    const clockElement = clockRef.current;
    const radius = clockElement.offsetWidth / 2;
    const ctx = clockElement.getContext('2d');

    const drawClock = () => {
      ctx.clearRect(0, 0, clockElement.width, clockElement.height);

      ctx.font = '16px Arial';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';

      for (let num = 1; num <= 12; num++) {
        const angle = ((num - 3) * (2 * Math.PI)) / 12;
        ctx.fillStyle = 'black';

        ctx.fillText(
          num.toString(),
          radius + Math.cos(angle) * (radius - 50),
          radius + Math.sin(angle) * (radius - 50)
        );
      }

      for (let i = 0; i < 60; i++) {
        const angle = (i * (2 * Math.PI)) / 60;
        const length = i % 5 === 0 ? 10 : 5;

        ctx.beginPath();
        ctx.moveTo(
          radius + Math.cos(angle) * (radius - 15),
          radius + Math.sin(angle) * (radius - 15)
        );
        ctx.lineTo(
          radius + Math.cos(angle) * (radius - 15 - length),
          radius + Math.sin(angle) * (radius - 15 - length)
        );
        ctx.stroke();
      }

      const hours = currentTime.getHours() % 12;
      const minutes = currentTime.getMinutes();
      const seconds = currentTime.getSeconds();

      let hourAngle = ((hours + minutes / 60) * (2 * Math.PI)) / 12 - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(radius, radius);
      ctx.lineTo(
        radius + Math.cos(hourAngle) * (radius - 80),
        radius + Math.sin(hourAngle) * (radius - 80)
      );
      ctx.lineWidth = 6;
      ctx.stroke();

      let minuteAngle = (minutes * (2 * Math.PI)) / 60 - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(radius, radius);
      ctx.lineTo(
        radius + Math.cos(minuteAngle) * (radius - 50),
        radius + Math.sin(minuteAngle) * (radius - 50)
      );
      ctx.lineWidth = 4;
      ctx.stroke();

      let secondAngle = (seconds * (2 * Math.PI)) / 60 - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(radius, radius);
      ctx.lineTo(
        radius + Math.cos(secondAngle) * (radius - 30),
        radius + Math.sin(secondAngle) * (radius - 30)
      );
      ctx.strokeStyle = '#FF0000';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(radius, radius, 5, 0, 2 * Math.PI);
      ctx.fillStyle = '#000';
      ctx.fill();
    };

    drawClock();
  }, [currentTime]);

  const generateShareURL = () => {
    const baseURL = window.location.origin + window.location.pathname;
    const url = `${baseURL}?speed=${speed}`;
    navigator.clipboard.writeText(url);
    alert(`URL copied to clipboard: ${url}`);
  };

  const fetchRandomQuote = async () => {
    try {
      const response = await axios.get('https://api.quotable.io/random');
      setQuote(response.data.content);
      setAuthor(response.data.author);
    } catch (error) {
      console.error("Error fetching quote:", error);
    }
  };

  useEffect(() => {
    fetchRandomQuote();
    const intervalId = setInterval(fetchRandomQuote, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100 p-4">
      <div className="absolute top-4 right-4">
        <button onClick={handleLogout} className="flex items-center text-white bg-red-600 p-2 rounded hover:bg-red-700">
          <FaSignOutAlt className="mr-2" />
          Logout
        </button>
      </div>
      <div className="text-2xl font-semibold mb-4">
        Hello, {userName}
      </div>
      <canvas ref={clockRef} width="400" height="400" className="border-2 border-gray-700 rounded-full"></canvas>
      <div className="mt-4 text-center w-full max-w-md">
        <div className="relative w-64 mx-auto mb-4">
          <FaHorse className="absolute left-0 top-0 transform -translate-y-1/2" style={{ left: `${(speed - 1) * 10}%` }} />
          <input
            type="range"
            min="1"
            max="10"
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value, 10))}
            className="w-full appearance-none bg-blue-500 h-2 rounded-full cursor-pointer"
          />
        </div>
        <div className="flex justify-center">
          <button
            onClick={generateShareURL}
            className="flex items-center text-white bg-blue-600 p-2 rounded hover:bg-blue-700"
          >
            <FaShareAlt className="mr-2" />
            Share URL
          </button>
        </div>
        <div className="mt-4 text-center">
          <blockquote className="italic text-gray-700">
            "{quote}"
          </blockquote>
          <p className="text-gray-500">- {author}</p>
        </div>
      </div>
    </div>
  );
};

AnalogClock.propTypes = {
  onLogout: PropTypes.func,
  userName: PropTypes.string.isRequired,
};

export default AnalogClock;
