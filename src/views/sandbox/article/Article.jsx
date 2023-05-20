import {
  Button,
  Modal,
  Spin,
  Result,
  Tag,
  Input,
  Form,
  Select,
  message,
  Card,
  FloatButton,
} from 'antd'
import React, { useState, useEffect, useRef } from 'react'
import { http } from '../../../utils/request'
import styled from 'styled-components'
import WangEditor from './WangEditor'
import { notification } from 'antd'
import { useNavigate, useParams, useLocation } from 'react-router-dom'

export default function Article() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const id = searchParams.get('id')
  const [html, setHtml] = useState('')
  const [categoryList, setCateGoryList] = useState([])
  const [tagList, setTagList] = useState([])
  const [myArticle, setMyArticle] = useState({})
  const [isSuccess, setIsSuccess] = useState(true)
  const formRef = useRef(null)
  const navigate = useNavigate()
  useEffect(() => {
    http.get('admin/category/alls').then((res) => {
      if (res.data.code !== 200) {
        message.error(res.data.msg)
      } else {
        setCateGoryList(res.data.data)
      }
    })
    http.get('admin/tag/alls').then((res) => {
      if (res.data.code !== 200) {
        message.error(res.data.msg)
      } else {
        setTagList(res.data.data)
      }
    })
    return () => {
      setTagList([])
      setCateGoryList([])
      setHtml('')
    }
  }, [])
  useEffect(() => {
    if (id) {
      http.get(`/admin/article/${id}`).then((res) => {
        if (res.data.code !== 200) {
          navigate('error')
        } else {
          setMyArticle(res.data.data)
          formRef.current.setFieldsValue({
            title: res.data.data.title,
            introduction: res.data.data.summary,
            categoryName: res.data.data.category.id,
            tagName: res.data.data.tags?.map((item) => item.id),
          })
        }
      })
    } else {
      setMyArticle({})
      if (formRef.current) {
        formRef.current.resetFields()
      }
    }
    return () => {
      if (formRef.current) {
        formRef.current.resetFields()
      }
    }
  }, [id])
  const optionsCategory = categoryList.map((item) => {
    const categoryItem = {
      label: item.category_name,
      value: item.id,
    }
    return categoryItem
  })
  const options = tagList.map((item) => {
    const tagItem = {
      label: item.tag_Name,
      value: item.id,
    }
    return tagItem
  })
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
    const articleParam = {
      body: {
        content: values.content,
      },
      title: values.title,
      summary: values.introduction,
      category_id: values.categoryName,
      tags: values.tagName?.map((item) => {
        return {
          id: item,
        }
      }),
    }
    if (id) {
      console.log('修改')
      const updateParam = {
        id: id,
        articleBodyVo: {
          content: values.content,
        },
        title: values.title,
        summary: values.introduction,
        category: {
          id: values.categoryName,
        },
        tags: values.tagName?.map((item) => {
          return {
            id: item,
          }
        }),
      }

      http.post('/admin/article/updateArticle', updateParam).then((res) => {
        if (res.data.code == 200) {
          notification.success({ message: '修改成功' })
          setIsSuccess(false)
        }
      })
    } else {
      console.log('发布')
      http.post('/admin/article/add', articleParam).then((res) => {
        if (res.data.code !== 200) {
          notification.error({ message: res.data.msg })
        } else {
          notification.success({ message: '发布成功' })
          setIsSuccess(false)
        }
      })
    }
  }
  const handleCategoryChange = (e) => {
    console.log(e)
  }
  const handleTagChange = (e) => {
    console.log(e)
  }
  const onClick = () => {
    formRef.current.submit()
  }
  const tagRender = (props) => {
    const { label, value, closable, onClose } = props
    const onPreventMouseDown = (event) => {
      event.preventDefault()
      event.stopPropagation()
    }

    return (
      <Tag
        color="orange"
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
  const handelBuy = () => {
    navigate('/admin/write')
  }
  const handelConole = () => {
    navigate('/home')
  }
  return (
    <>
      {isSuccess ? (
        <ArticleBox>
          <div style={{ float: ' right', padding: '25px 25px' }}>
            <FloatButton
              shape="square"
              description="发布"
              type="primary"
              style={{
                right: 54,
                width: '80px',
                height: '40px',
              }}
              onClick={onClick}>
              发布
            </FloatButton>
          </div>
          <Form
            ref={formRef}
            layout="inline"
            name="nest-messages"
            onFinish={onFinish}
            style={{
              maxWidth: 10000,
              padding: '25px 25px',
            }}
            // initialValues={{
            //   title: myArticle.title,
            //   introduction: myArticle.summary,

            // }}
            validateMessages={validateMessages}>
            <Form.Item
              style={{ padding: '20px 0' }}
              name="title"
              label="文章标题"
              rules={[
                {
                  required: true,
                },
              ]}>
              <Input />
            </Form.Item>

            <Form.Item
              style={{ padding: '20px 0' }}
              name="introduction"
              label="文章摘要"
              rules={[
                {
                  required: true,
                },
              ]}>
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              style={{ padding: '20px 0' }}
              name="categoryName"
              label="选择分类"
              rules={[
                {
                  required: true,
                },
              ]}>
              <Select
                style={{
                  width: 180,
                }}
                onChange={handleCategoryChange}
                options={optionsCategory}
              />
            </Form.Item>
            <Form.Item
              name="tagName"
              style={{ padding: '20px 0' }}
              label="选择标签">
              <Select
                onChange={handleTagChange}
                mode="multiple"
                showArrow
                tagRender={tagRender}
                style={{
                  width: 180,
                }}
                options={options}
              />
            </Form.Item>
            <Form.Item
              name="content"
              style={{
                overflow: 'auto',
              }}>
              <Card
                style={{
                  height: '100em',
                  width: '80%',
                }}>
                {/* <EditorCompent
              getDetail={(values) => {
                formRef.current.setFieldsValue({
                  content: values,
                })
              }}></EditorCompent> */}
                {/* <QuillEditor></QuillEditor> */}
                <WangEditor
                  content={
                    Object.keys(myArticle).length === 0
                      ? '<p>请输入内容</p>'
                      : myArticle.articleBodyVo.content
                  }
                  getHtml={(value) => {
                    formRef.current.setFieldsValue({
                      content: value,
                    })
                  }}></WangEditor>
              </Card>
            </Form.Item>
          </Form>
        </ArticleBox>
      ) : (
        <Result
          status="success"
          title="成功上传咯"
          extra={[
            <Button type="primary" key="console" onClick={handelConole}>
              go home
            </Button>,
            <Button key="buy" onClick={handelBuy}>
              Buy Again
            </Button>,
          ]}
        />
      )}
    </>
  )
}
const ArticleBox = styled.div`
  font-size: 2em;
  overflow: auto;
`
