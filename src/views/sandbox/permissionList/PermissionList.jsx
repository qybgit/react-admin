import React from 'react'
import { Space, Table, Tag, Button } from 'antd'
import { useState } from 'react'
import { useEffect } from 'react'
import { http } from '../../../utils/request'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import styled from 'styled-components'
export default function PermissionList() {
  const [menuList, setMenuList] = useState([])
  useEffect(() => {
    async function findMenuList() {
      const res = await http.get('/admin/getRouters')
      setMenuList(res.data.data)
    }
    findMenuList()
    return () => {
      setMenuList([])
    }
  }, [])
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '路径',
      dataIndex: 'Path',
      key: 'Path',
    },
    {
      title: '创造时间',
      key: 'time',
      dataIndex: 'time',
    },
    {
      title: '权限',
      dataIndex: 'permission',
      key: 'permission',

      render: (permission) => {
        return (
          <>
            <Tag>{permission}</Tag>
          </>
        )
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button
            type="primary"
            shape="circle"
            icon={<EditOutlined />}></Button>
          <Button danger shape="circle" icon={<DeleteOutlined />}></Button>
        </Space>
      ),
    },
  ]
  const getChildren = (item) => {
    if (item && item.length > 0) {
      const menuC = item.map((item) => {
        const menuItem = {
          key: item.id,
          name: item.menu_name,
          Path: item.path,
          time: item.create_time,
          tags: item.perms ? [item.perms] : null,
        }
        if (item.children && item.children.length > 0) {
          menuItem.children = getChildren(item.children)
        }
        return menuItem
      })

      return menuC
    }
  }

  const datas = menuList.map((item) => {
    const menuItem = {
      key: item.id,
      name: item.menu_name,
      Path: item.path,
      time: item.create_time,
      tags: item.perms ? [item.perms] : null,
    }

    const menuChildren = getChildren(item.children)
    if (menuChildren && menuChildren.length > 0) {
      menuItem.children = menuChildren
    }
    return menuItem
  })

  return (
    <>
      <PermissionBox>
        <Table
          style={{ fontSize: '20px' }}
          pagination={{ pageSize: '10' }}
          columns={columns}
          dataSource={datas}
          size="large"
        />
      </PermissionBox>
    </>
  )
}
const PermissionBox = styled.div`
  font-size: 2em;
`
