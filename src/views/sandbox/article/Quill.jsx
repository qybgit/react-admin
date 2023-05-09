import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
export default function QuillEditor() {
  const [value, setValue] = useState('')
  const handel = (e) => {
    console.log(e)
    setValue(e)
  }
  const handleImageUpload = async () => {}

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'align',
  ]
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [
          { list: 'ordered' },
          { list: 'bullet' },
          { indent: '-1' },
          { indent: '+1' },
        ],
        [{ align: [] }],
        ['link', 'image'],
        ['clean'],
      ],
      handlers: {
        image: handleImageUpload,
      },
    },
  }
  return (
    <>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={handel}
        formats={formats}
        modules={modules}
      />
    </>
  )
}
