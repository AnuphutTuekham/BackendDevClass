import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { productApp } from './product/index.js';
import userRoute from './user/index.js';
import db from './db/index.js';


const app = new Hono();

app.route('/api/products', productApp);
app.route('/api/users', userRoute);
app.route('/api/roles', userRoute);

serve({ fetch: app.fetch, port: 3000 });
console.log('Server is running on http://localhost:3000');
