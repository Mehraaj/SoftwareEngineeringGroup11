select temp.vid, sum(temp.price) Total from (Select c.vid, pc.pid, pc.price from Cart c inner join ProductCatalog pc on pc.pid = c.pid) as temp
where temp.vid = 5 ;