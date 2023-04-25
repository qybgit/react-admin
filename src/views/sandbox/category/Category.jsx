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

export default function Category() {
  const [categoryList, setCategoryList] = useState([])
  const [categoryContent, setCategoryContent] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDel_flag, setIsDel_flag] = useState(false)
  const [isAddCategory, setIsAddCategory] = useState(false)
  const [categoryParam, setCategoryParam] = useState({
    id: null,
    category_name: null,
  })
  const [categoryId, setCategoryId] = useState({
    id: null,
  })
  const [newCategory, setNewCategory] = useState({
    category_name: null,
  })
  const formRef = useRef(null)
  const addformRef = useRef(null)

  useEffect(() => {
    http.get('/admin/category/all').then((res) => {
      if (res.data.code !== 200) {
        message.error(res.data.msg)
      } else {
        setCategoryList(res.data.data)
      }
    })
    return () => {
      setCategoryList([])
    }
  }, [isDel_flag])
  useEffect(() => {
    if (categoryParam.id && categoryParam.category_name) {
      console.log(categoryParam)
      http.post('/admin/category/revise', categoryParam).then((res) => {
        if (res.data.code !== 200) {
          message.error(res.data.msg)
        } else {
          message.success(res.data.data)

          setIsDel_flag(!isDel_flag)
          setCategoryContent([])
        }
        setIsModalOpen(false)
      })
    }
  }, [categoryParam])
  useEffect(() => {
    if (newCategory.category_name) {
      http.post('/admin/category/add', newCategory).then((res) => {
        if (res.data.code !== 200) {
          message.error(res.data.msg)
        } else {
          message.success(res.data.msg)
        }
        setIsAddCategory(false)
        setIsDel_flag(!isDel_flag)
      })
    }
  }, [newCategory])
  const columns = [
    {
      title: '分类名称',
      dataIndex: 'category_name',
      key: 'category_name',
    },
    {
      title: '操作人员',
      dataIndex: 'nickName',
      key: 'nickName',
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
            onClick={() => onFindCategory(item)}>
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
  const datas = categoryList.map((item) => {
    const menuItem = {
      key: item.id,
      nickName: item.sysUserVo.nickName,
      category_name: item.category_name,
      time: new Date(item.create_date).toLocaleString(),
      del_flag: item.del_flag,
    }
    return menuItem
  })
  const onChangeSwitch = () => {}
  const onFindCategory = (item) => {
    setIsModalOpen(true)
    setCategoryContent(item)
    setCategoryId({ id: item.key })
  }
  const handleOk = () => {
    formRef.current.submit()
  }
  const handleCancel = () => {
    setIsModalOpen(false)
    setCategoryContent([])
  }
  const onFinish = (e) => {
    setCategoryParam({
      id: categoryId.id,
      category_name: e.category_name,
    })
  }
  const onFinishFailed = () => {}
  const handleSelectChange = () => {}
  const handleAddOk = () => {
    addformRef.current.submit()
  }
  const handleAddCancel = () => {
    setIsAddCategory(false)
    setNewCategory({
      category_name: null,
    })
  }
  const onAddCategoryFinish = (e) => {
    setNewCategory({
      category_name: e.category_name,
    })
  }
  return (
    <div>
      <CategoryBox>
        <div className="addCategory">
          <Button
            onClick={() => setIsAddCategory(true)}
            style={{
              color: '#1677FF',
              backgroundColor: 'rgba(22, 119, 255, 0.2)',
            }}>
            <PlusOutlined />
            新增
          </Button>
          <div>
            <Modal
              title="添加分类"
              open={isAddCategory}
              onOk={handleAddOk}
              onCancel={handleAddCancel}
              okText="添加"
              cancelText="取消">
              <div>
                <Form
                  ref={addformRef}
                  name="addCategory"
                  wrapperCol={{
                    span: 16,
                  }}
                  style={{
                    maxWidth: 600,
                    textAlign: 'center',
                  }}
                  initialValues={{}}
                  onFinish={onAddCategoryFinish}
                  onFinishFailed={onFinishFailed}>
                  <Form.Item
                    label="分类名称"
                    name="category_name"
                    rules={[
                      {
                        required: true,
                        message: '请输入分类!',
                      },
                    ]}>
                    <Input />
                  </Form.Item>
                </Form>
              </div>
            </Modal>
          </div>
        </div>
        <div>
          {categoryList && categoryList.length > 0 ? (
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
          {categoryContent && categoryContent.length !== 0 ? (
            <Modal
              title="修改名称"
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
                    // remember: true,
                    category_name: categoryContent.category_name,
                    // email: userContent.email,
                    // role: userContent.name,
                  }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}>
                  <Form.Item
                    label="分类名称"
                    name="category_name"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your nickName!',
                      },
                    ]}>
                    <Input />
                  </Form.Item>
                </Form>
              </div>
            </Modal>
          ) : null}
        </div>
      </CategoryBox>
    </div>
  )
}
const CategoryBox = styled.div`
  font-size: 2em;
  .addCategory {
    padding: 0 16px;
  }
`
