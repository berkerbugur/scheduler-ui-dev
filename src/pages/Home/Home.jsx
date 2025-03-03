import Schedule from '../../components/Schedule/Schedule.jsx';
import './Home.css';

const Home = ({closed, setIsOpen}) => {
  return (
    <div className="home-container">
      <Schedule closed={closed} setIsOpen={setIsOpen} />
    </div>
  );
};

export default Home; 