define(['knockout', '/socket.io/socket.io.js', '/api/modules/components.js'], function(ko, io){
	function ViewModel(){
		var vm = this;
		
		vm.component = ko.observable("chat");
		vm.modules = ko.observableArray([]);
		vm.io = io;

		$.get("/api/modules", function(resp){
			vm.modules(resp);
		});
	}

	ko.applyBindings(new ViewModel());
})