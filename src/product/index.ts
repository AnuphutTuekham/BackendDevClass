
import { Hono } from 'hono';
const productApp = new Hono();



interface Product {
  id: number;
  code: string;
  name: string;
  price: number;
  cost: number;
  note?: string;
}
 

let products: Product[] = [
  {
    id: 1,
    code: '10001',
    name: 'ปากกาลูกลื่นสีน้ำเงิน',
    price: 15.0,
    cost: 8.5,
    note: 'ปากกาตราม้า'
  },
  {
    id: 2,
    code: '10002',
    name: 'สมุดโน้ตปกแข็ง',
    price: 35.0,
    cost: 20.0,
    note: 'มีเส้น'
  }
];
let nextId = 3;
 
// GET /api/products - ดึงข้อมูลทั้งหมด
productApp.get('/', (c) => {
  // รวม mockup กับ products ที่ถูก POST เข้ามา
  const mockProducts: Product[] = [
    {
      id: 101,
      code: '55555',
      name: 'กระเป๋าผ้าแคนวาส',
      price: 120.0,
      cost: 60.0,
      note: 'สินค้ารักษ์โลก'
    },
    {
      id: 102,
      code: '88888',
      name: 'ขวดน้ำสแตนเลส',
      price: 250.0,
      cost: 120.0,
      note: 'เก็บความเย็นได้นาน'
    }
  ];

  const allProducts = [...mockProducts, ...products];
  return c.json({
    data: allProducts
  });
});
 

productApp.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const errors: string[] = [];
 
    // --- Validation Logic ---
   
    // 1. ตรวจสอบรหัสสินค้า (ต้องเป็นเลข 5 หลัก)
    const codeStr = String(body.code || '');
    if (!/^\d{5}$/.test(codeStr)) {
      errors.push("รหัสสินค้าต้องเป็นตัวเลขความยาว 5 ตัวอักษร");
    }
 
    // 2. ตรวจสอบชื่อสินค้า (ความยาวไม่น้อยกว่า 5)
    if (!body.name || typeof body.name !== 'string' || body.name.length < 5) {
      errors.push("ชื่อสินค้าต้องมีความยาวไม่น้อยกว่า 5 ตัวอักษร");
    }
 
    // 3. ตรวจสอบราคาขาย (ต้องเป็นตัวเลข)
    if (typeof body.price !== 'number' || isNaN(body.price)) {
      errors.push("ราคาขายต้องเป็นตัวเลข");
    }
 
    // 4. ตรวจสอบต้นทุน (ต้องเป็นตัวเลข)
    if (typeof body.cost !== 'number' || isNaN(body.cost)) {
      errors.push("ต้นทุนต้องเป็นตัวเลข");
    }
 
    // ถ้ามี Error แม้แต่ข้อเดียว ให้ส่งกลับ 400 Bad Request
    if (errors.length > 0) {
      return c.json({
        status: 'error',
        message: 'ข้อมูลไม่ถูกต้อง',
        errors: errors
      }, 400);
    }

    const newProduct: Product = {
      id: nextId++,
      code: codeStr,
      name: body.name,
      price: body.price,
      cost: body.cost,
      note: body.note || ""
    };
 
    products.push(newProduct);
 
    return c.json({
      status: 'success',
      message: "สร้างสินค้าใหม่สำเร็จ",
      data: newProduct
    }, 201);
 
  } catch (error) {
    return c.json({ status: 'error', message: "รูปแบบข้อมูล JSON ไม่ถูกต้อง" }, 400);
  }
});

export { productApp };
