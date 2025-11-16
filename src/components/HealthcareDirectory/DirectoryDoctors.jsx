import React, { useState, useEffect, } from 'react'
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate,useNavigate  } from 'react-router-dom'
import NewDoctors from './doctors/index.jsx';

export default function DirectoryDoctors() {
  return (
    <div><NewDoctors /></div>
  );
}