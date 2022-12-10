drop database if exists TrinityFashion;
create database TrinityFashion;
use TrinityFashion;

create table Visitor(
VID varchar(50), 
primary key(VID)
);

create table Member(
VID varchar(50), 
email varchar(100),
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
Category enum('shirts', 'pants', 'shoes', 'hats', 'socks'),
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
image varchar(150),
primary key(PID, Size, color),
foreign key(PID) references ProductCatalog(PID)
);

create table Pants(
PID int,
Size varchar(50),
color varchar(50),
image varchar(150),
primary key(PID, Size, color),
foreign key(PID) references ProductCatalog(PID)
);

create table Shoes(
PID int,
Size varchar(50),
color varchar(50),
image varchar(150),
primary key(PID, Size, color),
foreign key(PID) references ProductCatalog(PID)
);

create table Socks(
PID int,
Size varchar(50),
color varchar(50),
image varchar(150),
primary key(PID, Size, color),
foreign key(PID) references ProductCatalog(PID)
);

create table Hats(
PID int,
Size varchar(50),
color varchar(50),
image varchar(150),
primary key(PID, Size, color),
foreign key(PID) references ProductCatalog(PID)
);

create table Cart(
VID varchar(50),
PID int,
quantity int,
Size varchar(50),
color varchar(50), 
image varchar(150),
primary key (VID, PID, Size, color),
foreign key(VID) references Visitor(VID),
foreign key(PID) references ProductCatalog(PID) 
);

create table Orders( 
VID varchar(50), 
PID int,
quantity int,
color varchar(50), 
Size varchar(50), 
orderNumber varchar(100), 
state varchar(50),
date varchar(100),
transactionId varchar(100),
primary key(VID, PID, color, Size, orderNumber), 
foreign key(VID) references Visitor(VID), 
foreign key(PID) references productCatalog(PID) 
) ;
##############################################################################################################
Insert into Visitor (VID) values
	('001'),
	('002'),
    ('003'),
    ('004'), 
    ('005');
    
Insert into Member (VID, email, Name, Address, State, ZIP, Phone, CreditCardNo, CreditCardCVV, CreditCardExpiry, username, password, APIKey, APIKeyDate) values
	('001', 'John Doe', 'john@gmail.com', '123 Summer St,', 'NJ', '00000', '732-555-5555', '1234567891123456', '123', '10/26', 'username', 'password', null, null),
	('002', 'Sean Daley', 'sean@gmail.com', '147 Niagra Ave,', 'NJ', '01225', '908-168-4564', '987654321123456', '456', '12/27', 'seanyRonny', 'daleybaley', null, null),
	('003', 'Humphrey Donald', 'humphrey@gmail.com', '12 Proctor Blvd,', 'MA', '95648', '708-968-1235', '1643267894620134', '889', '09/25', 'HummerPhrey', 'McDonRon', null, null),
	('004', 'Jenny Longbottom', 'jenny@gmail.com', '918 Saint Johnny St,', 'PA', '01345', '988-694-1387', '6011045746987315', '981', '11/25', 'JongBottom', 'LennyJenny', null, null),
	('005', 'Kenny Glover', 'kenny@gmail.com', '23 Farmington Ave,', 'TN', '56489', '789-654-1345', '9786431230465795', '498', '05/26', 'GloverTheShover', 'ken109Glove', null, null);
	


    
Insert into ProductCatalog (PID, Category, Name, Price, SubCategory, gender, image) values
	('101', 'Shirts', 'Plain Tee', 13.99, 'T-Shirt', 'male', './productImages/whitePlainTeeM.jpg'),
    ('102', 'Pants', 'Ruler Straight Jeans', 44.99, 'Jeans', 'male', './productImages/blueRulerStraightJeanM.jpg'),
    ('103', 'Shoes', 'Zoomer 7', 29.99, 'Sneakers', 'male', './productImages/whiteZoomer7M.jpg'),
    ('104', 'Hats', 'Solid Bold Cap', 19.99, 'Baseball Cap', 'male', './productImages/blueBaseBCapM.jpg'),
    ('105', 'Socks', 'Faded Mellow Work Sock', 12.99, 'socks', 'male', './productImages/greenFMSockM.jpg'),
    
    ('106', 'Shirts', 'Solid V Neck', 11.99, 'V-Neck', 'male', './productImages/redPlainVeeM.jpg'),
    ('107', 'Pants', 'LazyWear SweatPants', 24.99, 'Sweatpants', 'male', './productImages/blueLWSweatPantsM.jpg'),
    ('108', 'Shoes', 'Steel Toe Black Smoke Boots', 39.99, 'Boots', 'male', './productImages/blackSteelToeBlackSmokeBootsM.jpg'),
    ('109', 'Hats', 'Straw Fidora', 21.99, 'Fedora', 'male', './productImages/greenStrawFidoraM.jpg'),
    ('110', 'Socks', 'Athletic Socks', 19.99, 'socks', 'male', './productImages/blueAthleticSockM.jpg'),
    
    ('111', 'Shirts', 'Cotton Crew Neck Crop Top', 21.99, 'Crew-Neck', 'female', './productImages/blackCotCrewW.jpg'),
    ('112', 'Pants', 'BootCut Jeans', 19.99, 'jeans', 'female', './productImages/blueBootCutJeanW.jpg'),
    ('113', 'Shoes', 'Running/Tennis Shoes', 39.99, 'sneakers', 'female', './productImages/redRunTenSnekrsW.jpg'),
    ('114', 'Hats', 'Wool Pom Pom hat', 14.99, 'hat', 'female', './productImages/whitePomPomHatW.jpg'),
    ('115', 'Pants', 'Performance Leggings', 29.99, 'Leggings', 'female', './productImages/bluePerformanceLegW.jpg'),
    
    ('116', 'Shirts', 'Wooly Sweater', 21.99, 'Sweater', 'female', './productImages/greenWoolSwetrW.jpg'),
    ('117', 'Pants', 'Wool Blended Pleat Pants', 89.99, 'pants', 'female', './productImages/greenWoolPleatPantsW.jpg'),
    ('118', 'Shoes', 'Pointed Toe Heels', 119.99, 'Heels', 'female', './productImages/whitePointedToeHeelsW.jpg'),
    ('119', 'Hats', 'Sherpa Bucket Hat', 26.99, 'BucketHat', 'female', './productImages/redSherpaBucketHatW.jpg'),
    ('120', 'Socks', 'Fuzzy Festive Snowflake Sock', 4.99, 'socks', 'female', './productImages/redFuzzyFestiveSockW.jpg'),

    ('121', 'Shirts', 'Striped Hoodie', 19.99, 'Hoodie', 'male', './productImages/redStripedHoodieM.jpg'),
    ('122', 'Pants', 'Striped Active Pants', 29.99, 'pants', 'male', './productImages/blueStripedActivePants.jpg'),
    ('123', 'Shoes', 'Comfy Slides', 15.99, 'slippers', 'male', './productImages/blueComfySlipper.jpg'),
    ('124', 'Hats', 'Ribbed Cuff Beanie', 19.99, 'beanie', 'male', './productImages/greenRCBeanieM.jpg'),
    ('125', 'Socks', 'Soft socks', 7.99, 'socks', 'male', './productImages/whiteSoftSockM.jpg'),

    ('126', 'Shirts', 'Button Up Shirt', 24.99, 'shirt', 'male', './productImages/blueButtonUpShirtM.jpg'),
    ('127', 'Pants', 'Formal Pants', 29.99, 'pants', 'male', './productImages/redFormalPantsM.jpg'),
    ('128', 'Shoes', 'Formal Shoes', 39.99, 'shoes', 'male', './productImages/blackFormalShoesM.jpg'),
    ('129', 'Hats', 'Brim Fidora Hat', 19.99, 'hat', 'male', './productImages/redBrimFidoraM.jpg'),
    ('130', 'Socks', 'Festive Socks', 7.99, 'socks', 'male', './productImages/blueFestiveSockM.jpg'),
    
    ('131', 'Shirts', 'Turtle Neck Sweater', 21.99, 'sweater', 'female', './productImages/greenTurtleNeckSweater.jpg'),
    ('132', 'Pants', 'Fleece Sweatpants', 14.99, 'sweatpants', 'female', './productImages/blueFleeceSweatpant.jpg'),
    ('133', 'Shoes', 'Bubble Loafers', 39.99, 'shoes', 'female', './productImages/blackBubbleLoafersW.jpg'),
    ('134', 'Hats', 'Vintage Bucket Hat', 24.99, 'hat', 'female', './productImages/whiteVintageBucketHat.jpg'),
    ('135', 'Socks', 'Ankle Socks', 4.99, 'socks', 'female', './productImages/whiteAnkleSocksW.jpg');
    

