import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Result, Button } from 'antd'
export default function Error() {
  const navigate = useNavigate()
  return (
    <Result
      status="500"
      title="500"
      subTitle="Sorry, something went wrong."
      extra={
        <Button
          type="primary"
          onClick={() => {
            navigate('/home')
          }}>
          Back Home
        </Button>
      }
    />
  )
}
