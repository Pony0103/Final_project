import { useNavigate } from 'react-router-dom';
import '../style/App.css';
import bgImage from '../assets/images/background.jpg';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <header className="header">
        <h1>學生管理系統</h1>
      </header>
      
      <main className="main-content" style={{backgroundImage: `url(${bgImage})`}}>
        <div className="buttons-container">
          <button className="round-button" onClick={() => navigate('/function')}>
            <span>更動</span>
          </button>
          
          <button className="round-button" onClick={() => navigate('/search')}>
            <span>查詢</span>
          </button>
        </div>
      </main>
    </div>
  );
}

export default HomePage;