Insert into Hats (PID, Size, color, image) values
    #SolidBoldCapM
    ('104', 'S', 'white', './productImages/whiteBaseBCapM.jpg'),
    ('104', 'M', 'white', './productImages/whiteBaseBCapM.jpg'),
    ('104', 'L', 'white', './productImages/whiteBaseBCapM.jpg'),
    ('104', 'XL', 'white', './productImages/whiteBaseBCapM.jpg'),

    ('104', 'S', 'blue', './productImages/blueBaseBCapM.jpg'),
    ('104', 'M', 'blue', './productImages/blueBaseBCapM.jpg'),
    ('104', 'L', 'blue', './productImages/blueBaseBCapM.jpg'),
    ('104', 'XL', 'blue', './productImages/blueBaseBCapM.jpg'),

    ('104', 'S', 'black', './productImages/blackBaseBCapM.jpg'),
    ('104', 'M', 'black', './productImages/blackBaseBCapM.jpg'),
    ('104', 'L', 'black', './productImages/blackBaseBCapM.jpg'),
    ('104', 'XL', 'black', './productImages/blackBaseBCapM.jpg'),

    #StrawFidoraM
    ('109', 'S', 'white', './productImages/whiteStrawFidoraM.jpg'),
    ('109', 'M', 'white', './productImages/whiteStrawFidoraM.jpg'),
    ('109', 'L', 'white', './productImages/whiteStrawFidoraM.jpg'),
    ('109', 'XL', 'white', './productImages/whiteStrawFidoraM.jpg'),

    ('109', 'S', 'black', './productImages/blackStrawFidoraM.jpg'),
    ('109', 'M', 'black', './productImages/blackStrawFidoraM.jpg'),
    ('109', 'L', 'black', './productImages/blackStrawFidoraM.jpg'),
    ('109', 'XL', 'black', './productImages/blackStrawFidoraM.jpg'),

    ('109', 'S', 'red', './productImages/redStrawFidoraM.jpg'),
    ('109', 'M', 'red', './productImages/redStrawFidoraM.jpg'),
    ('109', 'L', 'red', './productImages/redStrawFidoraM.jpg'),
    ('109', 'XL', 'red', './productImages/redStrawFidoraM.jpg'),

    ('109', 'S', 'green', './productImages/greenStrawFidoraM.jpg'),
    ('109', 'M', 'green', './productImages/greenStrawFidoraM.jpg'),
    ('109', 'L', 'green', './productImages/greenStrawFidoraM.jpg'),
    ('109', 'XL', 'green', './productImages/greenStrawFidoraM.jpg'),

    #WoolPomPomHatW
    ('114', 'S', 'white', './productImages/whitePomPomHatW.jpg'),
    ('114', 'M', 'white', './productImages/whitePomPomHatW.jpg'),
    ('114', 'L', 'white', './productImages/whitePomPomHatW.jpg'),
    ('114', 'XL', 'white', './productImages/whitePomPomHatW.jpg'),

    ('114', 'S', 'black', './productImages/blackPomPomHatW.jpg'),
    ('114', 'M', 'black', './productImages/blackPomPomHatW.jpg'),
    ('114', 'L', 'black', './productImages/blackPomPomHatW.jpg'),
    ('114', 'XL', 'black', './productImages/blackPomPomHatW.jpg'),

    #SherpaBucketHatW
    ('119', 'S', 'red', './productImages/redSherpaBucketHatW.jpg'),
    ('119', 'M', 'red', './productImages/redSherpaBucketHatW.jpg'),
    ('119', 'L', 'red', './productImages/redSherpaBucketHatW.jpg'),
    ('119', 'XL', 'red', './productImages/redSherpaBucketHatW.jpg'),

    ('119', 'S', 'white', './productImages/whiteSherpaBucketHatW.jpg'),
    ('119', 'M', 'white', './productImages/whiteSherpaBucketHatW.jpg'),
    ('119', 'L', 'white', './productImages/whiteSherpaBucketHatW.jpg'),
    ('119', 'XL', 'white', './productImages/whiteSherpaBucketHatW.jpg'),

    #RCBeanieM
    ('124', 'S', 'green', './productImages/greenRCBeanieM.jpg'),
    ('124', 'M', 'green', './productImages/greenRCBeanieM.jpg'),
    ('124', 'L', 'green', './productImages/greenRCBeanieM.jpg'),
    ('124', 'XL', 'green','./productImages/greenRCBeanieM.jpg'),

    ('124', 'S', 'black', './productImages/blackRCBeanieM.jpg'),
    ('124', 'M', 'black', './productImages/blackRCBeanieM.jpg'),
    ('124', 'L', 'black', './productImages/blackRCBeanieM.jpg'),
    ('124', 'XL', 'black', './productImages/blackRCBeanieM.jpg'),

    #BrimFidoraM
    ('129', 'S', 'black', './productImages/blackBrimFidoraM.jpg'),
    ('129', 'M', 'black', './productImages/blackBrimFidoraM.jpg'),
    ('129', 'L', 'black', './productImages/blackBrimFidoraM.jpg'),
    ('129', 'XL', 'black', './productImages/blackBrimFidoraM.jpg'),

    ('129', 'S', 'red', './productImages/redBrimFidoraM.jpg'),
    ('129', 'M', 'red', './productImages/redBrimFidoraM.jpg'),
    ('129', 'L', 'red', './productImages/redBrimFidoraM.jpg'),
    ('129', 'XL', 'red', './productImages/redBrimFidoraM.jpg'),

    ('129', 'S', 'blue', './productImages/blueBrimFidoraM.jpg'),
    ('129', 'M', 'blue', './productImages/blueBrimFidoraM.jpg'),
    ('129', 'L', 'blue', './productImages/blueBrimFidoraM.jpg'),
    ('129', 'XL', 'blue', './productImages/blueBrimFidoraM.jpg'),

    #VintageBucketHat
    ('134', 'S', 'white', './productImages/whiteVintageBucketHat.jpg'),
    ('134', 'M', 'white', './productImages/whiteVintageBucketHat.jpg'),
    ('134', 'L', 'white', './productImages/whiteVintageBucketHat.jpg'),
    ('134', 'XL', 'white', './productImages/whiteVintageBucketHat.jpg'),

    ('134', 'S', 'black', './productImages/blackVintageBucketHat.jpg'),
    ('134', 'M', 'black', './productImages/blackVintageBucketHat.jpg'),
    ('134', 'L', 'black', './productImages/blackVintageBucketHat.jpg'),
    ('134', 'XL', 'black', './productImages/blackVintageBucketHat.jpg');


