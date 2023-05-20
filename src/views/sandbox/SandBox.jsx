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
import 'nprogress/nprogress.css'
import { useEffect } from 'react'
import CommentList from './comment/Comment'
import Article from './article/Article'
import Error from './error/Error'
import ArticleList from './articleList/ArticleList'

export default function SandBox() {
  const { Header, Sider, Content } = Layout

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
                <Route path="/admin/write" element={<Article />} />
                <Route path="/system/category" element={<Category />} />
                <Route path="/system/tag" element={<TagList />} />
                <Route path="/system/comment" element={<CommentList />} />
                <Route path="/system/article" element={<ArticleList />} />
                <Route path="/error" element={<Error />} />
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
  width: 100vw;
  height: 100vh;
  overflow: auto;
  position: fixed;
`
