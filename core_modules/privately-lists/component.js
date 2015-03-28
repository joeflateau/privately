ko.components.register('lists',  {
	viewModel: function(params){
		var vm = this;
		vm.lists = ko.observableArray([]);
		vm.listsItems = ko.observableArray();

		vm.selectedList = ko.observable();

		vm.listName = ko.observable();
		vm.itemText = ko.observable();

		var io = params.io;

		io.on('lists', function(lists){
			vm.lists(lists);
			if (!vm.selectedList() && vm.lists().length > 0) {
				vm.selectedList(vm.lists()[0]);
			}
		});
		
		io.on('listitems', function(data){
			console.log(data.listId, vm.selectedListId());
			if (data.listId === vm.selectedList().id){
				vm.listsItems(data.items);
			}
		});

		io.emit('showlists');

		ko.computed(function(){
			var selectedList = vm.selectedList();
			if (!selectedList) return;
			io.emit("showlistitems", selectedList.id);
		});
		
		vm.addList = function(){
			io.emit('addlist',  vm.listName())
			vm.listName("");
		}
		
		vm.addItem = function(){
			io.emit('addlistitem', { 
				listId: vm.selectedList().id,
				text: vm.itemText()
			});
			vm.itemText("");
		}

		this.dispose = function(){
			io.off();
		}
	},
	template: '\
	<div class="col-md-8"> \
		<div class="panel panel-primary"> \
			<div class="panel-heading" data-bind="with: selectedList"> \
				<h3 class="panel-title" data-bind="text: name">Items</h3> \
			</div> \
			<div class="panel-body"> \
				<ul data-bind="foreach: listsItems" class="list-group tall"> \
					<li class="list-group-item"><a href="#" data-bind="text: text"></a></li> \
				</ul> \
			</div> \
			<div class="panel-footer"> \
				<form data-bind="if: selectedList"> \
					<div class="input-group"> \
						<input type="text" data-bind="value: itemText" class="form-control"> \
						<div class="input-group-btn"> \
							<button data-bind="click: addItem" class="btn btn-default">Add</button> \
						</div> \
					</div> \
				</form> \
			</div> \
		</div> \
	</div> \
	<div class="col-md-4"> \
		<div class="panel panel-default"> \
			<div class="panel-heading"> \
				<h3 class="panel-title">Lists</h3> \
			</div> \
			<div class="panel-body"> \
				<div data-bind="foreach: lists" class="list-group text-uppercase tall"> \
					<a class="list-group-item" data-bind="css: {active:$parent.selectedList() === $data}, \
						text: name, \
						click: function() { $parent.selectedList($data) }"></a> \
				</div> \
			</div> \
			<div class="panel-footer"> \
				<form> \
					<div class="input-group"> \
						<input type="text" data-bind="value: listName" class="form-control"> \
						<div class="input-group-btn"> \
							<button data-bind="click: addList" class="btn btn-default">Add</button> \
						</div> \
					</div> \
				</form> \
			</div> \
		</div> \
	</div>'
});