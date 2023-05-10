import React from 'react'
import {
  Button,
  Col,
  Row,
  Statistic,
  Avatar,
  Card,
  Divider,
  Space,
  Tag,
  message,
} from 'antd'
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import styled from 'styled-components'
import { useState } from 'react'
import { useEffect } from 'react'
import { http } from '../../../utils/request'
import { useNavigate } from 'react-router-dom'
export default function Home() {
  const { Meta } = Card
  const navigate = useNavigate()
  const [articleCount, setArticleCount] = useState(0)
  const [userCount, setUserCount] = useState(0)
  const [tag, setTag] = useState([])
  const [categoty, setCategory] = useState([])
  useEffect(() => {
    console.log('ser')
    return () => {
      setArticleCount(0)
      setCategory([])
      setTag([])
      console.log('销毁')
    }
  }, [])
  useEffect(() => {
    console.log('哈啊哈')
    http.get('/admin/article/count').then((res) => {
      if (res.data.code !== 200) {
        message.error(res.data.msg)
      } else {
        setArticleCount(res.data.data)
      }
    })
    http.get('/admin/user/count').then((res) => {
      if (res.data.code !== 200) {
        message.error(res.data.msg)
      } else {
        setUserCount(res.data.data)
      }
    })
    http.get('/admin/tag/all').then((res) => {
      if (res.data.code !== 200) {
        message.error(res.data.msg)
      } else {
        setTag(res.data.data.filter((item) => item.del_flag == 0))
      }
    })
    http.get('/admin/category/all').then((res) => {
      if (res.data.code !== 200) {
        message.error(res.data.msg)
      } else {
        setCategory(res.data.data.filter((item) => item.del_flag == 0))
      }
    })
    return () => {
      console.log('sd')
    }
  }, [])
  const color = [
    'magenta',
    'red',
    'volcano',
    'orange',
    'gold',
    'lime',
    'green',
    'cyan',
    'blue',
    'geekblue',
    'purple',
  ]

  const ShowTag = () => {
    return (
      <>
        {tag && tag.length > 0
          ? tag.map((item) => {
              return (
                <Tag key={item.id} color={color[item.id % tag.length]}>
                  {item.tag_Name}
                </Tag>
              )
            })
          : null}
      </>
    )
  }
  const ShowCategory = () => {
    return (
      <>
        {categoty && categoty.length > 0
          ? categoty.map((item) => {
              return <Tag key={item.id}>{item.category_name}</Tag>
            })
          : null}
      </>
    )
  }
  return (
    <>
      <Box>
        <HomeLeftBox>
          <>
            <Row gutter={16}>
              <Col span={10}>
                <Card title="标签数：8" bordered={false}>
                  <Space size={[0, 8]} wrap>
                    <ShowTag></ShowTag>
                  </Space>
                </Card>
              </Col>
              <Col span={10}>
                <Card title="分类数：8" bordered={false}>
                  <Space size={[0, 8]} wrap>
                    <ShowCategory />
                  </Space>
                </Card>
              </Col>

              <Col span={10}>
                <Card>
                  <Statistic title="Account count" value={userCount} />
                  <Button
                    onClick={() => {
                      navigate('/admin/userList')
                    }}
                    style={{
                      marginTop: 16,
                    }}
                    type="primary">
                    管理
                  </Button>
                </Card>
              </Col>
              <Col span={10}>
                <Card>
                  <Statistic title="article count" value={articleCount | 0} />
                  <Button
                    onClick={() => {
                      navigate('/system/article')
                    }}
                    style={{
                      marginTop: 16,
                    }}
                    type="primary">
                    管理
                  </Button>
                </Card>
              </Col>
            </Row>
          </>
        </HomeLeftBox>
        <HomeRightBox>
          <Card
            style={{
              width: 300,
            }}
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SettingOutlined key="setting" />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}>
            <Meta
              avatar={
                <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />
              }
              title="Card title"
              description="This is the description"
            />
          </Card>
        </HomeRightBox>
      </Box>
    </>
  )
}
const Box = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`

const HomeLeftBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 70%;
  height: 100%;
`
const HomeRightBox = styled.div`
  width: 30%;
  height: 100%;
`
