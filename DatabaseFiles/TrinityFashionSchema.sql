create database TrinityFashion;
use TrinityFashion;

create table Visitor(
VID int, 
primary key(VID)
);

create table Member(
VID int, 
username varchar (50),
password varchar(50),
Name varchar(50),
Address varchar(50),
State varchar(50),
ZIP int,
Phone varchar(50),
CreditCardNo int,
CreditCardCVV int,
CreditCardExpiry varchar(50),
primary key(VID),
foreign key (VID) references Visitor(VID)
);

create table ProductCatalog(
PID int,
Category enum("shirts", "pants", "shoes", "hats", "socks"),
Name varchar(50),
Color varchar(50),
Price decimal(9,2),
SubCategory varchar(50),
primary key(PID)
);

create table Shirts(
PID int,
Size enum("XS", "S", "M", "L", "XL"),
primary key(PID),
foreign key(PID) references ProductCatalog(PID)
);

create table Pants(
PID int,
Size enum("XS", "S", "M", "L", "XL"),
primary key(PID),
foreign key(PID) references ProductCatalog(PID)
);

create table Shoes(
PID int,
Size int,
primary key(PID),
foreign key(PID) references ProductCatalog(PID)
);

create table Socks(
PID int,
Size enum("XS", "S", "M", "L", "XL"),
primary key(PID),
foreign key(PID) references ProductCatalog(PID)
);

create table Hats(
PID int,
Size enum("XS", "S", "M", "L", "XL"),
primary key(PID),
foreign key(PID) references ProductCatalog(PID)
);

create table Cart(
VID int,
PID int,
primary key (VID, PID),
foreign key(VID) references Visitor(VID),
foreign key(PID) references ProductCatalog(PID)
);

##############################################################################################################
Insert into Visitor (VID) values
	(001),
	(002),
    (003),
    (004), 
    (005);
    
Insert into Member (VID, Name, Address, State, ZIP, Phone, CreditCardNo, CreditCardCVV, CreditCardExpiry, username, password) values
	(001, "John Doe", "123 Summer St,", "NJ", 00000, "732-555-5555", 123456789, 123, "10/26", "username", "password");
    
Insert into ProductCatalog (PID, Category, Name, Price, SubCategory, Color) values
	(101, "Shirts", "Yellow T-Shirt", 13.99, "T-Shirt", "Yellow"),
    (102, "Pants", "Yellow Pants", 13.99, "Jeans", "Yellow"),
    (103, "Shoes", "Yellow Shoes", 13.99, "Sneakers", "Yellow"),
    (104, "Hats", "Yellow Hat", 13.99, "Baseball Cap", "Yellow"),
    (105, "Socks", "Yellow Socks", 13.99, "ankle socks", "Yellow"),
    (106, "Shirts", "Orange Shirt", 13.99, "V-Neck", "Orange"),
    (107, "Pants", "Orange Pants", 13.99, "Slacks", "Orange"),
    (108, "Shoes", "Orange Shoes", 13.99, "Boots", "Orange"),
    (109, "Hats", "Orange Hat", 13.99, "Fedora", "Orange"),
    (110, "Socks", "Orange", 13.99, "Leggings", "Orange");
    
Insert into Hats (PID, Size) values
	(104, "XS"),
    (109, "L");

Insert into Shoes (PID, Size) values
	(103, 10),
    (108, 7);

Insert into Pants (PID, Size) values
	(102, "L"),
    (107, "M");

Insert into Shirts (PID, Size) values
	(101, "S"),
    (106, "XL");

Insert into Socks (PID, Size) values
	(105, "S"),
    (110, "M");
    
Insert into Cart (VID, PID) values
	(001, 101),
    (001, 102),
    (001, 105),
    (002, 106),
    (002, 107),
    (003, 110);

	
