import React from 'react'
import { Space, Table, Tag, Button, Modal, Switch, Spin } from 'antd'
import { useState } from 'react'
import { useEffect } from 'react'
import { http } from '../../../utils/request'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons'
import styled from 'styled-components'
export default function PermissionList() {
  const [menuList, setMenuList] = useState([])
  const { confirm } = Modal
  useEffect(() => {
    async function findMenuList() {
      const res = await http.get('/admin/getMenus')
      setMenuList(res.data.data)
      console.log('shuax')
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

      render: (permission) => (
        <>
          <Tag color="orange">{permission}</Tag>
        </>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (item) => (
        <Space size="middle">
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            checked={item.delFlag === 0 ? true : false}
            onClick={() => onChangeSwitch(item)}
          />
          <Button
            danger
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(item)}></Button>
        </Space>
      ),
    },
  ]
  // const columns = [
  //   {
  //     title: 'Name',
  //     dataIndex: 'menu_name',
  //     key: 'name',
  //   },
  //   {
  //     title: '路径',
  //     dataIndex: 'path',
  //     key: 'Path',
  //   },
  //   {
  //     title: '创造时间',
  //     key: 'time',
  //     dataIndex: 'create_time',
  //   },
  //   {
  //     title: '权限',
  //     dataIndex: 'permission',
  //     key: 'permission',

  //     render: (permission) => (
  //       <>
  //         <Tag color="orange">{permission}</Tag>
  //       </>
  //     ),
  //   },
  //   {
  //     title: 'Action',
  //     key: 'action',
  //     render: (item) => (
  //       <Space size="middle">
  //         <Switch
  //           checkedChildren={<CheckOutlined />}
  //           unCheckedChildren={<CloseOutlined />}
  //           checked={item.delFlag === 0 ? true : false}
  //           onClick={() => onChangeSwitch(item)}
  //         />
  //         <Button
  //           danger
  //           shape="circle"
  //           icon={<DeleteOutlined />}
  //           onClick={() => showDeleteConfirm(item)}></Button>
  //       </Space>
  //     ),
  //   },
  // ]
  const getChildren = (item) => {
    if (item && item.length > 0) {
      const menuC = item.map((item) => {
        const menuItem = {
          key: item.id,
          name: item.menu_name,
          Path: item.path,
          time: item.create_time,
          parentId: item.parent_id,
          permission: item.perms ? [item.perms] : null,
          delFlag: item.del_flag,
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
      time: new Date(item.create_time).toLocaleString(),
      permission: item.perms ? [item.perms] : null,
      parentId: item.parent_id,
      delFlag: item.del_flag,
    }

    const menuChildren = getChildren(item.children)
    if (menuChildren && menuChildren.length > 0) {
      menuItem.children = menuChildren
    }
    return menuItem
  })

  const showDeleteConfirm = (item) => {
    confirm({
      title: '确认删除吗',
      icon: <ExclamationCircleFilled />,
      content: '',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteMetod(item)
      },
      onCancel() {
        setMenuList(menuList.filter((data) => data.id !== item.id))
      },
    })
  }
  const deleteMetod = (item) => {
    if (item.parentId === 0) {
      setMenuList(menuList.filter((data) => data.id !== item.key)) //item无id属性，默认使用key
    } else {
      const list = menuList.filter((data) => data.id === item.parentId)
      if (list.length <= 0) {
      } else {
        list[0].children = list[0].children.filter(
          (data) => data.id !== item.key
        )
        setMenuList([...menuList])
      }
    }
  }
  const onChangeSwitch = (item) => {
    item.delFlag = item.delFlag === 1 ? 0 : 1
    http
      .post('/admin/menuEdit', {
        id: item.delFlag,
        menuId: item.key,
      })
      .then((res) => {
        setMenuList(res.data.data)
      })
  }
  return (
    <>
      <PermissionBox>
        {menuList && menuList.length > 0 ? (
          <Table
            style={{ fontSize: '20px', padding: '0 16px' }}
            pagination={{ pageSize: '10' }}
            columns={columns}
            dataSource={datas}
            size="large"
          />
        ) : (
          <Spin size="large" />
        )}
      </PermissionBox>
    </>
  )
}
const PermissionBox = styled.div`
  font-size: 2em;
`
