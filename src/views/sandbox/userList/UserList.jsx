import {
  Space,
  Table,
  Button,
  Modal,
  Switch,
  Spin,
  Input,
  Form,
  Select,
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
const BigInt = require('big-integer')
export default function UserList() {
  const [userList, setUserList] = useState([])
  const [userContent, setUserContent] = useState([])
  const formRef = useRef(null)
  const addformRef = useRef(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddUser, setIsAddUser] = useState(false)
  const [roleList, setRoleList] = useState([])
  const [userId, setUserId] = useState(0)
  const [isDel_flag, setIsDel_flag] = useState(false)
  const [deletedParam, setDeletedParam] = useState({
    id: null,
    del_flag: null,
  })
  const [userParam, setUserParam] = useState({
    id: null,
    email: '',
    nickName: '',
    roleId: null,
  })
  const [newUserParam, setNewUserParam] = useState({
    email: null,
    nickName: null,
    password: null,
    role: {
      id: null,
    },
  })
  useEffect(() => {
    http.get('/admin/user/all', { responseType: 'json' }).then((res) => {
      if (res.data.code !== 200) {
        message.error(res.data.data.msg)
      } else {
        setUserList(res.data.data)
      }
    })
    console.log('shuaxing')
    http.get('/system/allRole').then((res) => {
      if (res.data.code !== 200) {
        message.error(res.data.data.msg)
      } else {
        setRoleList(res.data.data)
      }
    })
    return () => {
      setUserList([])
      setRoleList([])
    }
  }, [isDel_flag])
  useEffect(() => {
    if (userParam.id) {
      http.post('/admin/user/edit', userParam).then((res) => {
        if (res.data.code !== 200) {
          message.error(res.data.msg)
        } else {
          message.success(res.data.msg)
        }
        setIsModalOpen(false)
      })
    }

    return () => {}
  }, [userParam])
  useEffect(() => {
    if (newUserParam.nickName && newUserParam.email && newUserParam.password) {
      http.post('/admin/user/addUser', newUserParam).then((res) => {
        if (res.data.code !== 200) {
          message.error(res.data.msg)
        } else {
          message.success(res.data.msg)
        }
      })
      setIsAddUser(false)
    }

    return () => {}
  }, [isDel_flag])
  useEffect(() => {
    console.log(deletedParam)
    if (deletedParam.id) {
      http.post(`/admin/user/delete`, deletedParam).then((res) => {
        if (res.data.code !== 200) {
          message.error(res.data.msg)
        } else {
          message.success(res.data.msg)
        }
      })
      setIsDel_flag(!isDel_flag)
      console.log('删除')
    }
  }, [deletedParam])

  const columns = [
    {
      title: '用户名称',
      dataIndex: 'nickName',
      key: 'nickName',
    },
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
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
            onClick={() => onFindUser(item)}>
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
  //Table表数据源配置
  const datas = userList.map((item) => {
    const menuItem = {
      key: item.id,
      nickName: item.nickName,
      name: item.roleVo ? item.roleVo.name : null,
      email: item.email ? item.email : null,
      time: new Date(item.create_date).toLocaleString(),
      roleVoId: item.roleVo ? item.roleVo.id : null,
      del_flag: item.deleted,
    }
    return menuItem
  })
  //角色选择器数据源配置
  const options = roleList.map((item) => {
    const roleItem = {
      label: item.name,
      value: item.id,
    }
    return roleItem
  })
  const onChangeSwitch = (item) => {
    console.log(item.del_flag)
    item.del_flag = item.del_flag === 1 ? 0 : 1
    setDeletedParam({ del_flag: item.del_flag, id: item.key })
  }
  //修改按钮出发事件
  const onFindUser = (item) => {
    setIsModalOpen(true)
    setUserContent(item)
    setUserId(item.key)
  }
  //确认修改按钮触发事件
  const handleOk = () => {
    formRef.current.submit()
  }
  //取消事件
  const handleCancel = () => {
    setIsModalOpen(false)
    setUserContent([])
    setUserId(0)
    setUserParam({})
  }
  //表单提交事件触发
  const onFinish = (e) => {
    setUserParam({
      id: userId,
      email: e.email,
      nickName: e.nickName,
      roleId: e.role && typeof e.role === 'string' ? null : e.role,
    })
  }
  const onFinishFailed = () => {}
  const handleSelectChange = () => {}
  //确认添加用户按钮点击事件
  const handleAddOk = () => {
    addformRef.current.submit()
  }
  //确认添加用户按钮取消事件
  const handleAddCancel = () => {
    setIsAddUser(false)
    setNewUserParam({})
    setUserId(0)
  }
  //确认添加用户按钮表单提交事件
  const onAddUserFinish = (e) => {
    setNewUserParam({
      email: e.email,
      nickName: e.nickName,
      password: e.password,
      role: {
        id: e.role && typeof e.role === 'string' ? null : e.role,
      },
    })
  }
  return (
    <UserListBox>
      <div className="addUser">
        <Button
          onClick={() => setIsAddUser(true)}
          style={{
            color: '#1677FF',
            backgroundColor: 'rgba(22, 119, 255, 0.2)',
          }}>
          <PlusOutlined />
          新增
        </Button>
        <div>
          <Modal
            title="添加用户"
            open={isAddUser}
            onOk={handleAddOk}
            onCancel={handleAddCancel}
            okText="添加"
            cancelText="取消">
            <div>
              <Form
                ref={addformRef}
                name="addUser"
                wrapperCol={{
                  span: 16,
                }}
                style={{
                  maxWidth: 600,
                  textAlign: 'center',
                }}
                initialValues={{
                  rolename: '',
                  role_key: '',
                }}
                onFinish={onAddUserFinish}
                onFinishFailed={onFinishFailed}>
                <Form.Item
                  label="用户名称"
                  name="nickName"
                  rules={[
                    {
                      required: true,
                      message: '请输入用户名!',
                    },
                  ]}>
                  <Input />
                </Form.Item>
                <Form.Item
                  label="邮箱"
                  name="email"
                  rules={[
                    {
                      type: 'email',
                      required: true,
                      message: '请输入正确的邮箱格式!',
                    },
                  ]}>
                  <Input type="email" />
                </Form.Item>
                <Form.Item
                  label="密码"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: '请输入密码!',
                    },
                  ]}>
                  <Input.Password />
                </Form.Item>
                <Form.Item label="角色选择" name="role">
                  <Select
                    style={{
                      width: 180,
                    }}
                    onChange={handleSelectChange}
                    options={options}
                  />
                </Form.Item>
              </Form>
            </div>
          </Modal>
        </div>
      </div>
      <div>
        {userList && userList.length > 0 ? (
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
        {userContent && userContent.length !== 0 ? (
          <Modal
            title="修改用户"
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
                  nickName: userContent.nickName,
                  email: userContent.email,
                  role: userContent.name,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}>
                <Form.Item
                  label="用户名称"
                  name="nickName"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your nickName!',
                    },
                  ]}>
                  <Input />
                </Form.Item>
                <Form.Item
                  label="邮    箱   "
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your email!',
                    },
                  ]}>
                  <Input />
                </Form.Item>
                <Form.Item label="角色选择" name="role">
                  <Select
                    style={{
                      width: 180,
                    }}
                    onChange={handleSelectChange}
                    options={options}
                  />
                </Form.Item>
              </Form>
            </div>
          </Modal>
        ) : null}
      </div>
    </UserListBox>
  )
}
const UserListBox = styled.div`
  font-size: 2em;
  .addUser {
    padding: 0 16px;
  }
`
