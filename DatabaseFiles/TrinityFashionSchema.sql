drop database if exists TrinityFashion;
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
APIKey varchar(50), 
APIKeyDate varchar(100), 
primary key(VID),
foreign key (VID) references Visitor(VID)
);

create table ProductCatalog(
PID int,
Category enum("shirts", "pants", "shoes", "hats", "socks"),
Name varchar(50),
Price decimal(9,2),
SubCategory varchar(50),
gender varchar(50),
primary key(PID)
);

create table Shirts(
PID int,
Size varchar(50),
color varchar(50),
primary key(PID, Size, color),
foreign key(PID) references ProductCatalog(PID)
);

create table Pants(
PID int,
Size varchar(50),
color varchar(50),
primary key(PID, Size, color),
foreign key(PID) references ProductCatalog(PID)
);

create table Shoes(
PID int,
Size varchar(50),
color varchar(50),
primary key(PID, Size, color),
foreign key(PID) references ProductCatalog(PID)
);

create table Socks(
PID int,
Size varchar(50),
color varchar(50),
primary key(PID, Size, color),
foreign key(PID) references ProductCatalog(PID)
);

create table Hats(
PID int,
Size varchar(50),
color varchar(50),
primary key(PID, Size, color),
foreign key(PID) references ProductCatalog(PID)
);

create table Cart(
VID int,
PID int,
Size varchar(50),
color varchar(50), 
primary key (VID, PID, Size, color),
foreign key(VID) references Visitor(VID),
foreign key(PID) references ProductCatalog(PID) 
);

create table Orders( 
VID int, 
PID int,
color varchar(50), 
Size varchar(50),
quantity int, 
orderNumber int, 
state varchar(50),
primary key(VID, PID, color, Size, orderNumber), 
foreign key(VID) references Visitor(VID), 
foreign key(PID) references productCatalog(PID) 
) ;
##############################################################################################################
Insert into Visitor (VID) values
	(001),
	(002),
    (003),
    (004), 
    (005);
    
Insert into Member (VID, Name, Address, State, ZIP, Phone, CreditCardNo, CreditCardCVV, CreditCardExpiry, username, password, APIKey, APIKeyDate) values
	(001, "John Doe", "123 Summer St,", "NJ", 00000, "732-555-5555", 123456789, 123, "10/26", "username", "password", null, null);
    
    
Insert into ProductCatalog (PID, Category, Name, Price, SubCategory, gender) values
	(101, "Shirts", "Yellow T-Shirt", 13.99, "T-Shirt", "men"),
    (102, "Pants", "Yellow Pants", 13.99, "Jeans", "female"),
    (103, "Shoes", "Yellow Shoes", 13.99, "Sneakers", "male"),
    (104, "Hats", "Yellow Hat", 13.99, "Baseball Cap", "female"),
    (105, "Socks", "Yellow Socks", 13.99, "ankle socks", "male"),
    (106, "Shirts", "Orange Shirt", 13.99, "V-Neck", "male"),
    (107, "Pants", "Orange Pants", 13.99, "Slacks", "female"),
    (108, "Shoes", "Orange Shoes", 13.99, "Boots", "male"),
    (109, "Hats", "Orange Hat", 13.99, "Fedora", "female"),
    (110, "Socks", "Orange", 13.99, "Leggings", "male");
    
Insert into Hats (PID, Size, color) values
	(104, "XS", "yellow"),
    (109, "L", "orange");

Insert into Shoes (PID, Size, color) values
	(103, 10, "blue"),
    (108, 7, "red");

Insert into Pants (PID, Size, color) values
	(102, "L", "green"),
    (107, "M", "red");

Insert into Shirts (PID, Size, color) values
	(101, "S", "orange"),
    (101, "M", "yellow"),
    (106, "XL", "blue");

Insert into Socks (PID, Size, color) values
	(105, "S", "black"),
    (110, "M", "blue");
    
Insert into Cart (VID, PID, Size, color) values
	(001, 101, "S", "orange"),
    (001, 102, "L", "green"),
    (001, 105, "S", "black" ),
    (002, 106, "XL", "blue"),
    (002, 107, "M", "red");
