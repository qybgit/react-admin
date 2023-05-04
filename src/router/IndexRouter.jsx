import React from 'react'
import { BrowserRouter, Route, Navigate, Routes } from 'react-router-dom'
import styled from 'styled-components'
import { AuthRoute } from '../componets/Auth'
import Login from '../views/login/Login'
import SandBox from '../views/sandbox/SandBox'
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import { useEffect } from 'react'

export default function IndexRouter() {
  const isAuthenticated = localStorage.getItem('blog-admin-key') !== null
  //切换路由加载样式
  Nprogress.start()
  useEffect(() => {
    Nprogress.done()
  })
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/*"
          element={
            <AuthRoute>
              <SandBox />
            </AuthRoute>
          }></Route>
        <Route exact path="/admin/login" element={<Login />}></Route>
      </Routes>
    </BrowserRouter>
  )
}
const Box = styled.div`
  height: 100%;
`
