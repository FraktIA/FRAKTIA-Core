import axios, { AxiosInstance } from "axios";

// Create a custom Axios instance with retry mechanism
export const createRetryAxios = (baseURL?: string): AxiosInstance => {
  const instance = axios.create({
    baseURL: baseURL || "https://app.fraktia.ai/api",
    timeout: 15000,
    headers: {
      "Content-Type": "application/json",
    },
    validateStatus: (status) => status < 500,
  });

  // Add request interceptor for logging
  instance.interceptors.request.use(
    (config) => {
      // console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    },
    (error) => {
      console.error("Request interceptor error:", error);
      return Promise.reject(error);
    }
  );

  // Add response interceptor with retry logic
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const config = error.config;

      // Initialize retry count if not exists
      if (!config._retryCount) {
        config._retryCount = 0;
      }

      const maxRetries = 3;
      const shouldRetry = config._retryCount < maxRetries;

      // Check if error is retryable
      const isRetryableError =
        error.code === "ETIMEDOUT" ||
        error.code === "ENOTFOUND" ||
        error.code === "ECONNRESET" ||
        error.code === "ECONNABORTED" ||
        (error.response && error.response.status >= 500);

      if (shouldRetry && isRetryableError) {
        config._retryCount += 1;
        const delay = config._retryCount * 3000; // Exponential backoff

        console.log(
          `Retry attempt ${config._retryCount}/${maxRetries} for ${
            config.url
          } after ${delay}ms (Error: ${error.code || error.response?.status})`
        );

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, delay));

        return instance(config);
      }

      // Log final error after all retries exhausted
      if (config._retryCount >= maxRetries) {
        console.error(
          `All ${maxRetries} retry attempts failed for ${config.url}:`,
          {
            errorCode: error.code,
            status: error.response?.status,
            message: error.message,
          }
        );

        // Add timeout-specific error message for better UX
        if (error.code === "ETIMEDOUT" || error.code === "ECONNABORTED") {
          const timeoutError = new Error(
            "The request timed out after multiple attempts. Please check your internet connection and try again."
          );
          timeoutError.name = "TimeoutError";
          (
            timeoutError as Error & { code?: string; originalError?: unknown }
          ).code = "TIMEOUT_AFTER_RETRIES";
          (
            timeoutError as Error & { code?: string; originalError?: unknown }
          ).originalError = error;
          return Promise.reject(timeoutError);
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// Create default API client for Fraktia API
export const apiClient = createRetryAxios();
