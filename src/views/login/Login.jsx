import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input, Card, Avatar, message } from 'antd'
import styled from 'styled-components'
import { Navigate, useNavigate } from 'react-router-dom'
import React, { useEffect, useRef, useState } from 'react'
import video from '../static/island.mp4'
import { http } from '../../utils/request'

export default function Login(props) {
  const formRef = useRef(null)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const token = localStorage.getItem('blog-admin-key')
  useEffect(() => {
    if (token) {
      message.warning('您已登录')
      navigate('/home')
    }
  }, [])

  const onFinishDate = async (e, event) => {
    setLoading(true)
    if (e.nickName && e.password) {
      const res = await http.post('/admin/login', e)
      if (res.data.code !== 200) {
        message.error(res.data.msg)
      } else {
        localStorage.setItem('blog-admin-key', JSON.stringify(res.data.data))
        navigate('/home')
      }
    }
    setLoading(false)
  }
  const handlePassword = () => {}
  const handleSubmit = () => {
    formRef.current.submit()
  }

  return (
    <FromContainer>
      <div className="video-background">
        <video autoPlay loop muted>
          <source src={video} type="video/mp4" />
        </video>
      </div>

      <div className="box">
        <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
          <div className="box-avatar">
            <h3>后台管理</h3>
          </div>
          <Form
            name="login"
            ref={formRef}
            initialValues={{
              remember: true,
            }}
            onFinish={(values, event) => onFinishDate(values, event)}>
            <Form.Item
              name="nickName"
              rules={[
                {
                  required: true,
                  message: 'Please input your Username!',
                },
              ]}>
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="请输入用户名"
                name="nickName"
                onChange={(e) => handlePassword(e)}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: '请输入包含大写字母的不小于八位数',
                },
              ]}>
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                name="password"
                placeholder="请输入密码"
                title="请输入包含大写字母的不小于八位数"
                onChange={(e) => handlePassword(e)}
              />
            </Form.Item>

            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <a className="login-form-forgot" href="">
                忘记密码？
              </a>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{ width: '100%' }}>
                登录
              </Button>{' '}
              Or <a href="/">联系管理员</a>
            </Form.Item>
            {/* <div className="box-button">
              <Button className="login-form-button" onClick={handleSubmit}>
                登陆
              </Button>
              Or <a href="/register">注册</a>
            </div> */}
          </Form>
        </Card>
      </div>
    </FromContainer>
  )
}
const FromContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  justify-items: center;

  .video-background {
    overflow: hidden;
    position: fixed;
    right: 0;
    bottom: 0;
    min-width: 100%;
    min-height: 100%;
    z-index: -1;
  }
  .box {
    width: 20%;
    height: 50%;
    .box-button {
      text-align: center;
    }
    .box-avatar {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: auto;
      padding-bottom: 1em;
    }
  }
`
