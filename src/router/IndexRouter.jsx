import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import styled from 'styled-components'
import Login from '../views/login/Login'
import SandBox from '../views/sandbox/SandBox'
export default function IndexRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<SandBox />}></Route>
        <Route path="/login" element={<Login />}></Route>
      </Routes>
    </BrowserRouter>
  )
}
const Box = styled.div`
  height: 100%;
`
