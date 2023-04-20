import React from 'react'
import { Layout, Menu, theme } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  EditOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons'
import { useState, useEffect } from 'react'
import { http } from '../../utils/request'
import { useNavigate, useLocation } from 'react-router-dom'
import styled from 'styled-components'

export default function SideMenu() {
  const { Header, Sider, Content } = Layout
  const [menuList, setMenuList] = useState([])
  const navigate = useNavigate()
  const location = useLocation()
  const selectedKeys = [location.pathname]
  const openKeys = ['/' + location.pathname.split('/')[1]]
  const iconList = {
    '/admin/userList': <UserOutlined />,
    '/home': <VideoCameraOutlined />,
    '/admin/write': <EditOutlined />,
  }
  useEffect(() => {
    async function menulist() {
      const res = await http.get('/admin/getRouters')
      setMenuList(res.data.data)
    }
    menulist()
    return () => {
      setMenuList([])
    }
  }, [])
  // const handMenuChildren = (path) => {
  //   navigate(`${path}`)
  //}
  const handMenu = (path, children) => {
    if (children && children.length > 0) {
    } else {
      navigate(`${path}`)
    }
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
        onClick: (e) => handMenu(child.path, child.children),
      }))
    }

    return menuItem
  })

  return (
    <Sider trigger={null} collapsed={false} collapsible>
      <SiderBox>
        <div className="logo" style={{ background: '#555' }}>
          博客管理
        </div>
        <div className="menu">
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={selectedKeys}
            defaultOpenKeys={[]}
            items={items}
            style={{ textAlign: 'center', fontSize: '1.15em' }}></Menu>
        </div>
      </SiderBox>
    </Sider>
  )
}
const SiderBox = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  .menu {
    flex: 1;
    overflow: auto;
  }
  .logo {
    font-size: 1.3em;
    text-align: left;
  }
`