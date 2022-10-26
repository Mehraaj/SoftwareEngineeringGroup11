create database TrinityFashion;
use TrinityFashion;

create table Visitor(
‘VID’ int, 
primary key(‘VID’)
);

create table Member(
‘VID’ int, 
‘Name’ varchar(50),
‘Address’ varchar(50),
‘State’ varchar(50),
‘ZIP’ int,
‘Phone’ int,
‘CreditCardNo’ int,
‘CreditCardCVV’ int,
‘CreditCardExpiry’ date,
primary key(‘VID’),
foreign key (‘VID’) references Visitor(‘VID’)
);

create table ProductCatalog(
‘PID’ int,
‘Category’ enum("shirts", "pants", "shoes", "hats", "socks"),
‘Name’ varchar(50),
‘Color’ varchar(50),
‘Price’ decimal(9,2),
‘SubCategory’ varchar(50),
primary key(‘PID’)
);

create table Shirts(
‘PID’ int,
‘Size’ enum("XS", "S", "M", "L", "XL"),
primary key(‘PID’),
foreign key(‘PID’) references ProductCatalog(‘PID’)
);

create table Pants(
‘PID’ int,
‘Size’ enum("XS", "S", "M", "L", "XL"),
primary key(‘PID’),
foreign key(‘PID’) references ProductCatalog(‘PID’)
);

create table Shoes(
‘PID’ int,
‘Size’ int,
primary key(‘PID’),
foreign key(‘PID’) references ProductCatalog(‘PID’)
);

create table Socks(
‘PID’ int,
‘Size’ enum("XS", "S", "M", "L", "XL"),
primary key(‘PID’),
foreign key(‘PID’) references ProductCatalog(‘PID’)
);

create table Hats(
‘PID’ int,
‘Size’ enum("XS", "S", "M", "L", "XL"),
primary key(‘PID’),
foreign key(‘PID’) references ProductCatalog(‘PID’)
);

create table Cart(
‘VID’ int,
‘PID’ int,
primary key (‘VID’, ‘PID’),
foreign key(‘VID’) references Visitor(‘VID’),
foreign key(‘PID’) references ProductCatalog(‘PID’)
);


