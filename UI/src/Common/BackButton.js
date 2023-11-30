import React from 'react';
import { useHistory } from 'react-router-dom';

const BackButton = () => {
  const history = useHistory();

  const handleGoBack = () => {
    history.goBack();
  };

  return (
    <button className="back-button" onClick={handleGoBack}>
      Back
    </button>
  );
};

export default BackButton;
