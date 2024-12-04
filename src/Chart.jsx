import React, { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Modal from 'react-modal';

ChartJS.register(ArcElement, Tooltip, Legend);

const Chart = ({ isModalOpen,setIsModalOpen,result }) => {
  // if(result==null) result
   console.log(result);
    

  const data = {
    labels: [result[1].teamName, result[0].teamName],
    datasets: [
      {
        label: 'Teams',
        data: [result[0].winPro, result[1].winPro], 
        backgroundColor: ['red', 'green'], // Colors for CSK and MI
        borderColor: ['#ffcc00', '#003366'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.label}: ${tooltipItem.raw}%`;
          },
        },
      },
    },
  };

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Pie Chart Modal"
        ariaHideApp={false} // For accessibility
        style={{
          content: {
            top: '20%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translateX(-50%)',
            padding: '20px',
            borderRadius: '10px',
            width: '80%',
            maxWidth: '500px',
          },
        }}
      >
        <button onClick={closeModal} style={{ fontSize: '24px', position: 'absolute', top: '10px', right: '10px' }}>
          &times;
        </button>
        <div style={{ textAlign: 'center' }}>
          <h2>Win Percentage</h2>
          <Pie data={data} options={options} />
        </div>
      </Modal>
    </div>
  );
};

export default Chart;
