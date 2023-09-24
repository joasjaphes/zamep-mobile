import Axios from 'axios';
import { QueryClient } from 'react-query';
import Constants from 'expo-constants';
import base64 from 'react-native-base64';

const { baseURL } = Constants.manifest.extra;

const axios = Axios.create({
  baseURL,
  headers: {
    accept: '*/*',
    'Content-Type': 'application/json',
  },
});

let username;
let password;

/**
 *
 * @param {object} options
 * @returns {Promise<*|object>}
 */
async function query({
  config, body = {}, pageParam,
}) {
  try {
    const { method = 'GET', endpoint = '', headers = {} } = config;

    const params = method === 'GET' ? body : undefined;

    if (method === 'GET' && pageParam) {
      params.start = (pageParam - 1) * 10;
      params.pageSize = 10;
    }

    const { data } = await axios({
    // headers: { 'Authorization': `Bearer ${token}` },
      headers: {
        Authorization: username && password ? `Basic ${base64.encode(`${username}:${password}`)}` : undefined,
        ...headers,
      },
      method,
      url: endpoint,
      data: method !== 'GET' && Object.keys(body).length ? body : undefined,
      params,
      withCredentials: true,
    });

    return data;
  } catch (error) {
    return error?.response?.data ?? null;
  }
}

/**
 * Define a default query function that will receive the query key
 * the queryKey is guaranteed to be an Array here
 * @param {object} props
 * @param {Array} props.queryKey
 * @returns {Promise<*|object>}
 */
export async function defaultQueryFn({ queryKey, pageParam = 1 }) {
  // queryKey[0] = name
  // queryKey[1] = axios config object
  const {
    method = 'GET', endpoint = '', body, headers = {},
  } = queryKey[1];

  const config = { method, endpoint, headers };

  const data = await query({
    config, body, pageParam,
  });

  return data;
}

/**
 * Define a default mutation function that will receive the mutation variables
 * the mutateKey is to be an Array here as per project structure
 * @param {Array} mutateKey
 * @returns {Promise<*|object>}
 */
export async function defaultMutateFn(mutateKey) {
  // body = mutateKey[0]
  // config = axios config object = mutateKey[1]
  const config = mutateKey[1];
  const body = mutateKey[0];

  const data = await query({ config, body });

  if (config?.endpoint === 'login' && data?.can_login) {
    username = body.username;
    password = body.password;
  }

  return data;
}

// provide the default query function to your app with defaultOptions
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
      retry: 3,
      retryDelay: 3000,
      getNextPageParam: (lastPage, pages) => {
        if (pages.length && lastPage?.length < 10) {
          return undefined;
        }
        return pages.length + 1;
      },
      // onSuccess:
      // onError:
    },
    mutations: {
      mutationFn: defaultMutateFn,
    },
  },
});

export default queryClient;
