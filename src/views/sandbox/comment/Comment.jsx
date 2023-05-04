import {
  Space,
  Table,
  Button,
  Modal,
  Switch,
  Spin,
  Input,
  Form,
  Typography,
  Select,
  message,
} from 'antd'
import React, { useState, useEffect, useRef } from 'react'
import { http } from '../../../utils/request'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
} from '@ant-design/icons'
import styled from 'styled-components'
export default function CommentList() {
  const [commentList, setCommentList] = useState([])
  const { Search } = Input
  const { confirm } = Modal
  const { Text } = Typography
  useEffect(() => {
    http.get('/admin/comment/all').then((res) => {
      if (res.data.code !== 200) {
        message.error(res.data.msg)
      } else {
        setCommentList(res.data.data)
      }
    })
    console.log('asdrf')
    return () => {
      setCommentList([])
    }
  }, [])
  const columns = [
    {
      title: '文章标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '评论用户',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '评论内容',

      key: 'content',
      render: (item) => {
        return (
          <>
            {item.del_flag === 1 ? (
              <Text style={{ color: 'red' }} delete>
                {item.content}
              </Text>
            ) : (
              <span>{item.content}</span>
            )}
          </>
        )
      },
    },
    {
      title: '创造时间',
      key: 'time',
      dataIndex: 'time',
      // sorter: (a, b) => a.create_date - b.create_date,
      // sortOrder: sortedInfo.columnKey === 'time' ? sortedInfo.order : null,
    },

    {
      title: 'Action',
      key: 'action',
      render: (item) => (
        <Space size="middle">
          <Button
            danger
            style={{ border: 'none' }}
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(item)}></Button>
        </Space>
      ),
    },
  ]
  const datas = commentList.map((item) => {
    const commentItem = {
      key: item.id,
      content: item.content,
      time: item.createDate,
      title: item.articleName,
      username: item.toUser.nickName,
      del_flag: item.del_flag,
    }
    return commentItem
  })

  const handleChange = () => {}
  const onChangeSwitch = () => {}
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
        // setMenuList(menuList.filter((data) => data.id !== item.id))
      },
    })
  }
  const deleteMetod = (item) => {
    http.post(`/admin/comment/delete/${item.key}`).then((res) => {
      if (res.data.code !== 200) {
        message.error(res.data.msg)
      } else {
        message.success(res.data.msg)
        const list = commentList.filter((data) => data.id == item.key)
        list[0].del_flag = 1
        console.log(list)
        setCommentList([...commentList])
      }
    })
  }
  const onSearch = (e) => {
    http.post('/admin/comment/search', { text: e }).then((res) => {
      if (res.data.code !== 200) {
        message.error(res.data.msg)
      } else {
        setCommentList(res.data.data)
      }
    })
  }
  const onChange = (e) => {
    setCommentList(commentList.filter((item) => item.del_flag == e))
  }
  return (
    <CommentBox>
      <div className="box-search">
        <Search
          size="large"
          style={{ width: '200px' }}
          placeholder="搜索评论内容"
          onSearch={onSearch}
          enterButton
        />

        <span style={{ fontSize: '0.7em', padding: '0 10px' }}>状态：</span>
        <Select
          size="large"
          showSearch
          style={{ width: '200px' }}
          placeholder="选择状态"
          optionFilterProp="children"
          onChange={onChange}
          onSearch={onSearch}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={[
            {
              value: '0',
              label: '正常',
            },
            {
              value: '1',
              label: '已删除',
            },
          ]}
        />
      </div>

      <div>
        {true ? (
          <Table
            style={{ fontSize: '20px', padding: '0 16px' }}
            pagination={{ pageSize: '10' }}
            columns={columns}
            dataSource={datas}
            size="large"
            onChange={handleChange}
          />
        ) : (
          <Spin size="large" />
        )}
      </div>
    </CommentBox>
  )
}
const CommentBox = styled.div`
  font-size: 2em;
  .box-search {
    padding: 16px 16px;
    display: flex;
    align-items: center;
  }
`
