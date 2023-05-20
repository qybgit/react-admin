import React from 'react'
import { Layout, Menu, message } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  EditOutlined,
  UserOutlined,
  VideoCameraOutlined,
  ShopOutlined,
  AppstoreOutlined,
} from '@ant-design/icons'
import { useState, useEffect } from 'react'
import { http } from '../../utils/request'
import { useNavigate, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { connect } from 'react-redux'

function SideMenu(props) {
  const { Header, Sider, Content } = Layout
  const [menuList, setMenuList] = useState([])
  const navigate = useNavigate()
  const location = useLocation()
  const selectedKeys = [location.pathname]
  const openKeys = ['/' + location.pathname.split('/')[1]]
  const iconList = {
    // '/admin/userList': <UserOutlined />,
    '/home': <ShopOutlined />,
    '/admin/write': <EditOutlined />,
    '/admin/system': <AppstoreOutlined />,
    '/system/content': <AppstoreOutlined />,
  }
  useEffect(() => {
    async function menulist() {
      http.get('/admin/getRouters').then((res) => {
        if (res.data.code != 200) {
          localStorage.removeItem('blog-admin-key')
          message.error(res.data.msg)
        } else {
          setMenuList(res.data.data)
        }
      })
    }
    menulist()
    return () => {
      setMenuList([])
    }
  }, [])

  const handMenu = (path, children) => {
    if (children && children.length > 0) {
    } else {
      navigate(`${path}`)
    }
  }
  const handChildrenMenu = (path, children) => {
    navigate(`${path}`)
  }
  const items = menuList.map((item) => {
    const menuItem = {
      key: item.path,
      icon: iconList[item.path],
      label: item.menu_name,
      onClick: () => handMenu(item.path, item.children),
    }

    if (item.children && item.children.length > 0) {
      menuItem.children = item.children.map((child) => ({
        key: child.path,
        label: child.menu_name,
        icon: iconList[child.path],
        onClick: () => handChildrenMenu(child.path, child.children),
      }))
    }

    return menuItem
  })

  return (
    <Sider trigger={null} collapsed={props.isCollapsed} collapsible>
      <SiderBox>
        <div
          className="logo"
          style={{ textDecoration: 'center', color: '#1677ff' }}>
          博客管理
        </div>
        <div className="menu">
          {menuList && menuList.length > 0 ? (
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={selectedKeys}
              defaultOpenKeys={[]}
              items={items}
              style={{
                padding: '0 ',
                textAlign: 'left',
                fontSize: '1.15em',
              }}></Menu>
          ) : null}
        </div>
      </SiderBox>
    </Sider>
  )
}

const SiderBox = styled.div`
  /* display: flex;
  flex-direction: column; */
  height: 100%;
  width: 100%;
  .menu {
    /* flex: 1; */
    overflow: auto;
  }
  .logo {
    font-size: 1.3em;
    text-align: center;
  }
`
const mapSideMenu = ({ CollApsedReducers: { isCollapsed } }) => {
  return {
    isCollapsed,
  }
}
export default connect(mapSideMenu)(SideMenu)
