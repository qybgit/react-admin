import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { IEditorConfig } from '@wangeditor/editor'
import React, { useState, useEffect } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { notification } from 'antd'
export default function WangEditor({ getHtml, content }) {
  const [editor, setEditor] = useState(null)
  const [html, setHtml] = useState(content)
  const tokenE = localStorage.getItem('blog-admin-key')
  useEffect(() => {
    setHtml(content)
    return () => {
      setHtml(null)
    }
  }, [content])
  let Token = null
  if (tokenE) {
    const { token } = JSON.parse(tokenE)
    Token = token
  }
  const [image, setImage] = useState({
    src: null,
    url: null,
    alt: '',
    href: '',
  })
  const toolbarConfig = {}
  const editorConfig = {
    // JS 语法
    placeholder: '请输入内容...',
    MENU_CONF: {},
  }
  editorConfig.MENU_CONF['uploadImage'] = {
    fieldName: 'image',
    server: 'http://localhost:8082/upload',
    maxFileSize: 20 * 1024 * 1024,
    maxNumberOfFiles: 10,
    allowedFileTypes: ['image/*'],
    meta: {
      Authorization: `Bearer ${Token}`,
    },
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${Token}`,
    },
    timeout: 15 * 1000,
    onBeforeUpload(file) {
      return file
    },
    onProgress(progress) {},
    onSuccess(file, res) {
      const imageUrl = res.data.url // 获取后端回传的图片 URL
      const imageAlt = 'top' // 图片的 alt 文本
      const imageHref = 'www.baidu.com' // 图片链接的 URL
      setImage({
        src: image.url,
        url: imageUrl,
        alt: imageAlt,
        href: imageHref,
      })
      notification.success({
        message: `${file.name} 上传成功`,
      })
    },
    onError(file, err, res) {
      notification.error({
        message: `${file.name} 上传出错`,
        err,
        res,
      })
    },
  }
  // 转换图片链接

  function customParseImageSrc(src) {
    // JS 语法
    if (src.indexOf('http') !== 0) {
      return `http://${src}`
    }
    return src
  }
  editorConfig.MENU_CONF['insertImage'] = {
    onInsertedImage(image) {
      // JS 语法
      if (image.url == null) return

      const { src, alt, url, href } = image
    },
    // checkImage: customCheckImageFn, // 也支持 async 函数
    parseImageSrc: customParseImageSrc, // 也支持 async 函数
  }

  useEffect(() => {
    setEditor(editor)

    return () => {
      if (editor == null) return
      editor.destroy()
      setEditor(null)
      setImage(null)
    }
  }, [editor])

  return (
    <>
      <div style={{ border: '1px solid #ccc', zIndex: 100, width: '100%' }}>
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
          style={{ borderBottom: '1px solid #ccc' }}
        />
        <div
          onBlur={() => {
            getHtml(editor.getHtml())
          }}>
          <Editor
            value={html}
            defaultConfig={editorConfig}
            onCreated={(editor) => {
              setEditor(editor)
            }}
            onChange={(editor) => setHtml(editor.getHtml())}
            mode="default"
            style={{ height: '500px', overflowY: 'hidden' }}
            onBlur={() => {}}
          />
        </div>
      </div>
      <div style={{ marginTop: '15px' }}>{html}</div>
    </>
  )
}