Insert into Shoes (PID, Size, color, image) values
	#Zoomer7M
    ('103', 8, 'white', './productImages/whiteZoomer7M.jpg'),
    ('103', 8.5, 'white', './productImages/whiteZoomer7M.jpg'),
    ('103', 9, 'white', './productImages/whiteZoomer7M.jpg'),
    ('103', 9.5, 'white', './productImages/whiteZoomer7M.jpg'),
    ('103', 10, 'white', './productImages/whiteZoomer7M.jpg'),
    ('103', 10.5, 'white', './productImages/whiteZoomer7M.jpg'),
    ('103', 11, 'white', './productImages/whiteZoomer7M.jpg'),
    ('103', 11.5, 'white', './productImages/whiteZoomer7M.jpg'),
    ('103', 12, 'white', './productImages/whiteZoomer7M.jpg'),
    ('103', 12.5, 'white', './productImages/whiteZoomer7M.jpg'),

    ('103', 8, 'black', './productImages/blackZoomer7M.jpg'),
    ('103', 8.5, 'black', './productImages/blackZoomer7M.jpg'),
    ('103', 9, 'black', './productImages/blackZoomer7M.jpg'),
    ('103', 9.5, 'black', './productImages/blackZoomer7M.jpg'),
    ('103', 10, 'black', './productImages/blackZoomer7M.jpg'),
    ('103', 10.5, 'black', './productImages/blackZoomer7M.jpg'),
    ('103', 11, 'black', './productImages/blackZoomer7M.jpg'),
    ('103', 11.5, 'black', './productImages/blackZoomer7M.jpg'),
    ('103', 12, 'black', './productImages/blackZoomer7M.jpg'),
    ('103', 12.5, 'black', './productImages/blackZoomer7M.jpg'),
    
    #SteelToeBlackSmokeBootsM
    ('108', 8, 'black', './productImages/blackSteelToeBlackSmokeBootsM.jpg'),
    ('108', 8.5, 'black', './productImages/blackSteelToeBlackSmokeBootsM.jpg'),
    ('108', 9, 'black', './productImages/blackSteelToeBlackSmokeBootsM.jpg'),
    ('108', 9.5, 'black', './productImages/blackSteelToeBlackSmokeBootsM.jpg'),
    ('108', 10, 'black', './productImages/blackSteelToeBlackSmokeBootsM.jpg'),
    ('108', 10.5, 'black', './productImages/blackSteelToeBlackSmokeBootsM.jpg'),
    ('108', 11, 'black', './productImages/blackSteelToeBlackSmokeBootsM.jpg'),
    ('108', 11.5, 'black', './productImages/blackSteelToeBlackSmokeBootsM.jpg'),
    ('108', 12, 'black', './productImages/blackSteelToeBlackSmokeBootsM.jpg'),
    ('108', 12.5, 'black', './productImages/blackSteelToeBlackSmokeBootsM.jpg'),

    #Running/TennisShoesW
    ('113', 8, 'white', './productImages/whiteRunTenSnekrsW.jpg'),
    ('113', 8.5, 'white', './productImages/whiteRunTenSnekrsW.jpg'),
    ('113', 9, 'white', './productImages/whiteRunTenSnekrsW.jpg'),
    ('113', 9.5, 'white', './productImages/whiteRunTenSnekrsW.jpg'),
    ('113', 10, 'white', './productImages/whiteRunTenSnekrsW.jpg'),
    ('113', 10.5, 'white', './productImages/whiteRunTenSnekrsW.jpg'),
    ('113', 11, 'white', './productImages/whiteRunTenSnekrsW.jpg'),
    ('113', 11.5, 'white', './productImages/whiteRunTenSnekrsW.jpg'),
    ('113', 12, 'white', './productImages/whiteRunTenSnekrsW.jpg'),
    ('113', 12.5, 'white', './productImages/whiteRunTenSnekrsW.jpg'),

    ('113', 8, 'red', './productImages/redRunTenSnekrsW.jpg'),
    ('113', 8.5, 'red', './productImages/redRunTenSnekrsW.jpg'),
    ('113', 9, 'red', './productImages/redRunTenSnekrsW.jpg'),
    ('113', 9.5, 'red', './productImages/redRunTenSnekrsW.jpg'),
    ('113', 10, 'red', './productImages/redRunTenSnekrsW.jpg'),
    ('113', 10.5, 'red', './productImages/redRunTenSnekrsW.jpg'),
    ('113', 11, 'red', './productImages/redRunTenSnekrsW.jpg'),
    ('113', 11.5, 'red', './productImages/redRunTenSnekrsW.jpg'),
    ('113', 12, 'red', './productImages/redRunTenSnekrsW.jpg'),
    ('113', 12.5, 'red', './productImages/redRunTenSnekrsW.jpg'),

    #PointedToeHeelsW
    ('118', 8, 'black', './productImages/blackPointedToeHeelsW.jpg'),
    ('118', 8.5, 'black', './productImages/blackPointedToeHeelsW.jpg'),
    ('118', 9, 'black', './productImages/blackPointedToeHeelsW.jpg'),
    ('118', 9.5, 'black', './productImages/blackPointedToeHeelsW.jpg'),
    ('118', 10, 'black', './productImages/blackPointedToeHeelsW.jpg'),
    ('118', 10.5, 'black', './productImages/blackPointedToeHeelsW.jpg'),
    ('118', 11, 'black', './productImages/blackPointedToeHeelsW.jpg'),
    ('118', 11.5, 'black', './productImages/blackPointedToeHeelsW.jpg'),
    ('118', 12, 'black', './productImages/blackPointedToeHeelsW.jpg'),
    ('118', 12.5, 'black', './productImages/blackPointedToeHeelsW.jpg'),
    
    ('118', 8, 'red', './productImages/redPointedToeHeelsW.jpg'),
    ('118', 8.5, 'red', './productImages/redPointedToeHeelsW.jpg'),
    ('118', 9, 'red', './productImages/redPointedToeHeelsW.jpg'),
    ('118', 9.5, 'red', './productImages/redPointedToeHeelsW.jpg'),
    ('118', 10, 'red', './productImages/redPointedToeHeelsW.jpg'),
    ('118', 10.5, 'red', './productImages/redPointedToeHeelsW.jpg'),
    ('118', 11, 'red', './productImages/redPointedToeHeelsW.jpg'),
    ('118', 11.5, 'red', './productImages/redPointedToeHeelsW.jpg'),
    ('118', 12, 'red', './productImages/redPointedToeHeelsW.jpg'),
    ('118', 12.5, 'red', './productImages/redPointedToeHeelsW.jpg'),

    ('118', 8, 'white', './productImages/whitePointedToeHeelsW.jpg'),
    ('118', 8.5, 'white', './productImages/whitePointedToeHeelsW.jpg'),
    ('118', 9, 'white', './productImages/whitePointedToeHeelsW.jpg'),
    ('118', 9.5, 'white', './productImages/whitePointedToeHeelsW.jpg'),
    ('118', 10, 'white', './productImages/whitePointedToeHeelsW.jpg'),
    ('118', 10.5, 'white', './productImages/whitePointedToeHeelsW.jpg'),
    ('118', 11, 'white', './productImages/whitePointedToeHeelsW.jpg'),
    ('118', 11.5, 'white', './productImages/whitePointedToeHeelsW.jpg'),
    ('118', 12, 'white', './productImages/whitePointedToeHeelsW.jpg'),
    ('118', 12.5, 'white', './productImages/whitePointedToeHeelsW.jpg'),

    #ComfySlippers
    ('123', 8, 'black', './productImages/blackComfySlipper.jpg'),
    ('123', 8.5, 'black', './productImages/blackComfySlipper.jpg'),
    ('123', 9, 'black', './productImages/blackComfySlipper.jpg'),
    ('123', 9.5, 'black', './productImages/blackComfySlipper.jpg'),
    ('123', 10, 'black', './productImages/blackComfySlipper.jpg'),
    ('123', 10.5, 'black', './productImages/blackComfySlipper.jpg'),
    ('123', 11, 'black', './productImages/blackComfySlipper.jpg'),
    ('123', 11.5, 'black', './productImages/blackComfySlipper.jpg'),
    ('123', 12, 'black', './productImages/blackComfySlipper.jpg'),
    ('123', 12.5, 'black', './productImages/blackComfySlipper.jpg'),
    
    ('123', 8, 'blue', './productImages/blueComfySlipper.jpg'),
    ('123', 8.5, 'blue', './productImages/blueComfySlipper.jpg'),
    ('123', 9, 'blue', './productImages/blueComfySlipper.jpg'),
    ('123', 9.5, 'blue', './productImages/blueComfySlipper.jpg'),
    ('123', 10, 'blue', './productImages/blueComfySlipper.jpg'),
    ('123', 10.5, 'blue', './productImages/blueComfySlipper.jpg'),
    ('123', 11, 'blue', './productImages/blueComfySlipper.jpg'),
    ('123', 11.5, 'blue', './productImages/blueComfySlipper.jpg'),
    ('123', 12, 'blue', './productImages/blueComfySlipper.jpg'),
    ('123', 12.5, 'blue', './productImages/blueComfySlipper.jpg'),

    #FormalShoesM
    ('128', 8, 'white', './productImages/whiteFormalShoesM.jpg'),
    ('128', 8.5, 'white', './productImages/whiteFormalShoesM.jpg'),
    ('128', 9, 'white', './productImages/whiteFormalShoesM.jpg'),
    ('128', 9.5, 'white', './productImages/whiteFormalShoesM.jpg'),
    ('128', 10, 'white', './productImages/whiteFormalShoesM.jpg'),
    ('128', 10.5, 'white', './productImages/whiteFormalShoesM.jpg'),
    ('128', 11, 'white', './productImages/whiteFormalShoesM.jpg'),
    ('128', 11.5, 'white', './productImages/whiteFormalShoesM.jpg'),
    ('128', 12, 'white', './productImages/whiteFormalShoesM.jpg'),
    ('128', 12.5, 'white', './productImages/whiteFormalShoesM.jpg'),

    ('128', 8, 'black', './productImages/blackFormalShoesM.jpg'),
    ('128', 8.5, 'black', './productImages/blackFormalShoesM.jpg'),
    ('128', 9, 'black', './productImages/blackFormalShoesM.jpg'),
    ('128', 9.5, 'black', './productImages/blackFormalShoesM.jpg'),
    ('128', 10, 'black', './productImages/blackFormalShoesM.jpg'),
    ('128', 10.5, 'black', './productImages/blackFormalShoesM.jpg'),
    ('128', 11, 'black', './productImages/blackFormalShoesM.jpg'),
    ('128', 11.5, 'black', './productImages/blackFormalShoesM.jpg'),
    ('128', 12, 'black', './productImages/blackFormalShoesM.jpg'),
    ('128', 12.5, 'black', './productImages/blackFormalShoesM.jpg'),

    #BubbleLoafersW
    ('133', 8, 'black', './productImages/blackBubbleLoafersW.jpg'),
    ('133', 8.5, 'black', './productImages/blackBubbleLoafersW.jpg'),
    ('133', 9, 'black', './productImages/blackBubbleLoafersW.jpg'),
    ('133', 9.5, 'black', './productImages/blackBubbleLoafersW.jpg'),
    ('133', 10, 'black', './productImages/blackBubbleLoafersW.jpg'),
    ('133', 10.5, 'black', './productImages/blackBubbleLoafersW.jpg'),
    ('133', 11, 'black', './productImages/blackBubbleLoafersW.jpg'),
    ('133', 11.5, 'black', './productImages/blackBubbleLoafersW.jpg'),
    ('133', 12, 'black', './productImages/blackBubbleLoafersW.jpg'),
    ('133', 12.5, 'black', './productImages/blackBubbleLoafersW.jpg'),
    
    ('133', 8, 'blue', './productImages/blueBubbleLoafersW.jpg'),
    ('133', 8.5, 'blue', './productImages/blueBubbleLoafersW.jpg'),
    ('133', 9, 'blue', './productImages/blueBubbleLoafersW.jpg'),
    ('133', 9.5, 'blue', './productImages/blueBubbleLoafersW.jpg'),
    ('133', 10, 'blue', './productImages/blueBubbleLoafersW.jpg'),
    ('133', 10.5, 'blue', './productImages/blueBubbleLoafersW.jpg'),
    ('133', 11, 'blue', './productImages/blueBubbleLoafersW.jpg'),
    ('133', 11.5, 'blue', './productImages/blueBubbleLoafersW.jpg'),
    ('133', 12, 'blue', './productImages/blueBubbleLoafersW.jpg'),
    ('133', 12.5, 'blue', './productImages/blueBubbleLoafersW.jpg');

