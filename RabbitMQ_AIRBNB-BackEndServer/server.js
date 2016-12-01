//super simple rpc server example
var amqp	= require('amqp');
var util	= require('util');
var mongo	= require("./services/mongo");
var airbnb_services = require('./services/airbnb_services');

var connection = amqp.createConnection({
	host : '127.0.0.1'
});

connection.on('ready', function() {
	console.log("LISTENING ON QUEUES");
	
	connection.queue('register_new_property', function(q) {

		q.subscribe(function(message, headers, deliveryInfo, m) {

			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			airbnb_services.handle_register_new_property(message, function(err,
					res) {

				// return index sent
				connection.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});

			});
		});
	});
	connection.queue('admin_list_user', function(q) {

		q.subscribe(function(message, headers, deliveryInfo, m) {

			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			airbnb_services.handle_admin_list_user_request(message, function(err,
					res) {

				// return index sent
				connection.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});

			});
		});
	});
	
	connection.queue('admin_list_city_names', function(q) {


		q.subscribe(function(message, headers, deliveryInfo, m) {

			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			airbnb_services.handle_admin_list_city_names_request(message, function(err,

					res) {

				// return index sent
				connection.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});

			});
		});
	});
	
	connection.queue('admin_list_city_hosts', function(q) {


		q.subscribe(function(message, headers, deliveryInfo, m) {

			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			airbnb_services.handle_admin_list_city_hosts_request(message, function(err,

					res) {

				// return index sent
				connection.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});

			});
		});
	});
	
	connection.queue('admin_citywise_revenue', function(q) {

		q.subscribe(function(message, headers, deliveryInfo, m) {

			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			airbnb_services.handle_admin_citywise_revenue_request(message, function(err,
					res) {

				// return index sent
				connection.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});

			});
		});
	});
	
	connection.queue('admin_top_ten_properties', function(q) {


		q.subscribe(function(message, headers, deliveryInfo, m) {

			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			airbnb_services.handle_admin_top_ten_properties_request(message, function(err,

					res) {

				// return index sent
				connection.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});

			});
		});
	});


	
	connection.queue('register_new_user_queue', function(q) {

		q.subscribe(function(message, headers, deliveryInfo, m) {

			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			airbnb_services.handle_register_new_user_queue_request(message, function(err,
					res) {

				// return index sent
				connection.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});

			});
		});
	});
	
	connection.queue('admin_list_user', function(q) {

		q.subscribe(function(message, headers, deliveryInfo, m) {

			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			airbnb_services.handle_admin_list_user_request(message, function(err,
					res) {

				// return index sent
				connection.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});

			});
		});
	});
	
	
	connection.queue('admin_approve_user_queue', function(q) {

		q.subscribe(function(message, headers, deliveryInfo, m) {

			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			airbnb_services.handle_admin_approve_user_queue_request(message, function(err,
					res) {

				// return index sent
				connection.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});

			});
		});
	});
	
	connection.queue('property_list_queue', function(q) {

		q.subscribe(function(message, headers, deliveryInfo, m) {

			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			airbnb_services.handle_get_property_list_request(message, function(err,
					res) {

				// return index sent
				connection.publish(m.replyTo, res, {
					contentType : 'application/json',
					contentEncoding : 'utf-8',
					correlationId : m.correlationId
				});

			});
		});
	});	
});