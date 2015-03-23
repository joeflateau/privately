function ViewModel(){
	this.component = ko.observable("chat");
}

ko.applyBindings(new ViewModel());