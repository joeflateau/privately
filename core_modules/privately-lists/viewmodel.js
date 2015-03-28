define(['knockout', 'text!./template.html'], function(ko, htmlString){

function ViewModel(params) {
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
			console.log(data.listId, vm.selectedList());
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
	}
	
	return { viewModel: ViewModel, template: htmlString };
});