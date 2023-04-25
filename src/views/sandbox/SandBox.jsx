import React from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import SideMenu from '../../componets/sandBox/SideMenu'
import TopHender from '../../componets/sandBox/TopHender'
import Home from './home/Home'
import NotFound from './notFound/NotFound'
import SystemManage from './system-manage/SystemManage'
import { Layout, Menu, theme } from 'antd'
import styled from 'styled-components'
import PermissionList from './permissionList/PermissionList'
import RoleList from './roleList/RoleList'
import UserList from './userList/UserList'
import Category from './category/Category'
import TagList from './tagList/TagList'
const { Header, Sider, Content } = Layout

export default function SandBox() {
  return (
    <>
      <LayoutBox>
        <Layout style={{ height: '100%' }}>
          <SideMenu />
          <Layout>
            <TopHender />
            <Content
              style={{
                margin: '24px 16px',
                padding: 24,
                minHeight: 280,
                background: '#fff',
                overflow: 'auto',
              }}>
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/system" element={<SystemManage />} />
                <Route path="/admin/permission" element={<PermissionList />} />
                <Route path="/admin/roles" element={<RoleList />} />
                <Route path="/admin/userList" element={<UserList />} />
                <Route path="/system/category" element={<Category />} />
                <Route path="/system/tag" element={<TagList />} />
                <Route path="/" element={<Home></Home>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </LayoutBox>
    </>
  )
}
const LayoutBox = styled.div`
  width: 100%;
  height: 100%;
`