Insert into Pants (PID, Size, color, image) values
	#RulerStraightJeanM
    ('102', 'S', 'black', './productImages/blackRulerStraightJeanM.jpg'),
    ('102', 'M', 'black', './productImages/blackRulerStraightJeanM.jpg'),
	('102', 'L', 'black', './productImages/blackRulerStraightJeanM.jpg'),
	('102', 'XL', 'black', './productImages/blackRulerStraightJeanM.jpg'),

	('102', 'S', 'blue', './productImages/blueRulerStraightJeanM.jpg'),
    ('102', 'M', 'blue', './productImages/blueRulerStraightJeanM.jpg'),
    ('102', 'L', 'blue', './productImages/blueRulerStraightJeanM.jpg'),
    ('102', 'XL', 'blue', './productImages/blueRulerStraightJeanM.jpg'),

    #LazyWearSweatpantsM
    ('107', 'S', 'black', './productImages/blackLWSweatPantsM.jpg'),
    ('107', 'M', 'black', './productImages/blackLWSweatPantsM.jpg'),
	('107', 'L', 'black', './productImages/blackLWSweatPantsM.jpg'),
	('107', 'XL', 'black', './productImages/blackLWSweatPantsM.jpg'),

	('107', 'S', 'blue', './productImages/blueLWSweatPantsM.jpg'),
    ('107', 'M', 'blue', './productImages/blueLWSweatPantsM.jpg'),
    ('107', 'L', 'blue', './productImages/blueLWSweatPantsM.jpg'),
    ('107', 'XL', 'blue', './productImages/blueLWSweatPantsM.jpg'),


    #BootCutJeansW
    ('112', 'S', 'black', './productImages/blackBootCutJeanW.jpg'),
    ('112', 'M', 'black', './productImages/blackBootCutJeanW.jpg'),
	('112', 'L', 'black', './productImages/blackBootCutJeanW.jpg'),
	('112', 'XL', 'black', './productImages/blackBootCutJeanW.jpg'),

	('112', 'S', 'blue', './productImages/blueBootCutJeanW.jpg'),
    ('112', 'M', 'blue', './productImages/blueBootCutJeanW.jpg'),
    ('112', 'L', 'blue', './productImages/blueBootCutJeanW.jpg'),
    ('112', 'XL', 'blue', './productImages/blueBootCutJeanW.jpg'),

    #PerformanceLeggingsW
    ('115', 'S', 'black', './productImages/blackPerformanceLegW.jpg'),
    ('115', 'M', 'black', './productImages/blackPerformanceLegW.jpg'),
	('115', 'L', 'black', './productImages/blackPerformanceLegW.jpg'),
	('115', 'XL', 'black', './productImages/blackPerformanceLegW.jpg'),

	('115', 'S', 'blue', './productImages/bluePerformanceLegW.jpg'),
    ('115', 'M', 'blue', './productImages/bluePerformanceLegW.jpg'),
    ('115', 'L', 'blue', './productImages/bluePerformanceLegW.jpg'),
    ('115', 'XL', 'blue', './productImages/bluePerformanceLegW.jpg'),

    #WoolBlendedPleatPants
    ('117', 'S', 'black', './productImages/blackWoolPleatPantsW.jpg'),
    ('117', 'M', 'black', './productImages/blackWoolPleatPantsW.jpg'),
	('117', 'L', 'black', './productImages/blackWoolPleatPantsW.jpg'),
	('117', 'XL', 'black', './productImages/blackWoolPleatPantsW.jpg'),

	('117', 'S', 'green', './productImages/greenWoolPleatPantsW.jpg'),
    ('117', 'M', 'green', './productImages/greenWoolPleatPantsW.jpg'),
    ('117', 'L', 'green', './productImages/greenWoolPleatPantsW.jpg'),
    ('117', 'XL', 'green', './productImages/greenWoolPleatPantsW.jpg'),

    #StripedActivePantsM
    ('122', 'S', 'black', './productImages/blackStripedActivePants.jpg'),
    ('122', 'M', 'black', './productImages/blackStripedActivePants.jpg'),
	('122', 'L', 'black', './productImages/blackStripedActivePants.jpg'),
	('122', 'XL', 'black', './productImages/blackStripedActivePants.jpg'),

	('122', 'S', 'blue', './productImages/blueStripedActivePants.jpg'),
    ('122', 'M', 'blue', './productImages/blueStripedActivePants.jpg'),
    ('122', 'L', 'blue', './productImages/blueStripedActivePants.jpg'),
    ('122', 'XL', 'blue', './productImages/blueStripedActivePants.jpg'),

    ('122', 'S', 'red', './productImages/redStripedActivePants.jpg'),
    ('122', 'M', 'red', './productImages/redStripedActivePants.jpg'),
    ('122', 'L', 'red', './productImages/redStripedActivePants.jpg'),
    ('122', 'XL', 'red', './productImages/redStripedActivePants.jpg'),

    #FormalPantsM
    ('127', 'S', 'white', './productImages/whiteFormalPantsM.jpg'),
    ('127', 'M', 'white', './productImages/whiteFormalPantsM.jpg'),
	('127', 'L', 'white', './productImages/whiteFormalPantsM.jpg'),
	('127', 'XL', 'white', './productImages/whiteFormalPantsM.jpg'),

	('127', 'S', 'blue', './productImages/blueFormalPantsM.jpg'),
    ('127', 'M', 'blue', './productImages/blueFormalPantsM.jpg'),
    ('127', 'L', 'blue', './productImages/blueFormalPantsM.jpg'),
    ('127', 'XL', 'blue', './productImages/blueFormalPantsM.jpg'),

    ('127', 'S', 'red', './productImages/redFormalPantsM.jpg'),
    ('127', 'M', 'red', './productImages/redFormalPantsM.jpg'),
    ('127', 'L', 'red', './productImages/redFormalPantsM.jpg'),
    ('127', 'XL', 'red', './productImages/redFormalPantsM.jpg'),

    #FleeceSweatpantM
    ('132', 'S', 'blue', './productImages/blueFleeceSweatpant.jpg'),
    ('132', 'M', 'blue', './productImages/blueFleeceSweatpant.jpg'),
    ('132', 'L', 'blue', './productImages/blueFleeceSweatpant.jpg'),
    ('132', 'XL', 'blue', './productImages/blueFleeceSweatpant.jpg'),

    ('132', 'S', 'red', './productImages/redFleeceSweatpant.jpg'),
    ('132', 'M', 'red', './productImages/redFleeceSweatpant.jpg'),
    ('132', 'L', 'red', './productImages/redFleeceSweatpant.jpg'),
    ('132', 'XL', 'red', './productImages/redFleeceSweatpant.jpg');

    

