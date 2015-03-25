ko.components.register('lists',  {
	viewModel: function(params){
		var vm = this;
		vm.lists = ko.observableArray([]);
		vm.listsItems = ko.observableArray();

		vm.selectedListId = ko.observable();

		vm.listName = ko.observable();
		vm.itemText = ko.observable();

		var io = params.io;


		io.on('lists', function(lists){
			vm.lists(lists);
		});
		io.on('listitems', function(data){
			if (data.listId === vm.selectedListId()){
				vm.listsItems(data.items);
			}
		});

		ko.computed(function(){
			var id = vm.selectedListId();
			if (!id) return;
			io.emit("showlistitems", id);
		});
		
		vm.addList = function(){
			io.emit('addlist', { 
				name: vm.listName()
			});
			vm.listName("");
		}
		
		vm.addItem = function(){
			io.emit('addlistitem', { 
				listId: vm.selectedListId(),
				text: vm.itemText()
			});
			vm.itemText("");
		}
	},
	template: '<div class="container"> \
				   <div class="col-md-3"> \
					   	<div data-bind="foreach: lists"> \
			               <div data-bind="text: name, click: $parent.selectedListId(id)"></div> \
					   </div> \
		               	<form> \
		                    <div class="input-group"> \
		                        <input type="text" data-bind="value: listName" class="form-control"> \
				  		        <div class="input-group-btn"> \
		                            <button data-bind="click: addList" class="btn btn-default">Add</button> \
		                        </div> \
		                    </div> \
			  		   </form> \
				   </div> \
	               <div class="col-md-9"> \
	               	<form data-bind="if: selectedListId"> \
	                    <div class="input-group"> \
	                        <input type="text" data-bind="value: itemText" class="form-control"> \
			  		        <div class="input-group-btn"> \
	                            <button data-bind="click: addItem" class="btn btn-default">Add</button> \
	                        </div> \
	                    </div> \
		  		   </form> \
		  		   </div> \
	  		   </div>'
});