import { Navigate } from 'react-router-dom'
//在 <AuthRoute></AuthRoute> 中包含的子组件是通过 AuthRoute 组件的 props 对象来传递给 AuthRoute 函数的。
//具体来说，当你在 JSX 中写 <AuthRoute>...</AuthRoute> 时，React 会将这个标签转换成函数调用 AuthRoute(props)，
//其中 props 包含了组件中所有的属性。因此，AuthRoute 函数中的子组件可以通过 props 对象的 children 属性来访问。
function AuthRoute ({ children }) {
  const isToken = localStorage.getItem("blog-admin-key")

  if (!isToken) {
    return <Navigate to="/admin/login" replace />

  }
  else {
    return <>{children}</>



  }
}
export { AuthRoute }