Insert into Shirts (PID, Size, color, image) values
	#PlainTeeM
    ('101', 'S', 'white', './productImages/whitePlainTeeM.jpg'),
    ('101', 'M', 'white', './productImages/whitePlainTeeM.jpg'),
    ('101', 'L', 'white', './productImages/whitePlainTeeM.jpg'),
    ('101', 'XL', 'white', './productImages/whitePlainTeeM.jpg'),

    ('101', 'S', 'black', './productImages/blackPlainTeeM.jpg'),
    ('101', 'M', 'black', './productImages/blackPlainTeeM.jpg'),
    ('101', 'L', 'black', './productImages/blackPlainTeeM.jpg'),
    ('101', 'XL', 'black', './productImages/blackPlainTeeM.jpg'),

	('101', 'S', 'green', './productImages/greenPlainTeeM.jpg'),
    ('101', 'M', 'green', './productImages/greenPlainTeeM.jpg'),
    ('101', 'L', 'green', './productImages/greenPlainTeeM.jpg'),
    ('101', 'XL', 'green', './productImages/greenPlainTeeM.jpg'),

    ('101', 'S', 'red', './productImages/redPlainTeeM.jpg'),
    ('101', 'M', 'red', './productImages/redPlainTeeM.jpg'),
    ('101', 'L', 'red', './productImages/redPlainTeeM.jpg'),
    ('101', 'XL', 'red', './productImages/redPlainTeeM.jpg'),
    
    #SolidVneckM
    ('106', 'S', 'white', './productImages/whitePlainVeeM.jpg'),
    ('106', 'M', 'white', './productImages/whitePlainVeeM.jpg'),
    ('106', 'L', 'white', './productImages/whitePlainVeeM.jpg'),
    ('106', 'XL', 'white', './productImages/whitePlainVeeM.jpg'),

    ('106', 'S', 'black', './productImages/blackPlainVeeM.jpg'),
    ('106', 'M', 'black', './productImages/blackPlainVeeM.jpg'),
    ('106', 'L', 'black', './productImages/blackPlainVeeM.jpg'),
    ('106', 'XL', 'black', './productImages/blackPlainVeeM.jpg'),

	('106', 'S', 'green', './productImages/greenPlainVeeM.jpg'),
    ('106', 'M', 'green', './productImages/greenPlainVeeM.jpg'),
    ('106', 'L', 'green', './productImages/greenPlainVeeM.jpg'),
    ('106', 'XL', 'green', './productImages/greenPlainVeeM.jpg'),

    ('106', 'S', 'red', './productImages/redPlainVeeM.jpg'),
    ('106', 'M', 'red', './productImages/redPlainVeeM.jpg'),
    ('106', 'L', 'red', './productImages/redPlainVeeM.jpg'),
    ('106', 'XL', 'red', './productImages/redPlainVeeM.jpg'),
    
    
    #CottonCrewNeckW
    ('111', 'S', 'black', './productImages/blackCotCrewW.jpg'),
    ('111', 'M', 'black', './productImages/blackCotCrewW.jpg'),
    ('111', 'L', 'black', './productImages/blackCotCrewW.jpg'),
    ('111', 'XL', 'black', './productImages/blackCotCrewW.jpg'),

    ('111', 'S', 'white', './productImages/whiteCotCrewW.jpg'),
    ('111', 'M', 'white', './productImages/whiteCotCrewW.jpg'),
    ('111', 'L', 'white', './productImages/whiteCotCrewW.jpg'),
	('111', 'XL', 'white', './productImages/whiteCotCrewW.jpg'),

    #WoolySweaterW
    ('116', 'S', 'green', './productImages/greenWoolSwetrW.jpg'),
    ('116', 'M', 'green', './productImages/greenWoolSwetrW.jpg'),
    ('116', 'L', 'green', './productImages/greenWoolSwetrW.jpg'),
    ('116', 'XL', 'green', './productImages/greenWoolSwetrW.jpg'),

    ('116', 'S', 'white', './productImages/whiteWoolSwetrW.jpg'),
    ('116', 'M', 'white', './productImages/whiteWoolSwetrW.jpg'),
    ('116', 'L', 'white', './productImages/whiteWoolSwetrW.jpg'),
	('116', 'XL', 'white', './productImages/whiteWoolSwetrW.jpg'),

    #StripedSweaterM
    ('121', 'S', 'blue', './productImages/blueStripedHoodieM.jpg'),
    ('121', 'M', 'blue', './productImages/blueStripedHoodieM.jpg'),
    ('121', 'L', 'blue', './productImages/blueStripedHoodieM.jpg'),
    ('121', 'XL', 'blue', './productImages/blueStripedHoodieM.jpg'),

    ('121', 'S', 'red', './productImages/redStripedHoodieM.jpg'),
    ('121', 'M', 'red', './productImages/redStripedHoodieM.jpg'),
    ('121', 'L', 'red', './productImages/redStripedHoodieM.jpg'),
	('121', 'XL', 'red', './productImages/redStripedHoodieM.jpg'),

    #ButtonUpShirtM
    ('126', 'S', 'green', './productImages/greenButtonUpShirtM.jpg'),
    ('126', 'M', 'green', './productImages/greenButtonUpShirtM.jpg'),
    ('126', 'L', 'green', './productImages/greenButtonUpShirtM.jpg'),
    ('126', 'XL', 'green', './productImages/greenButtonUpShirtM.jpg'),

    ('126', 'S', 'white', './productImages/whiteButtonUpShirtM.jpg'),
    ('126', 'M', 'white', './productImages/whiteButtonUpShirtM.jpg'),
    ('126', 'L', 'white', './productImages/whiteButtonUpShirtM.jpg'),
	('126', 'XL', 'white', './productImages/whiteButtonUpShirtM.jpg'),

    ('126', 'S', 'blue', './productImages/blueButtonUpShirtM.jpg'),
    ('126', 'M', 'blue', './productImages/blueButtonUpShirtM.jpg'),
    ('126', 'L', 'blue', './productImages/blueButtonUpShirtM.jpg'),
    ('126', 'XL', 'blue', './productImages/blueButtonUpShirtM.jpg'),

    ('126', 'S', 'black', './productImages/blackButtonUpShirtM.jpg'),
    ('126', 'M', 'black', './productImages/blackButtonUpShirtM.jpg'),
    ('126', 'L', 'black', './productImages/blackButtonUpShirtM.jpg'),
    ('126', 'XL', 'black', './productImages/blackButtonUpShirtM.jpg'),

    #TurtleNeckSweaterW
    ('131', 'S', 'green', './productImages/greenTurtleNeckSweater.jpg'),
    ('131', 'M', 'green', './productImages/greenTurtleNeckSweater.jpg'),
    ('131', 'L', 'green', './productImages/greenTurtleNeckSweater.jpg'),
    ('131', 'XL', 'green', './productImages/greenTurtleNeckSweater.jpg'),

    ('131', 'S', 'white', './productImages/whiteTurtleNeckSweater.jpg'),
    ('131', 'M', 'white', './productImages/whiteTurtleNeckSweater.jpg'),
    ('131', 'L', 'white', './productImages/whiteTurtleNeckSweater.jpg'),
	('131', 'XL', 'white', './productImages/whiteTurtleNeckSweater.jpg'),

    ('131', 'S', 'red', './productImages/redTurtleNeckSweater.jpg'),
    ('131', 'M', 'red', './productImages/redTurtleNeckSweater.jpg'),
    ('131', 'L', 'red', './productImages/redTurtleNeckSweater.jpg'),
    ('131', 'XL', 'red', './productImages/redTurtleNeckSweater.jpg'),

    ('131', 'S', 'black', './productImages/blackTurtleNeckSweater.jpg'),
    ('131', 'M', 'black', './productImages/blackTurtleNeckSweater.jpg'),
    ('131', 'L', 'black', './productImages/blackTurtleNeckSweater.jpg'),
    ('131', 'XL', 'black', './productImages/blackTurtleNeckSweater.jpg');
    
