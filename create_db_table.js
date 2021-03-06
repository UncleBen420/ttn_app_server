#!/usr/bin/node

/*
Author: Robert Lie (mobilefish.com)
The create_table.js file creates the table sensor_data.
See LoRa/LoRaWAN Tutorial 27
https://www.mobilefish.com/download/lora/lora_part27.pdf

Prerequisites:
Install the following applications:
- MySQL version: 5.7.17 (mysql -V)
- Node JS version: v10.6.0 (node -v)
- NPM version: 6.5.0 (npm -v)

Usage:
1) Update file config.js
2) Execute the script: node create_table.js
3) Check if the table sensor_data is created using the webbased tool phpMyAdmin:
   http://localhost/~username/phpmyadmin/index.php
*/

const mysql = require('mysql');
const config = require('./config.js');


const con = mysql.createConnection(config.databaseOptions);

config.databaseOptions.database = "lora_tes2_db";

con.connect(function(err) {
    if (err) throw err;
    // MySQL 5.7 has fractional seconds support for DATETIME with up to microseconds (6 digits) precision:
    // DATETIME(6)
    // See: https://dev.mysql.com/doc/refman/5.7/en/fractional-seconds.html
    // The Things Network, the time is measured with 9 digits fractional-seconds, example: '2018-12-27T14:39:12.420921047Z'
    // Using this solution will lose some microseconds precision.
    // Because of this I have decided to store the time as a VARCHAR and NOT as a DATETIME(6)

    con.query("CREATE DATABASE IF NOT EXISTS " + config.databaseOptions.database, function (err, result) {
        if (err) throw err;
        console.log("Database " + config.databaseOptions.database + " created");
    });

    con.query("USE " + config.databaseOptions.database, function (err, result) {
        if (err) throw err;
    });

    con.query("	CREATE TABLE IF NOT EXISTS sensors (				\
			ID_SENSOR int auto_increment primary key,		\
			hardware_serial VARCHAR(64), 				\
			app_ID VARCHAR(64),					\
			access_key VARCHAR(64),					\
			name VARCHAR(16),					\
			icon VARCHAR(16),					\
			decoder VARCHAR(255),					\
			encoder VARCHAR(255))", function (err, result) {
        if (err) throw err;
        console.log("Table sensors created");
    });

    con.query("	CREATE TABLE IF NOT EXISTS sensor_data (			\
			ID_DATA int auto_increment primary key,			\
			port TINYINT,						\
			counter BIGINT,						\
			payload_raw TINYBLOB,					\
			time VARCHAR(30),					\
			frequency FLOAT(6,3),					\
			modulation VARCHAR(255),				\
			data_rate VARCHAR(255),					\
			airtime INT,						\
			coding_rate VARCHAR(3),					\
			gateways TEXT,						\
			id_sensor int NOT NULL,					\
			CONSTRAINT FK_data_per_sensor FOREIGN KEY (id_sensor)	\
				REFERENCES sensors (ID_SENSOR) 			\
				ON DELETE CASCADE 				\
				ON UPDATE CASCADE)", function (err, result) {
        if (err) throw err;
        console.log("Table sensor_data created");
    });

    con.end();

});
