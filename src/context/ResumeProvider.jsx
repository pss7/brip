// context/ResumeProvider.js
import React, { createContext, useContext, useState } from 'react';
import { mockResumes } from '../data/mockResumes'; // mock 데이터

const ResumeContext = createContext();

export const useResume = () => {
  return useContext(ResumeContext);
};

export const ResumeProvider = ({ children }) => {
  const [resumeList, setResumeList] = useState(mockResumes); // 초기값 mock 데이터

  // 이력서 추가 함수
  const addResume = (newResume) => {
    setResumeList((prevList) => [...prevList, newResume]); // 새로운 이력서를 추가
  };

  // 이력서 삭제 함수
  const deleteResume = (id) => {
    setResumeList(resumeList.filter((resume) => resume.id !== id));
  };

  return (
    <ResumeContext.Provider value={{ resumeList, addResume, deleteResume }}>
      {children}
    </ResumeContext.Provider>
  );
};
