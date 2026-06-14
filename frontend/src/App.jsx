import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CaterersPage from './pages/CatererPages';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<CaterersPage view="directory" />} />
      <Route path="/analytics" element={<CaterersPage view="analytics" />} />
      <Route path="/premium" element={<CaterersPage view="premium" />} />
      <Route path="/users" element={<CaterersPage view="users" />} />
      <Route path="/settings" element={<CaterersPage view="settings" />} />
    </Routes>
  );
}