Insert into Socks (PID, Size, color, image) values
	#FadedMellowSock
    ('105', '8', 'black', './productImages/blackFMSockM.jpg'),
    ('105', '9', 'black', './productImages/blackFMSockM.jpg'),
    ('105', '10', 'black', './productImages/blackFMSockM.jpg'),
    ('105', '11', 'black', './productImages/blackFMSockM.jpg'),
    ('105', '12', 'black', './productImages/blackFMSockM.jpg'),

    ('105', '8', 'white', './productImages/whiteFMSockM.jpg'),
    ('105', '9', 'white', './productImages/whiteFMSockM.jpg'),
    ('105', '10', 'white', './productImages/whiteFMSockM.jpg'),
    ('105', '11', 'white', './productImages/whiteFMSockM.jpg'),
    ('105', '12', 'white', './productImages/whiteFMSockM.jpg'),

    ('105', '8', 'green', './productImages/greenFMSockM.jpg'),
    ('105', '9', 'green', './productImages/greenFMSockM.jpg'),
    ('105', '10', 'green', './productImages/greenFMSockM.jpg'),
    ('105', '11', 'green', './productImages/greenFMSockM.jpg'),
    ('105', '12', 'green', './productImages/greenFMSockM.jpg'),

    ('105', '8', 'blue', './productImages/blueFMSockM.jpg'),
    ('105', '9', 'blue', './productImages/blueFMSockM.jpg'),
    ('105', '10', 'blue', './productImages/blueFMSockM.jpg'),
    ('105', '11', 'blue', './productImages/blueFMSockM.jpg'),
    ('105', '12', 'blue', './productImages/blueFMSockM.jpg'),

    #AthleticSocks
    ('110', '8', 'black', './productImages/blackAthleticSockM.jpg'),
    ('110', '9', 'black', './productImages/blackAthleticSockM.jpg'),
    ('110', '10', 'black', './productImages/blackAthleticSockM.jpg'),
    ('110', '11', 'black', './productImages/blackAthleticSockM.jpg'),
    ('110', '12', 'black', './productImages/blackAthleticSockM.jpg'),

    ('110', '8', 'white', './productImages/whiteAthleticSockM.jpg'),
    ('110', '9', 'white', './productImages/whiteAthleticSockM.jpg'),
    ('110', '10', 'white', './productImages/whiteAthleticSockM.jpg'),
    ('110', '11', 'white', './productImages/whiteAthleticSockM.jpg'),
    ('110', '12', 'white', './productImages/whiteAthleticSockM.jpg'),

    ('110', '8', 'blue', './productImages/blueAthleticSockM.jpg'),
    ('110', '9', 'blue', './productImages/blueAthleticSockM.jpg'),
    ('110', '10', 'blue', './productImages/blueAthleticSockM.jpg'),
    ('110', '11', 'blue', './productImages/blueAthleticSockM.jpg'),
    ('110', '12', 'blue', './productImages/blueAthleticSockM.jpg'),

    #FuzzyFestiveSockW
    ('120', '8', 'red', './productImages/redFuzzyFestiveSockW.jpg'),
    ('120', '9', 'red', './productImages/redFuzzyFestiveSockW.jpg'),
    ('120', '10', 'red', './productImages/redFuzzyFestiveSockW.jpg'),
    ('120', '11', 'red', './productImages/redFuzzyFestiveSockW.jpg'),
    ('120', '12', 'red', './productImages/redFuzzyFestiveSockW.jpg'),

    ('120', '8', 'white', './productImages/whiteFuzzyFestiveSockW.jpg'),
    ('120', '9', 'white', './productImages/whiteFuzzyFestiveSockW.jpg'),
    ('120', '10', 'white', './productImages/whiteFuzzyFestiveSockW.jpg'),
    ('120', '11', 'white', './productImages/whiteFuzzyFestiveSockW.jpg'),
    ('120', '12', 'white', './productImages/whiteFuzzyFestiveSockW.jpg'),

    ('120', '8', 'blue', './productImages/blueFuzzyFestiveSockW.jpg'),
    ('120', '9', 'blue', './productImages/blueFuzzyFestiveSockW.jpg'),
    ('120', '10', 'blue', './productImages/blueFuzzyFestiveSockW.jpg'),
    ('120', '11', 'blue', './productImages/blueFuzzyFestiveSockW.jpg'),
    ('120', '12', 'blue', './productImages/blueFuzzyFestiveSockW.jpg'),

    #SoftSockM
    ('125', '8', 'black', './productImages/blackSoftSockM.jpg'),
    ('125', '9', 'black', './productImages/blackSoftSockM.jpg'),
    ('125', '10', 'black', './productImages/blackSoftSockM.jpg'),
    ('125', '11', 'black', './productImages/blackSoftSockM.jpg'),
    ('125', '12', 'black', './productImages/blackSoftSockM.jpg'),

    ('125', '8', 'white', './productImages/whiteSoftSockM.jpg'),
    ('125', '9', 'white', './productImages/whiteSoftSockM.jpg'),
    ('125', '10', 'white', './productImages/whiteSoftSockM.jpg'),
    ('125', '11', 'white', './productImages/whiteSoftSockM.jpg'),
    ('125', '12', 'white', './productImages/whiteSoftSockM.jpg'),

    #FestiveSockM
    ('130', '8', 'red', './productImages/redFestiveSockM.jpg'),
    ('130', '9', 'red', './productImages/redFestiveSockM.jpg'),
    ('130', '10', 'red', './productImages/redFestiveSockM.jpg'),
    ('130', '11', 'red', './productImages/redFestiveSockM.jpg'),
    ('130', '12', 'red', './productImages/redFestiveSockM.jpg'),

    ('130', '8', 'black', './productImages/blackFestiveSockM.jpg'),
    ('130', '9', 'black', './productImages/blackFestiveSockM.jpg'),
    ('130', '10', 'black', './productImages/blackFestiveSockM.jpg'),
    ('130', '11', 'black', './productImages/blackFestiveSockM.jpg'),
    ('130', '12', 'black', './productImages/blackFestiveSockM.jpg'),

    ('130', '8', 'blue', './productImages/blueFestiveSockM.jpg'),
    ('130', '9', 'blue', './productImages/blueFestiveSockM.jpg'),
    ('130', '10', 'blue', './productImages/blueFestiveSockM.jpg'),
    ('130', '11', 'blue', './productImages/blueFestiveSockM.jpg'),
    ('130', '12', 'blue', './productImages/blueFestiveSockM.jpg'),

    #AnkleSocks
    ('135', '8', 'white', './productImages/whiteAnkleSocksW.jpg'),
    ('135', '9', 'white', './productImages/whiteAnkleSocksW.jpg'),
    ('135', '10', 'white', './productImages/whiteAnkleSocksW.jpg'),
    ('135', '11', 'white', './productImages/whiteAnkleSocksW.jpg'),
    ('135', '12', 'white', './productImages/whiteAnkleSocksW.jpg');
    
