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
			if (!vm.selectedListId() && vm.lists().length > 0) {
				vm.selectedListId(vm.lists()[0].id);
			}
		});
		
		io.on('listitems', function(data){
			console.log(data.listId, vm.selectedListId());
			if (data.listId === vm.selectedListId()){
				vm.listsItems(data.items);
			}
		});

		io.emit('showlists');

		ko.computed(function(){
			var id = vm.selectedListId();
			if (!id) return;
			io.emit("showlistitems", id);
		});
		
		vm.addList = function(){
			io.emit('addlist',  vm.listName())
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
	template: '<div class="container-fluid"> \
				   <div class="col-md-3"> \
					   	<ul data-bind="foreach: lists" class="nav nav-pills nav-stacked text-uppercase"> \
			               <li data-bind="css: {active:$parent.selectedListId() === id}"> \
	               			 <a href="#" data-bind="text: name, click: function() { $parent.selectedListId(id) }"></a> \
			               </li> \
					   </ul> \
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
	               <ul data-bind="foreach: listsItems" class="nav nav-pills nav-stacked"> \
	               	<li><a href="#" data-bind="text: text"></a></li> \
	               </ul> \
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