ko.components.register('chat',  {
	viewModel: function(params){
		var vm = this;
		vm.messages = ko.observableArray([]);
		vm.message = ko.observable();
		io = params.io;

		io.on('received', function(message){
			vm.messages.push(message);
		});
		io.on('messages', function(messages){
			vm.messages(messages);
		});
		
		vm.send = function(){
			io.emit('send', { text: vm.message() });
			vm.message("");
		}
	},
	template: '<ul data-bind="foreach: messages">' +
		      '<li><span data-bind="text: text"></span></li>' +
			  '</ul>' + 
			  '<input type="text" data-bind="value: message">' +
			  '<button data-bind="click: send">Send</button>'
});