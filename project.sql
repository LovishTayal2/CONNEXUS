create database project;
use project;
create table users(email varchar(40) primary key , pwd varchar(40) , utype varchar(40) , status int);
drop table users;
select * from users;
update users set status=0 where email = 'aaa';
delete from users where email='tayal28@gmail.com';


create table iprofile(emailid varchar(40) primary key , name varchar(40),gender varchar(8) , dob date , address varchar(100) , city varchar(50) , contact bigint , ifields varchar(400) , insta varchar(60) ,facebook varchar(60), youtube varchar(60) , other varchar(500) , picpath varchar(100));
select * from iprofile;
drop table iprofile ;

create table events(rid int primary key auto_increment , emailid varchar(40) , eventt varchar(40)  , doe date , tos time , city varchar(40) , venue varchar(40));
select * from events;
drop table events;
delete from events where emailid='';

create table cprofile(email varchar(40) primary key , name varchar(40) , city varchar(40) , state varchar(40) , org varchar(40) , mobile bigint);
select * from cprofile;
