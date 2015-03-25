function ViewModel(){
	var vm = this;
	
	vm.component = ko.observable("chat");
	vm.modules = ko.observableArray([]);

	$.get("/api/modules", function(resp){
		vm.modules(resp);
	});
}

ko.applyBindings(new ViewModel());