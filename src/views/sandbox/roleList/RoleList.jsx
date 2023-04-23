import {
  Space,
  Table,
  Button,
  Modal,
  Switch,
  Spin,
  Input,
  Form,
  Tree,
  message,
} from 'antd'
import React, { useState, useEffect, useRef } from 'react'
import { http } from '../../../utils/request'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  CheckOutlined,
  PlusOutlined,
  CloseOutlined,
} from '@ant-design/icons'
import styled from 'styled-components'

export default function RoleList() {
  const [roleList, setRoleList] = useState([])
  const [menuList, setMenuList] = useState([])
  const [roleMenuList, setRoleMenuList] = useState([])
  const [currentMenuList, setCurrentMenuList] = useState([])
  const [checkedKeys, setCheckedKeys] = useState([])
  const [addRolecheckedKeys, setAddRolecheckedKeys] = useState([])
  const [roleId, setRoleId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddRole, setIsAddRole] = useState(false)
  const formRef = useRef(null)
  const addformRef = useRef(null)
  const [roleParam, setRoleParam] = useState({
    id: null,
    roleName: '',
    role_key: '',
    menusId: [],
  })
  const [addRoleParam, setAddRoleParam] = useState({
    role: {
      name: null,
      role_key: null,
    },
    menusId: [],
  })
  useEffect(() => {
    //获取角色列表设置roleList
    async function findRoleList() {
      const res = await http.get('/system/allRole')
      setRoleList(res.data.data)
      console.log('shuax')
    }
    //获取Tree中展示的所有权限
    async function findMenuList() {
      const res = await http.get('/admin/getRouters')
      setMenuList(res.data.data)
    }
    findMenuList()
    findRoleList()
    return () => {
      setRoleList([])
      setMenuList([])
    }
  }, [])
  //通过roleId获取角色所对应的信息包括所具有的权限
  useEffect(() => {
    if (roleId) {
      http.post(`/system/role/${roleId}`).then((res) => {
        setRoleMenuList(res.data.data)
      })
      //白忙活一场
      // const list = roleList.filter((item) => item.id == roleId)[0].menuList
      // console.log(list.map((item) => item.id))
      // list.filter((item) => item.grade == 2).map((item) => item.id)

      //设置checked默认选中框
      setCheckedKeys(currentMenuList.map((item) => item.id))
    }
    return () => {
      setRoleMenuList([])
      setCheckedKeys([])
    }
  }, [roleId, currentMenuList])
  //修改角色信息
  useEffect(() => {
    if (roleParam.id) {
      console.log(roleParam)
      http.post(`/system/editRole`, roleParam).then((res) => {
        if (res.data.code == 200) {
          message.success(res.data.msg)
        } else {
          message.error(res.data.msg)
        }
      })
    }
  }, [roleParam])
  useEffect(() => {
    if (addRoleParam.role.name && addRoleParam.role.role_key) {
      http.post('/system/addRole', addRoleParam).then((res) => {
        if (res.data.code !== 200) {
          message.error(res.data.msg)
        } else {
          message.success(res.data.data)
        }
      })
    }
  }, [addRoleParam])

  //配置表格数据源
  const getChildren = (item) => {
    if (item && item.length > 0) {
      const menuC = item.map((item) => {
        const menuItem = {
          key: item.id,
          title: item.menu_name,
        }
        if (item.children && item.children.length > 0) {
          menuItem.children = getChildren(item.children)
        }
        return menuItem
      })

      return menuC
    }
  }
  //Tree数据源
  const dataTree = menuList.map((item) => {
    const menuItem = {
      key: item.id,
      title: item.menu_name,
    }

    const menuChildren = getChildren(item.children)
    if (menuChildren && menuChildren.length > 0) {
      menuItem.children = menuChildren
    }
    return menuItem
  })
  //角色数据源映射
  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '权限字符',
      dataIndex: 'role_key',
      key: 'role_key',
    },
    {
      title: '创造时间',
      key: 'time',
      dataIndex: 'time',
    },
    {
      title: '状态',
      key: 'state',
      render: (item) => {
        return (
          <Space size="middle">
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
              checked={item.del_flag === 0 ? true : false}
              onClick={() => onChangeSwitch(item)}
            />
          </Space>
        )
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (item) => (
        <Space size="middle">
          <Button
            style={{ border: 'none', color: '#1677FF' }}
            icon={<EditOutlined />}
            onClick={() => onFindRoleList(item)}>
            修改
          </Button>
          <Button
            danger
            style={{ border: 'none' }}
            icon={<DeleteOutlined />}
            // onClick={() => showDeleteConfirm(item)}
          ></Button>
        </Space>
      ),
    },
  ]

  const onChangeSwitch = (item) => {
    item.delFlag = item.delFlag === 1 ? 0 : 1
  }
  //寻找角色所对应的信息
  const onFindRoleList = (item) => {
    setIsModalOpen(true)
    setRoleId(item.key)
    setCurrentMenuList(item.menuList)
  }
  //角色列表数据源转换
  const datas = roleList.map((item) => {
    const menuItem = {
      key: item.id,
      name: item.name,
      role_key: item.role_key,
      time: new Date(item.create_time).toLocaleString(),
      del_flag: item.del_flag,
      menuList: item.menuList,
    }
    return menuItem
  })
  //修改按钮开启提交表单
  const handleOk = () => {
    formRef.current.submit()
    setIsModalOpen(false)
  }
  //关闭model框
  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const onFinishFailed = () => {}
  //表单提交处理
  const onFinish = (e) => {
    const role = {
      id: roleId,
      roleName: e.rolename,
      role_key: e.role_key,
      menusId: e.menuList,
    }
    setRoleParam(role)
  }
  //chenked框变化值
  const onCheck = (e) => {
    setCheckedKeys(e)
    formRef.current.setFieldsValue({
      menuList: e,
      // rolename: roleMenuList.name,
    })
  }
  const onaddRoleCheck = (e) => {
    setAddRolecheckedKeys(e)
    addformRef.current.setFieldsValue({
      menuList: e,
    })
  }
  //表单提交
  const onAddRoleFinish = (e) => {
    const newRole = {
      role: {
        name: e.rolename,
        role_key: e.role_key,
      },
      menusId: e.menuList,
    }
    setAddRoleParam(newRole)
  }
  //新增角色model确认按钮提交表单
  const handleAddOk = () => {
    addformRef.current.submit()
  }
  //关闭modle
  const handleAddCancel = () => {
    setIsAddRole(false)
  }
  return (
    <>
      <RolesBox>
        <div className="addRole">
          <Button
            onClick={() => setIsAddRole(true)}
            style={{
              color: '#1677FF',
              backgroundColor: 'rgba(22, 119, 255, 0.2)',
            }}>
            <PlusOutlined />
            新增
          </Button>
          <div>
            <Modal
              title="添加角色"
              open={isAddRole}
              onOk={handleAddOk}
              onCancel={handleAddCancel}
              okText="添加"
              cancelText="取消">
              <div>
                <Form
                  ref={addformRef}
                  name="addRole"
                  wrapperCol={{
                    span: 16,
                  }}
                  style={{
                    maxWidth: 600,
                    textAlign: 'center',
                  }}
                  initialValues={{
                    remember: true,
                    rolename: '',
                    role_key: '',
                    // menuList: checkedKeys,
                  }}
                  onFinish={onAddRoleFinish}
                  onFinishFailed={onFinishFailed}>
                  <Form.Item
                    label="角色名称"
                    name="rolename"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your rolename!',
                      },
                    ]}>
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="权限字符"
                    name="role_key"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your role_key!',
                      },
                    ]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="menuList">
                    <Tree
                      checkable
                      checkedKeys={addRolecheckedKeys}
                      onCheck={(e) => onaddRoleCheck(e)}
                      treeData={dataTree}
                    />
                  </Form.Item>
                </Form>
              </div>
            </Modal>
          </div>
        </div>
        <div>
          {roleList && roleList.length > 0 ? (
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
        </div>

        <div>
          {roleMenuList && roleMenuList.length !== 0 ? (
            <Modal
              title="修改角色"
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
              okText="修改"
              cancelText="取消">
              <div>
                <Form
                  ref={formRef}
                  name="basic"
                  wrapperCol={{
                    span: 16,
                  }}
                  style={{
                    maxWidth: 600,
                    textAlign: 'center',
                  }}
                  initialValues={{
                    remember: true,
                    rolename: roleMenuList.name,
                    role_key: roleMenuList.role_key,
                    menuList: checkedKeys, //设置初始值后，表单组件已经创建了一个名为 menuList 的表单项，并且其初始值已经被设置为 undefined。当你调用 formRef.current.setFieldsValue() 方法时，它会更新表单中指定字段的值，并触发表单组件的重新渲染。
                  }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}>
                  <Form.Item
                    label="角色名称"
                    name="rolename"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your rolename!',
                      },
                    ]}>
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="权限字符"
                    name="role_key"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your role_key!',
                      },
                    ]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="menuList">
                    <Tree
                      checkable
                      checkedKeys={checkedKeys}
                      // defaultCheckedKeys={
                      //   currentMenuList && currentMenuList.length > 0
                      //     ? currentMenuList.map((item) => item.id)
                      //     : null
                      // }
                      // onSelect={onSelect}
                      onCheck={(e) => onCheck(e)}
                      treeData={dataTree}
                    />
                  </Form.Item>
                </Form>
              </div>
            </Modal>
          ) : null}
        </div>
      </RolesBox>
    </>
  )
}
const RolesBox = styled.div`
  font-size: 2em;
  .addRole {
    padding: 0 16px;
  }
`
