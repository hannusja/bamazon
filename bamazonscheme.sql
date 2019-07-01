DROP DATABASE IF EXISTS bamazonDB;
CREATE database bamazonDB;

USE bamazonDB;

CREATE TABLE products (
  item_id INT NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price DECIMAL(10,4) NULL,
  stock_quantity INT NULL,
  product_sales INT NULL,
  PRIMARY KEY (item_id)
);

CREATE TABLE departments (
  department_id INT NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  over_head_costs INT NOT NULL,
  PRIMARY KEY (department_id)
);