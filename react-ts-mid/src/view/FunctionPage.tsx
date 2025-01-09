import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/App.css';
import bgImage from '../assets/images/background.jpg';
import { Student } from '../types/Student';
import { api } from '../enum/api';
import { asyncPost, asyncPut, asyncDelete } from '../utils/fetch';

function FunctionPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Student>({
    帳號: '',
    座號: 0,
    姓名: '',
    院系: '',
    年級: '',
    班級: '',
    Email: ''
  });
  const [isExistingStudent, setIsExistingStudent] = useState(false);

  // 從 localStorage 讀取選中的學生資料
  useEffect(() => {
    const selectedStudent = localStorage.getItem('selectedStudent');
    if (selectedStudent) {
      try {
        const parsedStudent = JSON.parse(selectedStudent);
        setFormData(parsedStudent);
        setIsExistingStudent(true);
        // 清除 localStorage 中的數據
        localStorage.removeItem('selectedStudent');
      } catch (error) {
        console.error('解析學生資料出錯', error);
      }
    }
  }, []);

  // 處理輸入框變化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === '座號' ? Number(value) : value
    }));
  };

  // 新增學生
  const handleAdd = async () => {
    // 檢查所有必填欄位是否已填寫
    const requiredFields: (keyof Student)[] = ['帳號', '姓名', '院系', '年級', '班級', 'Email'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      alert(`請填寫以下欄位：${missingFields.join('、')}`);
      return;
    }

    try {
      const response = await asyncPost(api.insertOne, formData);
      if (response.code === 200) {
        alert('新增成功');
        // 清空表單
        setFormData({
          帳號: '',
          座號: 0,
          姓名: '',
          院系: '',
          年級: '',
          班級: '',
          Email: ''
        });
        setIsExistingStudent(false);
      } else {
        alert(`新增失敗: ${response.message}`);
      }
    } catch (error) {
      console.error('新增學生出錯', error);
      alert('新增失敗');
    }
  };

  // 修改學生資料
  const handleUpdate = async () => {
    if (!isExistingStudent || !formData._id) {
      alert('請先選擇要修改的學生');
      return;
    }

    try {
      const response = await asyncPut(`${api.updateById}/${formData._id}`, formData);
      if (response.code === 200) {
        alert('修改成功');
      } else {
        alert(`修改失敗: ${response.message}`);
      }
    } catch (error) {
      console.error('修改學生出錯', error);
      alert('修改失敗');
    }
  };

  // 刪除學生
  const handleDelete = async () => {
    if (!isExistingStudent || !formData._id) {
      alert('請先選擇要刪除的學生');
      return;
    }

    try {
      const response = await asyncDelete(`${api.deleteById}/${formData._id}`);
      if (response.code === 200) {
        alert('刪除成功');
        // 清空表單
        setFormData({
          帳號: '',
          座號: 0,
          姓名: '',
          院系: '',
          年級: '',
          班級: '',
          Email: ''
        });
        setIsExistingStudent(false);
      } else {
        alert(`刪除失敗: ${response.message}`);
      }
    } catch (error) {
      console.error('刪除學生出錯', error);
      alert('刪除失敗');
    }
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
          onClick={() => navigate('/search')}
        >
          查詢
        </button>
      </header>
      
      <main className="main-content" style={{backgroundImage: `url(${bgImage})`}}>
        <div className="content-box">
          <div className="input-group">
            <label>帳號：
              <input 
                type="text" 
                name="帳號"
                value={formData.帳號}
                onChange={handleInputChange}
              />
            </label>
            <label>座號：
              <input 
                type="number" 
                name="座號"
                value={formData.座號}
                onChange={handleInputChange}
              />
            </label>
            <label>姓名：
              <input 
                type="text" 
                name="姓名"
                value={formData.姓名}
                onChange={handleInputChange}
              />
            </label>
            <label>院系：
              <input 
                type="text" 
                name="院系"
                value={formData.院系}
                onChange={handleInputChange}
              />
            </label>
            <label>年級：
              <input 
                type="text" 
                name="年級"
                value={formData.年級}
                onChange={handleInputChange}
              />
            </label>
            <label>班級：
              <input 
                type="text" 
                name="班級"
                value={formData.班級}
                onChange={handleInputChange}
              />
            </label>
            <label>Email：
              <input 
                type="email" 
                name="Email"
                value={formData.Email}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className="button-group">
            <button 
              className="action-button"
              onClick={handleAdd}
            >
              +
            </button>
            <button 
              className="action-button"
              onClick={handleDelete}
              disabled={!isExistingStudent}
            >
              -
            </button>
            <button 
              className="action-button"
              onClick={handleUpdate}
              disabled={!isExistingStudent}
            >
              修改
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default FunctionPage;