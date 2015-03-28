define(['knockout', 'text!./template.html'], function(ko, htmlString){

	function ViewModel (params) {
		var vm = this;
		vm.messages = ko.observableArray([]);
		vm.message = ko.observable();
		var io = params.io;

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

		io.emit("listmessages");

		this.dispose = function(){
			io.off();
		}
	}

	return { viewModel: ViewModel, template: htmlString };
});