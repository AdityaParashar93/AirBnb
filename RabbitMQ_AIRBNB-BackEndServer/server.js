//super simple rpc server example
var amqp						= require('amqp');
var util						= require('util');
var mongo						= require("./services/mongo");
var airbnb_property_services 	= require('./services/airbnb_property_services');
var airbnb_admin_services 		= require('./services/airbnb_admin_services');
var airbnb_host_services 		= require('./services/airbnb_host_services');
var airbnb_bidding_services		= require('./services/airbnb_bidding_services');
var airbnb_services				= require('./services/airbnb_services');
var profile 					= require('./services/Profile');
var winston						= require('winston');

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

			airbnb_property_services.handle_register_new_property(message, function(err,
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

			airbnb_admin_services.handle_admin_list_user_request(message, function(err,
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
	
	
	connection.queue('admin_list_property', function(q) {

		q.subscribe(function(message, headers, deliveryInfo, m) {

			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			airbnb_admin_services.handle_admin_list_property_request(message, function(err,
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
	
	connection.queue('admin_top_ten_hosts', function(q) {

		q.subscribe(function(message, headers, deliveryInfo, m) {

			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			airbnb_admin_services.handle_admin_top_ten_hosts_request(message, function(err,
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

			airbnb_admin_services.handle_admin_list_city_names_request(message, function(err,

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

			airbnb_admin_services.handle_admin_list_city_hosts_request(message, function(err,

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
	
	connection.queue('admin_host_analytics', function(q) {


		q.subscribe(function(message, headers, deliveryInfo, m) {

			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			airbnb_admin_services.handle_admin_host_analytics_request(message, function(err,

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

			airbnb_admin_services.handle_admin_citywise_revenue_request(message, function(err,
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

			airbnb_admin_services.handle_admin_top_ten_properties_request(message, function(err,

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

			airbnb_property_services.handle_register_new_user_queue_request(message, function(err,
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

			airbnb_admin_services.handle_admin_approve_user_queue_request(message, function(err,
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
	
	connection.queue('admin_approve_property_queue', function(q) {

		q.subscribe(function(message, headers, deliveryInfo, m) {

			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			airbnb_admin_services.handle_admin_approve_property_request(message, function(err,
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
	
	connection.queue('admin_dashboard_info', function(q) {

		q.subscribe(function(message, headers, deliveryInfo, m) {

			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			airbnb_admin_services.handle_admin_dashboard_info_request(message, function(err,
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
	
		connection.queue('admin_getbill_info', function(q) {


		q.subscribe(function(message, headers, deliveryInfo, m) {

			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			airbnb_admin_services.handle_admin_getbill_info_request(message, function(err,

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
	
	connection.queue('admin_gethost_graph_info', function(q) {


		q.subscribe(function(message, headers, deliveryInfo, m) {

			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			airbnb_admin_services.handle_admin_gethost_graph_info_request(message, function(err,

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

	
	connection.queue('admin_clicksper_Properties', function(q) {

		q.subscribe(function(message, headers, deliveryInfo, m) {

			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			airbnb_admin_services.handle_admin_clicksper_Properties_request(message, function(err,
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

			airbnb_property_services.handle_get_property_list_request(message, function(err,
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
	connection.queue('host_confirmation', function(q) {

		q.subscribe(function(message, headers, deliveryInfo, m) {

			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			airbnb_host_services.handle_host_confirmation(message, function(err,
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
	connection.queue('send_host_approval', function(q) {

		q.subscribe(function(message, headers, deliveryInfo, m) {

			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			airbnb_host_services.send_host_approval_request(message, function(err,
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
	
	
	connection.queue('property_clicks_queue', function(q) {

		q.subscribe(function(message, headers, deliveryInfo, m) {

			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
			airbnb_property_services.handle_property_clicks_request(message, function(err,
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
	connection.queue('property_book_queue', function(q) {

		q.subscribe(function(message, headers, deliveryInfo, m) {

			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			airbnb_property_services.handle_property_book_request(message, function(err,
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

    connection.queue('handle_get_profile_info', function(q) {

        q.subscribe(function(message, headers, deliveryInfo, m) {

            util.log(util.format(deliveryInfo.routingKey, message));
            util.log("Message: " + JSON.stringify(message));
            util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

            profile.handle_get_profile_info(message, function(err,res) {

                // return index sent
                connection.publish(m.replyTo, res, {
                    contentType : 'application/json',
                    contentEncoding : 'utf-8',
                    correlationId : m.correlationId
                });

            });
        });
    });


    connection.queue('get_listings', function(q) {

		q.subscribe(function(message, headers, deliveryInfo, m) {

			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			airbnb_services.getListings(message, function(err,
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

	connection.queue('get_host_listing', function(q) {

		q.subscribe(function(message, headers, deliveryInfo, m) {

			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			airbnb_services.getHostListings(message, function(err,
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

	connection.queue('change_trip_data', function(q) {

		q.subscribe(function(message, headers, deliveryInfo, m) {

			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			airbnb_services.change_trip_data(message, function(err,
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
connection.queue('bidding_queue', function(q) {


		q.subscribe(function(message, headers, deliveryInfo, m) {


			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));




			airbnb_bidding_services.bidProperty(message, function(err,
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




	connection.queue('highest_bidders_queue', function(q) {

		q.subscribe(function(message, headers, deliveryInfo, m) {

			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			airbnb_bidding_services.getHighestBidders(message, function(err,
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



connection.queue('change_trip_data', function(q) {		
		q.subscribe(function(message, headers, deliveryInfo, m) {		
			util.log(util.format(deliveryInfo.routingKey, message));		
			util.log("Message: " + JSON.stringify(message));		
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));		
			airbnb_services.change_trip_data(message, function(err,		
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
	
	connection.queue('submit_review', function(q) {

		q.subscribe(function(message, headers, deliveryInfo, m) {

			util.log(util.format(deliveryInfo.routingKey, message));
			util.log("Message: " + JSON.stringify(message));
			util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));

			airbnb_property_services.handle_submit_review(message, function(err,
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
	
	
