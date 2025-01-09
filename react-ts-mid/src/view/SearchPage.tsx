import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/App.css';
import bgImage from '../assets/images/background.jpg';
import { Student } from '../types/Student';
import { api } from '../enum/api';
import { asyncGet } from '../utils/fetch';

function SearchPage() {
  const navigate = useNavigate();
  const [displayStudents, setDisplayStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showStudentList, setShowStudentList] = useState(false);

  // 搜索表單狀態
  const [searchForm, setSearchForm] = useState({
    帳號: '',
    座號: '',
    姓名: '',
    院系: '',
    年級: '',
    班級: '',
    Email: ''
  });

  // 處理搜索表單輸入變化
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 獲取所有學生
  const fetchAllStudents = async () => {
    // 如果已經顯示列表，則隱藏列表
    if (showStudentList) {
      setShowStudentList(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await asyncGet(api.findAll);
      
      if (response.code === 200 && response.body) {
        setDisplayStudents(response.body);
        setShowStudentList(true);
      } else {
        setError(response.message || '無法獲取學生資料');
      }
    } catch (err) {
      setError('發生錯誤：' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  // 查詢學生
  const searchStudents = async () => {
    // 檢查是否所有輸入框都為空
    const isAllEmpty = Object.values(searchForm).every(value => value === '');
    
    if (isAllEmpty) {
      alert('請至少輸入一個查詢條件');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await asyncGet(api.findAll);
      
      if (response.code === 200 && response.body) {
        // 在所有學生中篩選
        const filteredStudents = response.body.filter(student => 
          Object.entries(searchForm).every(([key, value]) => 
            value === '' || 
            String(student[key as keyof Student])
              .toLowerCase()
              .includes(value.toLowerCase())
          )
        );

        setDisplayStudents(filteredStudents);
        setShowStudentList(true);
        
        // 如果只有一筆資料，直接跳轉到功能頁
        if (filteredStudents.length === 1) {
          handleStudentSelect(filteredStudents[0]);
        }
      } else {
        setError(response.message || '無法獲取學生資料');
      }
    } catch (err) {
      setError('發生錯誤：' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  // 處理選擇學生並跳轉到功能頁
  const handleStudentSelect = (student: Student) => {
    // 使用 localStorage 傳遞選中的學生資料
    localStorage.setItem('selectedStudent', JSON.stringify(student));
    // 跳轉到功能頁
    navigate('/function');
  };

  return (
    <div className="app-container">
      <header className="header">
        <button 
          className="nav-button" 
          style={{
            position: 'absolute',
            left: '0',
            top: '0',
            width: '150px',
            height: '126px',
            backgroundColor: '#0D8974', 
            color: 'white', 
            fontSize: '24px',
            border: 'none',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/')}
        >
          主頁
        </button>
        <h1>學生管理系統</h1>
        <button 
          className="nav-button" 
          style={{
            position: 'absolute',
            right: '0',
            top: '0',
            width: '150px',
            height: '126px',
            backgroundColor: '#0D8974', 
            color: 'white', 
            fontSize: '24px',
            border: 'none',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/function')}
        >
          修改
        </button>
      </header>
      
      <main className="main-content" style={{backgroundImage: `url(${bgImage})`}}>
        <div className="content-box">
          <div className="input-group">
            <label>帳號：
              <input 
                type="text" 
                name="帳號"
                value={searchForm.帳號}
                onChange={handleSearchInputChange}
              />
            </label>
            <label>座號：
              <input 
                type="text"
                name="座號"
                value={searchForm.座號}
                onChange={handleSearchInputChange}
              />
            </label>
            <label>姓名：
              <input 
                type="text" 
                name="姓名"
                value={searchForm.姓名}
                onChange={handleSearchInputChange}
              />
            </label>
            <label>院系：
              <input 
                type="text" 
                name="院系"
                value={searchForm.院系}
                onChange={handleSearchInputChange}
              />
            </label>
            <label>年級：
              <input 
                type="text" 
                name="年級"
                value={searchForm.年級}
                onChange={handleSearchInputChange}
              />
            </label>
            <label>班級：
              <input 
                type="text" 
                name="班級"
                value={searchForm.班級}
                onChange={handleSearchInputChange}
              />
            </label>
            <label>Email：
              <input 
                type="email" 
                name="Email"
                value={searchForm.Email}
                onChange={handleSearchInputChange}
              />
            </label>
          </div>
          <div className="button-group">
            <button 
              className="action-button"
              onClick={fetchAllStudents}
              style={{
                backgroundColor: '#34C6AD',
                color: 'black',
                width: '102px',
                height: '56px',
                borderRadius: '28px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              ALL
            </button>
            <button 
              className="action-button" 
              onClick={searchStudents}
              style={{
                backgroundColor: '#34C6AD',
                color: 'black',
                width: '102px',
                height: '56px',
                borderRadius: '28px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              查詢
            </button>
          </div>

          {/* 學生資料顯示區域 */}
          {showStudentList && (
            <div 
              style={{
                position: 'absolute',
                top: '20px',
                left: '-70px',
                right: '-70px',
                bottom: '150px',
                overflowY: 'auto',
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '10px'
              }}
            >
              {isLoading ? (
                <div style={{textAlign: 'center'}}>載入中...</div>
              ) : error ? (
                <div style={{color: 'red', textAlign: 'center'}}>{error}</div>
              ) : displayStudents.length > 0 ? (
                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                  <thead>
                    <tr style={{backgroundColor: '#f2f2f2'}}>
                      <th style={{border: '1px solid #ddd', padding: '8px'}}>座號</th>
                      <th style={{border: '1px solid #ddd', padding: '8px'}}>帳號</th>
                      <th style={{border: '1px solid #ddd', padding: '8px'}}>姓名</th>
                      <th style={{border: '1px solid #ddd', padding: '8px'}}>院系</th>
                      <th style={{border: '1px solid #ddd', padding: '8px'}}>年級</th>
                      <th style={{border: '1px solid #ddd', padding: '8px'}}>班級</th>
                      <th style={{border: '1px solid #ddd', padding: '8px'}}>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayStudents.map((student) => (
                      <tr 
                        key={student._id} 
                        onClick={() => handleStudentSelect(student)}
                        style={{
                          cursor: 'pointer', 
                          hover: {backgroundColor: '#f5f5f5'}
                        }}
                      >
                        <td style={{border: '1px solid #ddd', padding: '8px'}}>{student.座號}</td>
                        <td style={{border: '1px solid #ddd', padding: '8px'}}>{student.帳號}</td>
                        <td style={{border: '1px solid #ddd', padding: '8px'}}>{student.姓名}</td>
                        <td style={{border: '1px solid #ddd', padding: '8px'}}>{student.院系}</td>
                        <td style={{border: '1px solid #ddd', padding: '8px'}}>{student.年級}</td>
                        <td style={{border: '1px solid #ddd', padding: '8px'}}>{student.班級}</td>
                        <td style={{border: '1px solid #ddd', padding: '8px'}}>{student.Email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{textAlign: 'center', color: 'gray'}}>無符合條件的學生</div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default SearchPage;