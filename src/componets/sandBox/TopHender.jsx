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
export default function TopHender() {
  const [collapsed, setSollapsed] = useState(false)
  const { Header, Sider, Content } = Layout
  const items = [
    {
      key: '1',
      label: <a target="_blank">超级管理员</a>,
    },

    {
      key: '2',
      danger: true,
      label: '退出',
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
          <span style={{ padding: '0 16px' }}>欢迎hhh</span>
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
