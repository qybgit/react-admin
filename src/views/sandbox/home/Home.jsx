import React from 'react'
import {
  Button,
  Empty,
  Col,
  Row,
  Statistic,
  Avatar,
  Card,
  Divider,
  Drawer,
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
import * as Echarts from 'echarts'
import { useRef } from 'react'
export default function Home() {
  const { Meta } = Card
  const navigate = useNavigate()
  const [articleCount, setArticleCount] = useState(0)
  const [userCount, setUserCount] = useState(0)
  const [tag, setTag] = useState([])
  const [categoty, setCategory] = useState([])
  const [myArticle, setMyArticle] = useState([])
  const [tagCount, setTagCount] = useState([])
  const tokenE = localStorage.getItem('blog-admin-key')
  const [user, setUser] = useState({})
  const [open, setOpen] = useState(false)
  const [peiChart, setPeiChart] = useState(null)
  const [tagChart, setTagChart] = useState(null)
  const eRef = useRef(null)
  const hRef = useRef(null)
  const s = 'sdrsertsssssssss'
  console.log('1')
  useEffect(() => {
    console.log('ser')
    if (tokenE) {
      const token = JSON.parse(tokenE)
      setUser(token)
    }
    return () => {
      setUser({})
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
  //获取个人分类文章
  useEffect(() => {
    http.get('/admin/article/myArticle').then((res) => {
      if (res.data.code == 200) {
        setMyArticle(res.data.data)
      }
    })
    http.get('/admin/tag/all').then((res) => {
      if (res.data.code == 200) {
        setTagCount(res.data.data)
        setTimeout(() => {
          renderHomeEchar()
        }, 5)
      }
    })

    return () => {
      setTagChart(null)
      setPeiChart(null)
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
  const onClose = () => {
    setOpen(false)
  }
  //饼状图数据源
  const getData = () => {
    const hashTable = {}
    if (!myArticle || myArticle.length < 1) {
      return []
    } else {
      myArticle.forEach((item) => {
        const { id, category_name } = item.category
        if (hashTable[category_name]) {
          hashTable[category_name]++
        } else {
          hashTable[category_name] = 1
        }
      })

      return Object.entries(hashTable).map(([key, values]) => {
        return {
          value: values,
          name: key,
        }
      })
    }
  }
  //饼状图配置
  const renderEchar = () => {
    if (myArticle && myArticle.length > 0) {
      var myChart
      if (peiChart) {
        myChart = peiChart
      } else {
        myChart = Echarts.init(eRef.current)
        setPeiChart(myChart)
      }

      var option
      option = {
        legend: {
          top: 'bottom',
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        series: [
          {
            name: 'Nightingale Chart',
            type: 'pie',
            radius: [10, 100],
            center: ['35%', '50%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 8,
            },
            data: getData(),
          },
        ],
      }

      option && myChart.setOption(option)
    }
  }
  //柱状图数据源
  const getTagCount = tagCount.map((item) => {
    return {
      name: item.tag_Name,
      value: item.count,
    }
  })
  console.log(tagCount)
  //柱状图配置
  const renderHomeEchar = () => {
    if (tagCount && tagCount.length > 0) {
      var myChart
      if (tagChart) {
        myChart = tagChart
      } else {
        myChart = Echarts.init(hRef.current)
        setTagChart(myChart)
      }
      var option
      option = {
        xAxis: {
          type: 'category',
          data: tagCount.map((item) => item.tag_Name),
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: tagCount.map((item) => item.count),
            type: 'bar',
          },
        ],
      }

      option && myChart.setOption(option)
    }
  }
  return (
    <>
      <Box>
        <HomeLeftBox>
          <>
            <Row gutter={16}>
              <Col span={10}>
                <Card title={`标签数：${tag.length}`} bordered={false}>
                  <Space size={[0, 8]} wrap>
                    <ShowTag></ShowTag>
                  </Space>
                </Card>
              </Col>
              <Col span={10}>
                <Card title={`分类数：${categoty.length}`} bordered={false}>
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
            <div ref={hRef} style={{ width: '80%', height: '500px' }}></div>
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
              <SettingOutlined
                key="setting"
                onClick={() => {
                  setOpen(true)
                  setTimeout(() => {
                    renderEchar()
                    getData()
                  }, 5)
                }}
              />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}>
            <Meta
              avatar={
                <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />
              }
              title={user.account}
              description={user.roleName}
            />
          </Card>
          <Drawer
            style={{ width: '100%' }}
            title="个人文章分类"
            placement="right"
            closable={true}
            onClose={onClose}
            open={open}>
            {myArticle && myArticle.length > 0 ? (
              <div ref={eRef} style={{ width: '500px', height: '500px' }}></div>
            ) : (
              <Empty description={false} />
            )}
          </Drawer>
        </HomeRightBox>
      </Box>
    </>
  )
}
const Box = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  overflow: auto;
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
