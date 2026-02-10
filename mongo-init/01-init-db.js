// Initialize database with sample schema and data
db = db.getSiblingDB('ai_agent_db');

// Create collections
db.createCollection('products');
db.createCollection('customers');
db.createCollection('orders');

// Insert sample products data
db.products.insertMany([
  {
    _id: ObjectId(),
    product_id: "PROD001",
    name: "Laptop Pro 15",
    category: "Electronics",
    description: "High-performance laptop with 15-inch display, 16GB RAM, and 512GB SSD. Perfect for developers and content creators.",
    price: 1299.99,
    stock: 45,
    specs: {
      brand: "TechCorp",
      processor: "Intel i7",
      ram: "16GB",
      storage: "512GB SSD",
      display: "15.6 inch Full HD"
    },
    tags: ["laptop", "electronics", "computers", "work"]
  },
  {
    _id: ObjectId(),
    product_id: "PROD002",
    name: "Wireless Mouse",
    category: "Accessories",
    description: "Ergonomic wireless mouse with precision tracking and long battery life. Compatible with all major operating systems.",
    price: 29.99,
    stock: 150,
    specs: {
      brand: "TechCorp",
      type: "Wireless",
      dpi: "2400",
      battery_life: "12 months"
    },
    tags: ["mouse", "accessories", "wireless", "ergonomic"]
  },
  {
    _id: ObjectId(),
    product_id: "PROD003",
    name: "4K Monitor 27\"",
    category: "Electronics",
    description: "Ultra HD 4K monitor with IPS panel, HDR support, and built-in speakers. Ideal for graphic design and video editing.",
    price: 449.99,
    stock: 32,
    specs: {
      brand: "DisplayMax",
      resolution: "3840x2160",
      panel_type: "IPS",
      refresh_rate: "60Hz",
      size: "27 inch"
    },
    tags: ["monitor", "display", "4k", "electronics"]
  },
  {
    _id: ObjectId(),
    product_id: "PROD004",
    name: "Mechanical Keyboard",
    category: "Accessories",
    description: "RGB mechanical keyboard with customizable switches and programmable keys. Features aluminum frame and USB-C connection.",
    price: 159.99,
    stock: 78,
    specs: {
      brand: "KeyMaster",
      switch_type: "Cherry MX Blue",
      backlight: "RGB",
      connection: "USB-C"
    },
    tags: ["keyboard", "mechanical", "gaming", "rgb"]
  },
  {
    _id: ObjectId(),
    product_id: "PROD005",
    name: "USB-C Hub",
    category: "Accessories",
    description: "Multi-port USB-C hub with HDMI, USB 3.0, SD card reader, and power delivery. Perfect for modern laptops.",
    price: 49.99,
    stock: 200,
    specs: {
      brand: "ConnectPlus",
      ports: "7-in-1",
      hdmi_support: "4K@30Hz",
      power_delivery: "100W"
    },
    tags: ["hub", "usb-c", "adapter", "accessories"]
  }
]);

// Insert sample customers data
db.customers.insertMany([
  {
    _id: ObjectId(),
    customer_id: "CUST001",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    phone: "+1-555-0101",
    address: {
      street: "123 Main St",
      city: "San Francisco",
      state: "CA",
      zip: "94102",
      country: "USA"
    },
    join_date: new Date("2024-01-15"),
    loyalty_points: 350
  },
  {
    _id: ObjectId(),
    customer_id: "CUST002",
    name: "Bob Smith",
    email: "bob.smith@example.com",
    phone: "+1-555-0102",
    address: {
      street: "456 Oak Ave",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "USA"
    },
    join_date: new Date("2024-03-22"),
    loyalty_points: 120
  },
  {
    _id: ObjectId(),
    customer_id: "CUST003",
    name: "Carol White",
    email: "carol.white@example.com",
    phone: "+1-555-0103",
    address: {
      street: "789 Pine Rd",
      city: "Austin",
      state: "TX",
      zip: "73301",
      country: "USA"
    },
    join_date: new Date("2023-11-05"),
    loyalty_points: 580
  }
]);

// Insert sample orders data
db.orders.insertMany([
  {
    _id: ObjectId(),
    order_id: "ORD001",
    customer_id: "CUST001",
    order_date: new Date("2024-12-01"),
    status: "delivered",
    items: [
      { product_id: "PROD001", quantity: 1, price: 1299.99 },
      { product_id: "PROD002", quantity: 1, price: 29.99 }
    ],
    total_amount: 1329.98,
    shipping_address: {
      street: "123 Main St",
      city: "San Francisco",
      state: "CA",
      zip: "94102",
      country: "USA"
    }
  },
  {
    _id: ObjectId(),
    order_id: "ORD002",
    customer_id: "CUST002",
    order_date: new Date("2024-12-15"),
    status: "shipped",
    items: [
      { product_id: "PROD003", quantity: 1, price: 449.99 },
      { product_id: "PROD004", quantity: 1, price: 159.99 }
    ],
    total_amount: 609.98,
    shipping_address: {
      street: "456 Oak Ave",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "USA"
    }
  },
  {
    _id: ObjectId(),
    order_id: "ORD003",
    customer_id: "CUST003",
    order_date: new Date("2025-01-10"),
    status: "processing",
    items: [
      { product_id: "PROD005", quantity: 2, price: 49.99 },
      { product_id: "PROD002", quantity: 1, price: 29.99 }
    ],
    total_amount: 129.97,
    shipping_address: {
      street: "789 Pine Rd",
      city: "Austin",
      state: "TX",
      zip: "73301",
      country: "USA"
    }
  }
]);

print('✅ Database initialized with sample data');
print('Collections created: products, customers, orders');
print('Sample records inserted successfully');
