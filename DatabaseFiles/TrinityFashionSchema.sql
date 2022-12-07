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
ZIP varchar(50),
Phone varchar(50),
CreditCardNo varchar(50),
CreditCardCVV varchar(50),
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
image varchar(150),
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
	(001, "John Doe", "123 Summer St,", "NJ", "00000", "732-555-5555", "1234567891123456", "123", "10/26", "username", "password", null, null),
	(002, "Sean Daley", "147 Niagra Ave,", "NJ", "01225", "908-168-4564", "987654321123456", "456", "12/27", "seanyRonny", "daleybaley", null, null),
	(003, "Humphrey Donald", "12 Proctor Blvd,", "MA", "95648", "708-968-1235", "1643267894620134", "889", "09/25", "HummerPhrey", "McDonRon", null, null),
	(004, "Jenny Longbottom", "918 Saint Johnny St,", "PA", "01345", "988-694-1387", "6011045746987315", "981", "11/25", "JongBottom", "LennyJenny", null, null),
	(005, "Kenny Glover", "23 Farmington Ave,", "TN", "56489", "789-654-1345", "9786431230465795", "498", "05/26", "GloverTheShover", "ken109Glove", null, null);
	


    
Insert into ProductCatalog (PID, Category, Name, Price, SubCategory, gender, image) values
	(101, "Shirts", "Plain Tee", 13.99, "T-Shirt", "male", "./productImages/blackPlainTeeM.jpg"),
    (102, "Pants", "Ruler Straight Jeans", 44.99, "Jeans", "male", "./productImages/blueRulerStraightJeanM.jpg"),
    (103, "Shoes", "Zoomer 7", 29.99, "Sneakers", "male", "./productImages/whiteZoomer7M.jpg"),
    (104, "Hats", "Solid Bold Cap", 19.99, "Baseball Cap", "male", "./productImages/blackBaseBCapM.jpg"),
    (105, "Socks", "Faded Mellow Work Sock", 12.99, "socks", "male", "./productImages/greenFMSockM.jpg"),
    
    (106, "Shirts", "Plain Vee", 11.99, "V-Neck", "male", "./productImages/blackPlainVeeM.jpg"),
    (107, "Pants", "LazyWear SweatPants", 24.99, "Sweatpants", "male", "./productImages/blueLWSweatPantsM.jpg"),
    (108, "Shoes", "Steel Toe Black Smoke Boots", 39.99, "Boots", "male", "./productImages/blackSteelToeBlackSmokeBootsM.jpg"),
    (109, "Hats", "Straw Fidora", 21.99, "Fedora", "male", "./productImages/whiteStrawFidoraM.jpg"),
    (110, "Socks", "Athletic Socks", 19.99, "socks", "male", "./productImages/blueAthleticSockM.jpg"),
    
    (111, "Shirts", "Cotton Crew Neck Crop Top", 21.99, "Crew-Neck", "female", "./productImages/blackCotCrewW.jpg"),
    (112, "Pants", "BootCut Jeans", 19.99, "jeans", "female", "./productImages/blueBootCutJeanW.jpg"),
    (113, "Shoes", "Running/Tennis Shoes", 39.99, "sneakers", "female", "./productImages/whiteRunTenSnekrsW.jpg"),
    (114, "Hats", "Wool Pom Pom hat", 14.99, "hat", "female", "./productImages/whitePomPomHatW.jpg"),
    (115, "Pants", "Performance Leggings", 29.99, "Leggings", "female", "./productImages/bluePerformanceLegW.jpg"),
    
    (116, "Shirts", "Wooly Sweater", 21.99, "Sweater", "female", "./productImages/whiteWoolSwetrW.jpg"),
    (117, "Pants", "Wool Blended Pleat Pants", 89.99, "pants", "female", "./productImages/greenWoolPleatPantsW.jpg"),
    (118, "Shoes", "Pointed Toe Heels", 119.99, "Heels", "female", "./productImages/whitePointedToeHeelsW.jpg"),
    (119, "Hats", "Sherpa Bucket Hat", 26.99, "BucketHat", "female", "./productImages/whiteSherpaBucketHatW.jpg"),
    (120, "Socks", "Fuzzy Festive Snowflake Sock", 4.99, "socks", "female", "./productImages/redFuzzyFestiveSockW.jpg");
    

Insert into Hats (PID, Size, color) values
	(104, "XS", "yellow"),
    (109, "L", "orange");

Insert into Shoes (PID, Size, color) values
	(103, 8, "white"),
    (103, 8.5, "white"),
    (103, 9, "white"),
    (103, 9.5, "white"),
    (103, 10, "white"),
    (103, 10.5, "white"),
    (103, 11, "white"),
    (103, 11.5, "white"),
    (103, 12, "white"),
    (103, 12.5, "white"),
    (103, 8, "black"),
    (103, 8.5, "black"),
    (103, 9, "black"),
    (103, 9.5, "black"),
    (103, 10, "black"),
    (103, 10.5, "black"),
    (103, 11, "black"),
    (103, 11.5, "black"),
    (103, 12, "black"),
    (103, 12.5, "black"),
    
    (108, 7, "red");
    
    

Insert into Pants (PID, Size, color) values
	(102, "L", "green"),
    (107, "M", "red");

Insert into Shirts (PID, Size, color) values
	#PlainTee
    (101, "S", "white"),
    (101, "M", "white"),
    (101, "L", "white"),
    (101, "XL", "white"),
    (101, "S", "black"),
    (101, "M", "black"),
    (101, "L", "black"),
    (101, "XL", "black"),
	(101, "S", "green"),
    (101, "M", "green"),
    (101, "L", "green"),
    (101, "XL", "green"),
    (101, "S", "red"),
    (101, "M", "red"),
    (101, "L", "red"),
    (101, "XL", "red"),
    
    
    (106, "XL", "blue"),
    
    
    #CottonCrewNeck
    (111, "S", "black"),
    (111, "M", "black"),
    (111, "L", "black"),
    (111, "XL", "black"),
    (111, "S", "white"),
    (111, "M", "white"),
    (111, "L", "white"),
	(111, "XL", "white");
    
Insert into Socks (PID, Size, color) values
	(105, "S", "black"),
    (110, "M", "blue");
    
Insert into Cart (VID, PID, Size, color) values
	(001, 101, "S", "white"),
    (001, 102, "L", "green"),
    (001, 105, "S", "black" ),
    (002, 106, "XL", "blue"),
    (002, 107, "M", "red");
    