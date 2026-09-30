import { Component } from "react"

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo)
    this.setState({ errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-bold text-red-700 mb-2">
              页面渲染出错
            </h2>
            <p className="text-sm text-red-600 mb-3">
              {this.state.error?.message || "未知错误"}
            </p>
            {process.env.NODE_ENV === "development" && this.state.errorInfo && (
              <pre className="text-xs text-red-500 bg-red-50 overflow-auto max-h-60 p-3 rounded border border-red-100">
                {this.state.errorInfo.componentStack}
              </pre>
            )}
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null, errorInfo: null })
                window.location.reload()
              }}
              className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
            >
              重新加载
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
