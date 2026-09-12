import React from 'react';
import HeaderComponent from "./pages/shared/HeaderComponent";
import FooterComponent from "./pages/shared/FooterComponent";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
        return (
            <div className="fdashboard-container">
              <HeaderComponent userData={null} />
              <main className="main-content">
                  <div>
                    <h3>Unexpected error occurred. Please try again after sometime or contact administrator.</h3>
                  </div>
              </main>
              <FooterComponent />
            </div>
        );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;