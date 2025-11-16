import React, { useState, useEffect, } from 'react'
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate,useNavigate  } from 'react-router-dom'
import ShowHospital from './hospitals/index';
export default function Hospitals() {
  return (
     <div><ShowHospital/></div>
  );
}