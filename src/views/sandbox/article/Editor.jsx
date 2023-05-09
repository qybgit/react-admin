import React, { useState } from 'react'
import draftToHtml from 'draftjs-to-html'
import { EditorState, convertToRaw } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { useEffect } from 'react'
import styled from 'styled-components'
import { http } from '../../../utils/request'

export default function EditorCompent({ getDetail }) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const [uploadedImages, setUploadedImages] = useState([])
  const handleUpload = () => {
    console.log('aser')
  }
  const uploadImageCallBack = async (file) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await http.post('/api/upload', formData)
      if (response.status === 200) {
        return { data: { link: response.data.url } }
      }
    } catch (error) {
      console.error(error)
      throw new Error('上传图片失败')
    }
  }
  const _uploadImageCallBack = (file) => {
    // long story short, every time we upload an image, we
    // need to save it to the state so we can get it's data
    // later when we decide what to do with it.

    // Make sure you have a uploadImages: [] as your default state
    let newImages = uploadedImages

    const imageObject = {
      file: file,
      localSrc: URL.createObjectURL(file),
    }

    newImages.push(imageObject)

    setUploadedImages(newImages)

    // We need to return a promise with the image src
    // the img src we will use here will be what's needed
    // to preview it in the browser. This will be different than what
    // we will see in the index.md file we generate.
    return new Promise((resolve, reject) => {
      resolve({ data: { link: imageObject.localSrc } })
    })
  }

  return (
    <>
      <EditorBox>
        <Editor
          editorState={editorState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={(editorState) => setEditorState(editorState)}
          onBlur={() => {
            getDetail(
              draftToHtml(convertToRaw(editorState.getCurrentContent()))
            )
          }}
          toolbar={{
            inline: { inDropdown: true },
            list: { inDropdown: true },
            textAlign: { inDropdown: true },
            link: { inDropdown: true },
            history: { inDropdown: true },
            image: { uploadCallback: _uploadImageCallBack },
            inputAccept:
              'application/pdf,text/plain,application/vnd.openxmlformatsofficedocument.wordprocessingml.document,application/msword,application/vnd.ms-excel',
          }}></Editor>
      </EditorBox>

      <textarea
        disabled
        value={draftToHtml(
          convertToRaw(editorState.getCurrentContent())
        )}></textarea>
    </>
  )
}
const EditorBox = styled.div``
