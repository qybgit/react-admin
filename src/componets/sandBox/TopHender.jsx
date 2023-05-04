import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons'
import { Layout, Menu, theme, Dropdown, Space, Avatar } from 'antd'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
export default function TopHender() {
  const [collapsed, setSollapsed] = useState(false)

  const navigate = useNavigate()
  const { Header, Sider, Content } = Layout
  const tokenE = localStorage.getItem('blog-admin-key')
  const useName = () => {
    if (tokenE) {
      let account = JSON.parse(tokenE)
      return (
        <div style={{ padding: '0 16px', float: 'left' }}>
          欢迎{account.account}
          <p>{account.account}</p>
        </div>
      )
    } else {
      return <span>未登录</span>
    }
  }
  const items = [
    {
      key: '1',
      label: <a target="_blank">超级管理员</a>,
    },

    {
      key: '2',
      danger: true,
      label: '退出',
      onClick: () => {
        navigate('/login')
      },
    },
  ]
  return (
    <>
      <Header
        style={{
          padding: '0 30px',
          background: '#FFF',
        }}>
        {!collapsed ? (
          <MenuFoldOutlined onClick={() => setSollapsed(!collapsed)} />
        ) : (
          <MenuUnfoldOutlined onClick={() => setSollapsed(!collapsed)} />
        )}
        <div style={{ float: 'right' }}>
          {' '}
          {useName()}
          <Dropdown
            autoAdjustOverflow="true"
            menu={{
              items,
            }}>
            <a onClick={(e) => e.preventDefault()}>
              <Avatar shape="square" size="large" icon={<UserOutlined />} />
            </a>
          </Dropdown>
        </div>
      </Header>
    </>
  )
}
