import {
  Space,
  Button,
  Modal,
  InputNumber,
  Spin,
  Tag,
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
import Editor from './Editor'

export default function Article() {
  const options = [
    {
      value: 'gold',
    },
    {
      value: 'lime',
    },
    {
      value: 'green',
    },
    {
      value: 'cyan',
    },
  ]
  /* eslint-disable no-template-curly-in-string */
  const validateMessages = {
    required: '${label} is required!',
    types: {
      email: '${label} is not a valid email!',
      number: '${label} is not a valid number!',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  }
  /* eslint-enable no-template-curly-in-string */

  const onFinish = (values) => {
    console.log(values)
  }
  const tagRender = (props) => {
    const { label, value, closable, onClose } = props
    const onPreventMouseDown = (event) => {
      event.preventDefault()
      event.stopPropagation()
    }
    return (
      <Tag
        color={value}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{
          marginRight: 3,
        }}>
        {label}
      </Tag>
    )
  }
  return (
    <ArticleBox>
      <Form
        layout="inline"
        name="nest-messages"
        onFinish={onFinish}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxWidth: 1000,
          padding: '25px 25px',
        }}
        validateMessages={validateMessages}>
        <Form.Item
          name={['user', 'name']}
          label="文章标题"
          rules={[
            {
              required: true,
            },
          ]}>
          <Input />
        </Form.Item>

        <Form.Item name={['user', 'introduction']} label="文章摘要">
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="选择分类">
          <Select
            style={{
              width: 180,
            }}
            // onChange={handleSelectChange}
            // options={options}
          />
        </Form.Item>
        <Form.Item label="选择标签">
          <Select
            mode="multiple"
            showArrow
            tagRender={tagRender}
            defaultValue={['gold', 'cyan']}
            style={{
              width: '100%',
            }}
            options={options}
          />
        </Form.Item>
        <Form.Item>
          <Editor></Editor>
        </Form.Item>
        <Button type="primary" htmlType="submit" style={{ float: 'right' }}>
          Submit
        </Button>
      </Form>
    </ArticleBox>
  )
}
const ArticleBox = styled.div`
  font-size: 2em;
  display: flex;
`
