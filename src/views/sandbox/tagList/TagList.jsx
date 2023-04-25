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

export default function TagList() {
  const [tagList, setTagList] = useState([])
  const [tagContent, setTagContent] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddTag, setIsAddTag] = useState(false)
  const [tagId, setTagId] = useState(null)
  const [isDel_flag, setIsDel_flag] = useState(false)

  const formRef = useRef(null)
  const addformRef = useRef(null)
  const [tagParam, setTagparam] = useState({
    id: null,
    tag_Name: null,
  })

  useEffect(() => {
    http.get('/admin/tag/all').then((res) => {
      if (res.data.code != 200) {
        message.error(res.data.msg)
      } else {
        setTagList(res.data.data)
      }
    })
    return () => {
      setTagList([])
    }
  }, [isDel_flag])
  useEffect(() => {
    if (tagParam.id && tagParam.tag_Name) {
      http.post('/admin/tag/revise', tagParam).then((res) => {
        if (res.data.code !== 200) {
          message.error(res.data.msg)
        } else {
          message.success(res.data.msg)
          setIsDel_flag(!isDel_flag)
        }
      })
      setIsModalOpen(false)
    }
  }, [tagParam])
  const columns = [
    {
      title: '标签名称',
      dataIndex: 'tag_Name',
      key: 'tag_Name',
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
            onClick={() => onFindTag(item)}>
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
  const datas = tagList.map((item) => {
    const menuItem = {
      key: item.id,
      nickName: item.sysUserVo.nickName,
      tag_Name: item.tag_Name,
      time: new Date(item.create_date).toLocaleString(),
      del_flag: item.del_flag,
    }
    return menuItem
  })
  const onFindTag = (item) => {
    console.log(item)
    setIsModalOpen(true)
    setTagContent(item)
    setTagId(item.key)
  }
  const onChangeSwitch = () => {}
  const handleOk = () => {
    formRef.current.submit()
  }
  const handleCancel = () => {
    setIsModalOpen(false)
    setTagContent([])
  }
  const onFinishFailed = () => {}
  const onFinish = (e) => {
    setTagparam({
      id: tagId,
      tag_Name: e.tag_Name,
    })
  }
  const handleAddOk = () => {}
  const handleAddCancel = () => {
    setIsAddTag(false)
  }
  const onAddTagFinish = () => {}
  return (
    <div>
      <TagBox>
        <div className="addTag">
          <Button
            onClick={() => setIsAddTag(true)}
            style={{
              color: '#1677FF',
              backgroundColor: 'rgba(22, 119, 255, 0.2)',
            }}>
            <PlusOutlined />
            新增
          </Button>
          <div>
            <Modal
              title="添加标签"
              open={isAddTag}
              onOk={handleAddOk}
              onCancel={handleAddCancel}
              okText="添加"
              cancelText="取消">
              <div>
                <Form
                  ref={addformRef}
                  name="addTag"
                  wrapperCol={{
                    span: 16,
                  }}
                  style={{
                    maxWidth: 600,
                    textAlign: 'center',
                  }}
                  initialValues={{}}
                  onFinish={onAddTagFinish}
                  onFinishFailed={onFinishFailed}>
                  <Form.Item
                    label="标签名称"
                    name="tag_Name"
                    rules={[
                      {
                        required: true,
                        message: '请输入标签!',
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
          {tagList && tagList.length > 0 ? (
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
          {tagContent && tagContent.length !== 0 ? (
            <Modal
              title="修改标签"
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
                    tag_Name: tagContent.tag_Name,
                  }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}>
                  <Form.Item
                    label="标签名称"
                    name="tag_Name"
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
      </TagBox>
    </div>
  )
}
const TagBox = styled.div`
  font-size: 2em;
  .addTag {
    padding: 0 16px;
  }
`
