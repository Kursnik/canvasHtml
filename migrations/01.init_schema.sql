create database canvas;
grant usage on *.* to canvas@localhost identified by 'canvas17pass';
grant all privileges on canvas.* to canvas@localhost;

alter schema canvas  default character set utf8 ;
