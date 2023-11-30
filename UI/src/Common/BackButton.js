import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // Navigates back to the previous page
  };

  return (
    <button onClick={goBack}>Back</button>
  );
};

export default BackButton;
