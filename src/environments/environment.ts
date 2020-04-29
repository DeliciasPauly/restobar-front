// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
const g = {
  apiHost: 'http://ec2-18-219-138-186.us-east-2.compute.amazonaws.com',
  apiPort: ':3000',
  apiPath: '/api'  
};

export const environment = {
  production: false,
  endpoints: {
    host: g.apiHost,
    port: g.apiPort,
    path: g.apiPath
  }
};
