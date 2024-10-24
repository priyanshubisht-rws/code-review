export const getBaseUrl = () => {
    let url;
    switch (process.env.REACT_APP_ENV) {
      case 'production':
        url = process.env.REACT_APP_SERVICE_URL_PROD || '';
        break;
      case 'development':
      default:
        url = process.env.REACT_APP_SERVICE_URL_LOCAL || '';
    }
  
    return url;
  }