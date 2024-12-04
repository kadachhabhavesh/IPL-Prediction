import React, { useState, useEffect } from 'react';
import { Pie, Chart } from 'react-chartjs-2';
import PieChart from './Chart';

const PredictionForm = () => {
  const [isModalOpen, setIsModalOpen] = useState();
  const [result, setResult] = useState(null)
  const [formData, setFormData] = useState({
    "balls_left": 0,
    "batting_team": "",
    "bowling_team": "",
    "city": "",
    "crr": null,
    "rrr": null,
    "runs_left": null,
    "target_runs": null,
    "wickets_left": null
  });

  const teams = ['Royal Challengers Bengaluru', 'Punjab Kings', 'Delhi Capitals',
    'Kolkata Knight Riders', 'Rajasthan Royals', 'Mumbai Indians',
    'Chennai Super Kings', 'Sunrisers Hyderabad', 'Gujarat Titans',
    'Lucknow Super Giants'];
  const cities = ['Bangalore', 'Chandigarh', 'Delhi', 'Mumbai', 'Kolkata', 'Jaipur',
    'Hyderabad', 'Chennai', 'Cape Town', 'Port Elizabeth', 'Durban',
    'Centurion', 'East London', 'Johannesburg', 'Kimberley',
    'Bloemfontein', 'Ahmedabad', 'Cuttack', 'Nagpur', 'Dharamsala',
    'Visakhapatnam', 'Pune', 'Raipur', 'Ranchi', 'Abu Dhabi',
    'Bengaluru', 'Indore', 'Dubai', 'Sharjah', 'Navi Mumbai',
    'Lucknow', 'Guwahati', 'Mohali'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: ['batting_team', 'bowling_team', 'city'].includes(name) ? value : Number(value)
    }));
  };

  useEffect(() => {
    const { target_runs, runs_left, balls_left } = formData;

    if (target_runs && runs_left && balls_left) {
      const totalBalls = 120; // Assuming T20 match
      const ballsPlayed = totalBalls - balls_left;
      const runsScored = target_runs - runs_left;
      const crr = (runsScored / ballsPlayed) * 6;
      const rrr = (runs_left / balls_left) * 6;

      setFormData(prevState => ({
        ...prevState,
        crr: crr.toFixed(2),
        rrr: rrr.toFixed(2)
      }));
    }
  }, [formData.target_runs, formData.runs_left, formData.balls_left]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation: Check if all required fields are filled
    const { batting_team, bowling_team, city, runs_left, balls_left, target_runs, wickets_left } = formData;
    if (!batting_team || !bowling_team || !city || runs_left === null || balls_left === null || target_runs === null || wickets_left === null) {
      alert("Please fill in all fields before submitting.");
      return; // Prevent submission
    }
    
    console.log(formData);
    
    fetch('https://dm-project-rab6.onrender.com/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setResult([
          { teamName: formData.batting_team, winPro: data.result.toFixed(2) },
          { teamName: formData.bowling_team, winPro: (100 - data.result).toFixed(2) },
        ])
        setIsModalOpen(true)
      })
      .catch(error => console.error('Error:', error));
  };

  return (
    <div className='w-full h-screen bg-teal-900 flex flex-col items-center justify-center'>
      <h1 className='text-white text-3xl font-bold'>IPL Match Win Prediction</h1>
      <form onSubmit={handleSubmit} className="w-2/3 mx-auto mt-8 p-3 bg-white rounded shadow-md flex flex-wrap justify-center">
        <div className="part1 w-full md:w-1/2 p-2">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="batting_team">
              Batting Team
            </label>
            <select
              id="batting_team"
              name="batting_team"
              value={formData.batting_team}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select Batting Team</option>
              {teams.map(team => (
                 formData.bowling_team != team && <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bowling_team">
              Bowling Team
            </label>
            <select
              id="bowling_team"
              name="bowling_team"
              value={formData.bowling_team}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select Bowling Team</option>
              {teams.map(team => (
                formData.batting_team != team &&<option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
              City
            </label>
            <select
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select City</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {['runs_left', 'balls_left'].map(field => (
            <div key={field} className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={field}>
                {field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </label>
              <input
                type="text"
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                readOnly={field === 'crr' || field === 'rrr'}
              />
            </div>
          ))}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
          </div>
        </div>
        <div className="part2 w-full md:w-1/2 p-2">
          {['wickets_left', 'target_runs', 'crr', 'rrr'].map(field => (
            <div key={field} className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={field}>
                {field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </label>
              <input
                type="text"
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                readOnly={field === 'crr' || field === 'rrr'}
              />
            </div>
          ))}
        </div>
      </form>
      {result && <PieChart isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} result={result} />}
    </div>
  );
};

export default PredictionForm;