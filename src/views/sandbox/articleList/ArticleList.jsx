import { Space, Table, Button, Modal, Switch, Spin, Typography } from 'antd'
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
import { Link, Navigate, useNavigate } from 'react-router-dom'

export default function ArticleList() {
  const navigate = useNavigate()
  const { Text } = Typography

  const [articlelist, setArticlelist] = useState([])
  useEffect(() => {
    http.get('/admin/article/alls').then((res) => {
      if (res.data.code == 200) {
        setArticlelist(res.data.data)
      }
    })
  }, [])
  const columns = [
    {
      title: '作者',
      dataIndex: 'username',
      key: 'name',
      align: 'center',
    },
    {
      title: '标题',
      key: 'title',
      align: 'center',
      render: (item) => {
        return (
          <>
            {item.del_flag === 0 ? (
              item.title
            ) : (
              <Text style={{ color: 'red' }} delete>
                {item.title}
              </Text>
            )}
          </>
        )
      },
    },

    {
      title: '摘要',
      dataIndex: 'summary',
      key: 'summary',
      align: 'center',
    },
    {
      title: '更新时间',
      key: 'time',
      dataIndex: 'time',
      align: 'center',
    },
    {
      title: 'Action',
      key: 'action',
      render: (item) => (
        <Space size="middle">
          {item.del_flag === 0 ? (
            <>
              {' '}
              <Button
                style={{ border: 'none', color: '#1677FF' }}
                icon={<EditOutlined />}
                onClick={() => onEditor(item)}>
                修改
              </Button>
              <Button
                danger
                style={{ border: 'none' }}
                icon={<DeleteOutlined />}
                // onClick={() => showDeleteConfirm(item)}
              ></Button>
            </>
          ) : (
            <Button
              style={{ border: 'none', color: 'red' }}
              icon={<DeleteOutlined />}>
              从记录中删除
            </Button>
          )}
        </Space>
      ),
    },
  ]
  const datas = articlelist.map((item) => {
    const articleItem = {
      title: item.title,
      key: item.id,
      username: item.sysUserVo.nickName,
      summary: item.summary,
      time: item.updateDate,
      del_flag: item.del_flag,
    }
    return articleItem
  })

  const onEditor = (item) => {
    navigate(`/admin/write?id=${item.key}`)
  }
  const handleChange = () => {}
  return (
    <div>
      {articlelist && articlelist.length > 0 ? (
        <Table
          style={{ fontSize: '25px', padding: '0 16px', textAlign: 'center' }}
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
  )
}
