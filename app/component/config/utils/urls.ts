let backendBaseUrl : any = undefined;
let backendBaseSocketUrl : any = undefined;

if (process.env.NODE_ENV === "production") {
  backendBaseUrl = process.env.REACT_APP_PROD_BACKEND_BASE_URL;
} else {
  backendBaseUrl = process.env.REACT_APP_DEV_BACKEND_BASE_URL;
}

if (process.env.NODE_ENV === "production") {
    backendBaseSocketUrl = process.env.REACT_APP_PROD_BACKEND_BASE_URL_FOR_SOCKET;
  } else {
    backendBaseSocketUrl = process.env.REACT_APP_DEV_BACKEND_BASE_URL_FOR_SOCKET;
  }

export {backendBaseUrl, backendBaseSocketUrl};
