import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons'
import { Layout, Menu, theme, Dropdown, Space, Avatar } from 'antd'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { http } from '../../utils/request'
function TopHender(props) {
  const navigate = useNavigate()
  const [user, setUser] = useState({})
  const { Header, Sider, Content } = Layout
  const tokenE = localStorage.getItem('blog-admin-key')
  const useName = () => {
    if (tokenE) {
      let account = JSON.parse(tokenE)
      return (
        <div style={{ padding: '0 10px', float: 'left' }}>
          欢迎<span style={{ color: '#1677FF' }}>{account.account}</span>
        </div>
      )
    } else {
      return <span>未登录</span>
    }
  }
  useEffect(() => {
    http.get('/admin/user/content').then((res) => {
      if (res.data.code == 200) {
        setUser(res.data.data)
      }
    })
    return () => {
      setUser({})
    }
  }, [])
  const items = [
    {
      key: '1',
      label: <a target="_blank">设置项</a>,
    },

    {
      key: '2',
      danger: true,
      label: '退出',
      onClick: () => {
        http.get('/admin/logout').then((res) => {
          localStorage.removeItem('blog-admin-key')
          if (res.data.code == 200) {
            console.log('tu')
            navigate('/admin/login')
          }
        })
      },
    },
  ]
  const onClick = () => {
    props.changeCollapsed()
  }
  return (
    <>
      <Header
        style={{
          padding: '0 30px',
          background: '#FFF',
        }}>
        {props.isCollapsed ? (
          <MenuFoldOutlined onClick={onClick} />
        ) : (
          <MenuUnfoldOutlined onClick={onClick} />
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
              <Avatar
                src={user ? `http://${user.avatar}` : null}
                shape="square"
                size="large"
                icon={<UserOutlined />}
              />
            </a>
          </Dropdown>
        </div>
      </Header>
    </>
  )
}
const mapStateTopProps = ({ CollApsedReducers: { isCollapsed } }) => {
  return {
    isCollapsed,
  }
}
const mapDispathTopprops = {
  changeCollapsed() {
    return {
      type: 'change_collapsed',
    }
  },
}

export default connect(mapStateTopProps, mapDispathTopprops)(TopHender)
