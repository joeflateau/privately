ko.components.register('chat',  {
	viewModel: function(params){
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
	},
	template: '<div data-bind="foreach: messages"> \
	               <div class="alert" data-bind="text: text"></div> \
			   </div> \
               <form> \
                    <div class="input-group"> \
                        <input type="text" data-bind="value: message" class="form-control"> \
		  		        <div class="input-group-btn"> \
                            <button data-bind="click: send" class="btn btn-default">Send</button> \
                        </div> \
                    </div> \
	  		   </form>'
});